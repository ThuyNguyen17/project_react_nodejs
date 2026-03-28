const timetableService = require('../services/timetableService');

class TimetableController {

  // ================= LẤY TKB THEO CLASS + TUẦN =================
  async getClassTimetable(req, res) {
    try {
      const { className } = req.params;
      const { week, year, semester } = req.query;

      const timetable = await timetableService.getClassTimetable(
        className,
        week,
        year,
        semester
      );

      res.json({
        success: true,
        timetable
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= LẤY TKB THEO NGÀY =================
  async getTimetableByDay(req, res) {
    try {
      const { className, day } = req.params;

      const timetable = await timetableService.getTimetableByDay(
        className,
        day
      );

      res.json({
        success: true,
        timetable
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ================= LỊCH THI =================
  async getExamSchedule(req, res) {
    try {
      const { studentId } = req.params;

      const examSchedule = await timetableService.getExamSchedule(studentId);

      res.json({
        success: true,
        examSchedule
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

}

module.exports = new TimetableController();