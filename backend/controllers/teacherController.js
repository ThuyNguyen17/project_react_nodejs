const teacherService = require('../services/teacherService');
const timetableService = require('../services/timetableService');

class TeacherController {

  // ================= LOGIN =================
  async login(req, res) {
    try {
      const { teacherId, password } = req.body;
      const result = await teacherService.login(teacherId, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  // ================= GET TIMETABLE (REAL DB) =================
  async getTimetable(req, res) {
    try {
      const { teacherId } = req.params;
      const { week, year, semester } = req.query;

      // 🔥 LẤY TỪ DATABASE
      const timetable = await timetableService.getTeacherTimetable(
        teacherId,
        week,
        year,
        semester
      );

      res.json({
        success: true,
        timetable
      });

    } catch (error) {
      console.error("Error get timetable:", error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new TeacherController();