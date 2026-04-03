// controllers/studentController.js
const Student = require('../models/Student');
const User = require('../models/User');
const Teacher = require('../models/Teacher');
const StudentClass = require('../models/StudentClass');
const SchoolClass = require('../models/SchoolClass');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const ExcelJS = require('exceljs');
const fs = require('fs/promises');
const studentService = require('../service/studentService');

// upload config
const upload = multer({ dest: 'uploads/' });

const getClassDisplayName = (schoolClass) => {
    const rawClassName = String(schoolClass.className || '').trim();
    const gradeLevel = schoolClass.gradeLevel ?? schoolClass.grade ?? '';
    return `${gradeLevel}${rawClassName}`.trim() || rawClassName;
};

const loadAllSchoolClasses = async () => {
    const classes = await SchoolClass.find().lean();
    const db = require('mongoose').connection.db;
    const extraClasses = [];

    for (const collectionName of ['school_classes', 'classes']) {
        const docs = await db.collection(collectionName).find({}).toArray();
        extraClasses.push(...docs);
    }

    const merged = [...classes, ...extraClasses];
    const grouped = new Map();

    merged.forEach((schoolClass) => {
        const displayName = getClassDisplayName(schoolClass);
        const key = displayName || String(schoolClass._id || '').trim();
        const existing = grouped.get(key);
        const aliases = new Set([
            String(schoolClass._id || '').trim(),
            String(schoolClass.className || '').trim(),
            displayName
        ].filter(Boolean));

        if (!existing) {
            grouped.set(key, { ...schoolClass, aliases });
            return;
        }

        existing.aliases = new Set([...(existing.aliases || []), ...aliases]);
        if (String(existing._id || '').includes('69ca') && String(schoolClass._id || '').includes('69cd')) {
            grouped.set(key, { ...schoolClass, aliases: existing.aliases });
        }
    });

    return Array.from(grouped.values()).map((schoolClass) => ({
        ...schoolClass,
        aliases: Array.from(schoolClass.aliases || [])
    }));
};

const resolveSchoolClass = async (className) => {
    const normalizedClassName = String(className || '').trim();
    const classes = await loadAllSchoolClasses();

    return classes.find((schoolClass) => {
        const aliases = Array.isArray(schoolClass.aliases) ? schoolClass.aliases : [];
        return aliases.includes(normalizedClassName);
    }) || null;
};

const normalizeHeader = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');

