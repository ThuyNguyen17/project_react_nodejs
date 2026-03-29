const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { getModel } = require('../../models/dynamicModel');

const router = express.Router();
const Student = getModel('students');
const User = getModel('users');
const Teacher = getModel('teachers');
const upload = multer({ storage: multer.memoryStorage() });

const byIdOrField = async (Model, idOrCode) => {
  if (mongoose.Types.ObjectId.isValid(idOrCode)) {
    const doc = await Model.findById(idOrCode);
    if (doc) return doc;
  }

  return Model.findOne({
    $or: [
      { _id: idOrCode },
      { username: idOrCode },
      { email: idOrCode },
      { code: idOrCode },
      { studentCode: idOrCode },
      { name: idOrCode }
    ]
  });
};

router.get('/', async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

router.post('/', async (req, res) => {
  try {
    const { fullName, studentCode, name, email, password, ...otherFields } = req.body;
    
    if (!fullName && !name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    if (!studentCode) {
      return res.status(400).json({ message: 'Student code is required' });
    }
    
    const existingStudent = await Student.findOne({ 
      $or: [{ studentCode }, { code: studentCode }] 
    });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this code already exists' });
    }
    
    const newStudent = new Student({
      fullName: fullName || name,
      studentCode,
      name: name || fullName,
      email,
      ...otherFields
    });
    
    await newStudent.save();
    res.status(201).json(newStudent);
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({ message: 'Error creating student', error: error.message });
  }
});

const verifyPassword = async (plainPassword, storedPassword) => {
  if (!storedPassword) return false;
  const isHash = typeof storedPassword === 'string' && /^\$2[aby]\$/.test(storedPassword);
  if (isHash) {
    return bcrypt.compare(plainPassword, storedPassword);
  }
  return plainPassword === storedPassword;
};

const findUserByUsername = async (username) => {
  const query = {
    $or: [
      { username },
      { email: username },
      { code: username },
      { studentCode: username },
      { name: username }
    ]
  };
  return (await User.findOne(query)) || (await Student.findOne(query)) || (await Teacher.findOne(query));
};

router.post('/login-new', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  const candidate = await findUserByUsername(username);
  if (!candidate) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const isValid = await verifyPassword(password, candidate.password);
  if (!isValid) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const data = candidate.toObject();
  const role = data.role || data.userRole || data.type || 'STUDENT';
  res.json({
    ...data,
    role,
    userId: data._id,
    teacherId: data.teacherId || data.userId || undefined
  });
});

router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Missing file upload' });
  }

  const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

  if (!rows.length) {
    return res.status(400).json({ message: 'Excel file is empty' });
  }

  await Student.insertMany(rows.map((row) => ({ ...row })));
  res.json({ message: 'Import completed', imported: rows.length });
});

router.get('/export', async (req, res) => {
  const rows = await Student.find().lean();
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, 'students');
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
  res.send(buffer);
});

router.get('/:id', async (req, res) => {
  const student = await byIdOrField(Student, req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

router.put('/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: false
  });
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json(student);
});

router.delete('/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).json({ message: 'Student not found' });
  res.json({ message: 'Student deleted' });
});

module.exports = router;
