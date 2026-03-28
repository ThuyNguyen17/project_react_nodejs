const Timetable = require('../models/Timetable');
const TeachingAssignment = require('../models/TeachingAssignment');
const SchoolClass = require('../models/SchoolClass');

class TimetableService {
  normalizeClassKey(value) {
    return String(value || '')
      .replace(/\s+/g, '')
      .toUpperCase();
  }

  async getTeacherTimetable(teacherCode, week, academicYear, semester) {
    const strict = !!(academicYear || semester);

    let assignments = await TeachingAssignment.find({
      teacherId: String(teacherCode),
      ...(academicYear ? { academicYear: Number(academicYear) } : {}),
      ...(semester ? { semester: Number(semester) } : {})
    });

    // If user is not filtering by year/semester, allow a fallback to "any assignment".
    if (!assignments.length && !strict) {
      assignments = await TeachingAssignment.find({ teacherId: String(teacherCode) });
    }

    return this.buildFlatTimetable(assignments, week);
  }

  async getClassTimetable(className, week, academicYear, semester) {
    const classCandidates = await this.resolveClassNameCandidates(className);
    if (!classCandidates.length) return [];

    const strict = !!(academicYear || semester);

    let assignments = await TeachingAssignment.find({
      className: { $in: classCandidates },
      ...(academicYear ? { academicYear: Number(academicYear) } : {}),
      ...(semester ? { semester: Number(semester) } : {})
    });

    // If user is not filtering by year/semester, allow a best-effort fallback (case-insensitive exact match).
    if (!assignments.length && !strict) {
      assignments = await TeachingAssignment.find({
        className: { $regex: new RegExp(`^${String(className || '').trim()}$`, 'i') }
      });
    }

    return this.buildFlatTimetable(assignments, week);
  }

  async buildFlatTimetable(assignments, week) {
    if (!assignments.length) return [];

    const assignmentIds = assignments.map((a) => a._id);
    const assignmentById = new Map(assignments.map((a) => [String(a._id), a]));

    let rows = await Timetable.find({
      teachingAssignmentId: { $in: assignmentIds },
      ...(week ? { week: Number(week) } : {})
    }).sort({ dayOfWeek: 1, period: 1 });

    // IMPORTANT: if week is explicitly selected and there is no data for that week,
    // return [] so the UI changes and reflects filtering.
    if (!rows.length && !week) {
      rows = await Timetable.find({
        teachingAssignmentId: { $in: assignmentIds }
      }).sort({ week: -1, dayOfWeek: 1, period: 1 });
    }

    return rows.map((row) => {
      const assignment = assignmentById.get(String(row.teachingAssignmentId));
      return {
        teachingAssignmentId: String(row.teachingAssignmentId),
        dayOfWeek: this.getDayName(row.dayOfWeek),
        period: Number(row.period),
        subject: assignment?.subjectName || '',
        className: assignment?.className || '',
        room: row.room || '',
        note: row.note || ''
      };
    });
  }

  async resolveClassNameCandidates(classNameInput) {
    const raw = String(classNameInput || '').trim();
    if (!raw) return [];

    const candidates = new Set([raw, raw.toUpperCase()]);

    // Match like "10A1", "11B"
    const match = raw.match(/^(\d+)\s*([A-Za-z]\w*)$/);
    if (match) {
      const gradeLevel = Number(match[1]);
      const simpleName = match[2].toUpperCase();

      const schoolClass = await SchoolClass.findOne({
        gradeLevel,
        className: simpleName
      });

      if (schoolClass) {
        candidates.add(String(schoolClass._id));
        candidates.add(`${schoolClass.gradeLevel}${schoolClass.className}`);
      }
    }

    return Array.from(candidates);
  }

  getDayName(dayValue) {
    if (typeof dayValue === 'string' && dayValue.trim()) {
      return dayValue.trim().toUpperCase();
    }

    const days = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];

    return days[Number(dayValue)] || 'MONDAY';
  }
}

module.exports = new TimetableService();