const parseExcelDate = (value) => {
    if (!value) return null;
    if (value instanceof Date) return value;
    if (typeof value === 'number') {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        const parsed = new Date(excelEpoch.getTime() + value * 24 * 60 * 60 * 1000);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getCellValue = (cell) => {
    if (!cell) return '';
    const raw = cell.text ?? cell.result ?? cell.value ?? '';
    return typeof raw === 'string' ? raw.trim() : raw;
};

const buildRowPayload = (headerMap, row) => {
    const getByKeys = (...keys) => {
        for (const key of keys) {
            const columnIndex = headerMap.get(key);
            if (columnIndex) return getCellValue(row.getCell(columnIndex));
        }
        return '';
    };

    return {
        studentCode: String(getByKeys('masinhvien', 'studentcode', 'code', 'mssv')).trim(),
        fullName: String(getByKeys('hovaten', 'hoten', 'fullname', 'name', 'tensinhvien')).trim(),
        email: String(getByKeys('email', 'mail')).trim(),
        phone: String(getByKeys('sodienthoai', 'phone', 'dienthoai')).trim(),
        address: String(getByKeys('diachi', 'address')).trim(),
        gender: String(getByKeys('gioitinh', 'gender')).trim(),
        dateOfBirth: parseExcelDate(getByKeys('ngaysinh', 'dateofbirth', 'dob'))
    };
};

const syncStudentToClass = async (studentId, classNameOrId) => {
    const schoolClass = await resolveSchoolClass(classNameOrId);
    const classId = String(
        schoolClass?._id
        || schoolClass?.classId
        || getClassDisplayName(schoolClass || {})
        || classNameOrId
        || ''
    ).trim();

    if (!classId) return null;

    let mapping = await StudentClass.findOne({ studentId: String(studentId), classId });
    if (!mapping) {
        const allMappings = await StudentClass.find({ studentId: String(studentId) });
        mapping = allMappings.find((item) => String(item.classId || '').trim() === classId) || null;
    }

    if (!mapping) {
        mapping = await StudentClass.create({
            studentId: String(studentId),
            classId
        });
    }

    return mapping;
};

const getStudentsByClassData = async (className) => {
    const normalizedClassName = String(className || '').trim();
    const schoolClass = await resolveSchoolClass(normalizedClassName);

    const normalizedClassNames = new Set([normalizedClassName]);
    if (schoolClass) {
        (schoolClass.aliases || []).forEach((alias) => normalizedClassNames.add(String(alias || '').trim()));
    }

    const mappings = (await StudentClass.find().lean()).filter((mapping) => {
        const mappingClassId = String(mapping.classId || '').trim();
        return Array.from(normalizedClassNames).filter(Boolean).includes(mappingClassId);
    });

    const classLabels = Array.from(new Set([
        normalizedClassName,
        String(schoolClass?.className || '').trim(),
        getClassDisplayName(schoolClass || {})
    ].filter(Boolean)));

    const mappedStudentIds = Array.from(new Set(
        mappings
            .map((mapping) => String(mapping.studentId || '').trim())
            .filter(Boolean)
    ));

    const objectIdStudentIds = mappedStudentIds.filter((value) => mongoose.Types.ObjectId.isValid(value));
    const mappedStudents = mappedStudentIds.length > 0
        ? await Student.find({
            $or: [
                { _id: { $in: objectIdStudentIds } },
                { userId: { $in: mappedStudentIds } },
                { studentCode: { $in: mappedStudentIds } }
            ]
        }).lean()
        : [];

    const classStudents = await Student.find({
        studentClass: { $in: classLabels }
    }).lean();

    const mergedStudentsMap = new Map();
    [...mappedStudents, ...classStudents].forEach((student) => {
        const key = String(student._id);
        if (!mergedStudentsMap.has(key)) {
            mergedStudentsMap.set(key, student);
        }
    });

    const students = Array.from(mergedStudentsMap.values());

    const mappingByStudentId = new Map();
    mappings.forEach((mapping) => {
        const mappingStudentId = String(mapping.studentId || '').trim();
        mappingByStudentId.set(mappingStudentId, mapping);
    });

    return students.map((student) => {
        const mapping = mappingByStudentId.get(String(student._id))
            || mappingByStudentId.get(String(student.userId || '').trim())
            || mappingByStudentId.get(String(student.studentCode || '').trim());

        return {
            id: String(student._id),
            studentId: String(student._id),
            fullName: student.fullName || '',
            studentCode: student.studentCode || '',
            email: student.contact?.email || student.email || '',
            phone: student.contact?.phone || '',
            dob: student.dateOfBirth || null,
            contact: student.contact || {},
            seatRow: mapping?.seatRow ?? null,
            seatColumn: mapping?.seatColumn ?? null,
            notes: mapping?.notes ?? student.notes ?? ''
        };
    });
};

// ==============================
// LOGIN NEW (username + password)
// ==============================
exports.loginNew = async (req, res) => {
    try {
        const { username, password } = req.body;
        const normalizedUsername = (username || '').trim();

        if (!normalizedUsername || !password) {
            return res.status(400).json({
                message: 'Username and password are required'
            });
        }

        const user = await User.findOne({ username: normalizedUsername });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (user.isActive === false) {
            return res.status(403).json({ message: 'Account is disabled' });
        }

        const isHashedMatch = await bcrypt.compare(password, user.password).catch(() => false);
        const isLegacyPlainMatch = password === user.password;

        if (!isHashedMatch && !isLegacyPlainMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const safeUser = {
            _id: user._id,
            userId: user._id,
            username: user.username,
            role: user.role,
            isActive: user.isActive
        };

        let studentResponse = null;
        let teacherResponse = null;

        if (user.role === 'STUDENT') {
            const student = await Student.findOne({
                $or: [
                    { userId: user._id.toString() },
                    { userId: user._id },
                    { studentCode: user.username }
                ]
            });

            let className = null;
            let studentClass = null;
            const studentId = student?._id?.toString();

            if (studentId) {
                studentClass = await StudentClass.findOne({ studentId });
            }

            if (!studentClass) {
                studentClass = await StudentClass.findOne({ studentId: user.username });
            }

            if (!studentClass) {
                studentClass = await StudentClass.findOne({ studentId: user._id.toString() });
            }

            if (studentClass) {
                const schoolClass = await SchoolClass.findById(studentClass.classId);
                if (schoolClass) {
                    className = `${schoolClass.gradeLevel}${schoolClass.className}`;
                }
            }

            if (student) {
                studentResponse = { ...student.toObject(), className };
                safeUser.studentId = student._id;
                safeUser.studentCode = student.studentCode;
                safeUser.fullName = student.fullName;
                safeUser.className = className;
            } else {
                studentResponse = {
                    _id: user._id,
                    userId: user._id,
                    studentCode: user.username,
                    fullName: user.username,
                    className
                };
                safeUser.studentCode = user.username;
                safeUser.fullName = user.username;
                safeUser.className = className;
            }
        }

        if (user.role === 'TEACHER') {
            const teacher = await Teacher.findOne({
                $or: [
                    { userId: user._id.toString() },
                    { userId: user._id },
                    { teacherCode: user.username }
                ]
            });

            if (teacher) {
                teacherResponse = teacher.toObject();
                safeUser.teacherId = teacher._id;
                safeUser.teacherCode = teacher.teacherCode;
                safeUser.fullName = teacher.fullName;
            } else {
                safeUser.teacherCode = user.username;
                safeUser.fullName = user.username;
            }
        }

        if (user.role === 'ADMIN') {
            safeUser.fullName = user.username;
        }

        res.json({
            success: true,
            user: safeUser,
            student: studentResponse,
            teacher: teacherResponse
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET SUBJECTS
// ==============================
exports.getSubjects = async (req, res) => {
    try {
        const { studentId } = req.params;
        const data = await studentService.getStudentSubjects(studentId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET ATTENDANCE
// ==============================
exports.getAttendanceDetails = async (req, res) => {
    try {
        const { studentId, assignmentId } = req.params;
        const data = await studentService.getAttendanceDetails(studentId, assignmentId);
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// CRUD
// ==============================
exports.getAllStudents = async (req, res) => {
    const students = await Student.find();
    res.json(students);
};

exports.getStudentById = async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.json(student);
};

exports.createStudent = async (req, res) => {
    const student = await Student.create(req.body);
    res.json(student);
};

exports.updateStudent = async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.json({ success: true, message: 'Student Updated!' });
};

exports.deleteStudent = async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Student Deleted!' });
};

// ==============================
// IMPORT EXCEL
// ==============================
exports.importStudents = [
    upload.single('file'),
    async (req, res) => {
        const uploadedFilePath = req.file?.path;
        try {
            const workbook = new ExcelJS.Workbook();
            if ((req.file?.originalname || '').toLowerCase().endsWith('.csv')) {
                await workbook.csv.readFile(req.file.path);
            } else {
                await workbook.xlsx.readFile(req.file.path);
            }

            const sheet = workbook.worksheets[0];
            if (!sheet || sheet.rowCount < 2) {
                return res.status(400).json({ message: 'File import không có dữ liệu hợp lệ' });
            }

            const seenStudentCodes = new Set();
            let created = 0;
            let updated = 0;
            let skipped = 0;

            for (let i = 2; i <= sheet.rowCount; i++) {
                const row = sheet.getRow(i);
                const studentCode = String(getCellValue(row.getCell(1))).trim();
                const fullName = String(getCellValue(row.getCell(2))).trim();
                const email = String(getCellValue(row.getCell(3))).trim();

                if (!studentCode || !fullName) {
                    skipped += 1;
                    continue;
                }
                if (seenStudentCodes.has(studentCode)) {
                    skipped += 1;
                    continue;
                }
                seenStudentCodes.add(studentCode);

                let user = await User.findOne({ username: studentCode, role: 'STUDENT' }) || await User.findOne({ username: studentCode });
                let student = await Student.findOne({ studentCode });

                if (!user) {
                    user = await User.create({
                        username: studentCode,
                        password: await bcrypt.hash('123456', 10),
                        role: 'STUDENT',
                        isActive: true
                    });
                } else if (user.role !== 'STUDENT') {
                    skipped += 1;
                    continue;
                }

                const payload = {
                    userId: String(user._id),
                    studentCode,
                    fullName,
                    contact: {
                        email
                    }
                };

                if (student) {
                    await Student.updateOne({ _id: student._id }, payload);
                    updated += 1;
                } else {
                    await Student.create(payload);
                    created += 1;
                }
            }

            res.json({ message: 'Import successful', summary: { created, updated, skipped } });
        } catch (err) {
            res.status(500).json({ message: err.message });
        } finally {
            if (uploadedFilePath) {
                await fs.unlink(uploadedFilePath).catch(() => {});
            }
        }
    }
];

exports.importStudentsWithClass = [
    upload.single('file'),
    async (req, res) => {
        const uploadedFilePath = req.file?.path;

        try {
            const targetClass = String(req.body.classId || '').trim();
            if (!req.file) {
                return res.status(400).json({ message: 'File is required' });
            }
            if (!targetClass) {
                return res.status(400).json({ message: 'classId is required' });
            }

            const workbook = new ExcelJS.Workbook();
            if ((req.file.originalname || '').toLowerCase().endsWith('.csv')) {
                await workbook.csv.readFile(req.file.path);
            } else {
                await workbook.xlsx.readFile(req.file.path);
            }
            const sheet = workbook.worksheets[0];

            if (!sheet || sheet.rowCount < 2) {
                return res.status(400).json({ message: 'File import không có dữ liệu hợp lệ' });
            }

            const headerRow = sheet.getRow(1);
            const headerMap = new Map();
            headerRow.eachCell((cell, colNumber) => {
                headerMap.set(normalizeHeader(getCellValue(cell)), colNumber);
            });

            const seenStudentCodes = new Set();
            const created = [];
            const updated = [];
            const skipped = [];

            for (let i = 2; i <= sheet.rowCount; i += 1) {
                const row = sheet.getRow(i);
                const payload = buildRowPayload(headerMap, row);

                if (!payload.studentCode || !payload.fullName) {
                    skipped.push({ row: i, reason: 'Thiếu mã sinh viên hoặc họ tên' });
                    continue;
                }

                const normalizedCode = payload.studentCode.trim();
                if (seenStudentCodes.has(normalizedCode)) {
                    skipped.push({ row: i, studentCode: normalizedCode, reason: 'Trùng mã trong file import' });
                    continue;
                }
                seenStudentCodes.add(normalizedCode);

                let student = await Student.findOne({ studentCode: normalizedCode });
                let user = await User.findOne({ username: normalizedCode, role: 'STUDENT' });

                if (!user) {
                    user = await User.findOne({ username: normalizedCode });
                }

                if (!student && user) {
                    student = await Student.findOne({ userId: String(user._id) });
                }

                if (!user) {
                    user = await User.create({
                        username: normalizedCode,
                        password: await bcrypt.hash('123456', 10),
                        role: 'STUDENT',
                        isActive: true
                    });
                } else if (user.role !== 'STUDENT') {
                    skipped.push({ row: i, studentCode: normalizedCode, reason: 'Username đã tồn tại nhưng không phải tài khoản học sinh' });
                    continue;
                }

                const studentPayload = {
                    userId: String(user._id),
                    studentCode: normalizedCode,
                    fullName: payload.fullName,
                    studentClass: targetClass,
                    gender: payload.gender || undefined,
                    dateOfBirth: payload.dateOfBirth || undefined,
                    contact: {
                        phone: payload.phone || '',
                        email: payload.email || '',
                        address: payload.address || ''
                    }
                };

                if (student) {
                    await Student.updateOne({ _id: student._id }, studentPayload);
                    updated.push(normalizedCode);
                    student = await Student.findById(student._id);
                } else {
                    student = await Student.create(studentPayload);
                    created.push(normalizedCode);
                }

                await syncStudentToClass(student._id, targetClass);
            }

            return res.json({
                success: true,
                message: `Import hoàn tất cho lớp ${targetClass}`,
                summary: {
                    created: created.length,
                    updated: updated.length,
                    skipped: skipped.length
                },
                created,
                updated,
                skipped
            });
        } catch (err) {
            return res.status(500).json({ message: err.message });
        } finally {
            if (uploadedFilePath) {
                await fs.unlink(uploadedFilePath).catch(() => {});
            }
        }
    }
];

// ==============================
// EXPORT EXCEL
// ==============================
exports.exportStudents = async (req, res) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Students');

    sheet.columns = [
        { header: 'Code', key: 'studentCode' },
        { header: 'Name', key: 'fullName' },
        { header: 'Email', key: 'email' }
    ];

    const className = String(req.query.className || req.query.classId || '').trim();
    const students = className
        ? await getStudentsByClassData(className)
        : await Student.find().lean();

    students.forEach((student) => {
        sheet.addRow({
            studentCode: student.studentCode || '',
            fullName: student.fullName || '',
            email: student.email || student.contact?.email || ''
        });
    });

    res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
        'Content-Disposition',
        `attachment; filename=${className ? `students_${className}` : 'students'}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
};

// ==============================
// GET BY CLASS
// ==============================
exports.getStudentsByClass = async (req, res) => {
    try {
        const result = await getStudentsByClassData(req.params.className);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// GET BY USERID
// ==============================
exports.getStudentByUserId = async (req, res) => {
    try {
        let student = await Student.findOne({ userId: req.params.userId });
        if (!student) {
            student = await Student.findOne({ _id: req.params.userId });
        }
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.json({ id: student._id, ...student.toObject() });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// ==============================
// UPDATE SEATING
// ==============================
exports.updateStudentSeating = async (req, res) => {
    try {
        const { seatRow, seatColumn, notes } = req.body;
        const className = String(req.params.className || '').trim();
        const schoolClass = await resolveSchoolClass(className);

        const normalizedClassNames = new Set([className]);
        if (schoolClass) {
            (schoolClass.aliases || []).forEach((alias) => normalizedClassNames.add(String(alias || '').trim()));
        }

        const targetStudentId = String(req.params.studentId).trim();
        const allowedClassIds = Array.from(normalizedClassNames).filter(Boolean);
        const allMappings = await StudentClass.find();

        let mapping = allMappings.find((item) => {
            return String(item.studentId || '').trim() === targetStudentId
                && allowedClassIds.includes(String(item.classId || '').trim());
        });
        if (!mapping) {
            mapping = allMappings.find((item) => (
                String(item.studentId || '').trim() === targetStudentId
            )) || await StudentClass.findOne({
                studentId: String(req.params.studentId)
            });
        }

        if (!mapping) {
            const targetClassId = String(
                schoolClass?._id
                || schoolClass?.classId
                || getClassDisplayName(schoolClass || {})
                || className
            ).trim();

            mapping = await StudentClass.create({
                studentId: targetStudentId,
                classId: targetClassId
            });
        }

        if (seatRow !== undefined) mapping.seatRow = seatRow;
        if (seatColumn !== undefined) mapping.seatColumn = seatColumn;
        if (notes !== undefined) mapping.notes = notes;
        await mapping.save();

        res.json({
            success: true,
            message: 'Seating Updated!',
            data: mapping
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
