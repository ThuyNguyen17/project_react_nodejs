const attendanceService = require('../services/attendanceService');

class AttendanceController {
  async startSession(req, res) {
    try {
      const session = await attendanceService.startSession(req.body);
      res.json(session);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateToken(req, res) {
    try {
      const { sessionId } = req.params;
      const { token } = req.body;
      const session = await attendanceService.updateQrToken(sessionId, token);
      res.json(session);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async recordAttendance(req, res) {
    try {
      const attendance = await attendanceService.recordAttendance(req.body);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getPendingStudents(req, res) {
    try {
      const { sessionId } = req.params;
      const students = await attendanceService.getPendingStudents(sessionId);
      res.json(students);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAttendances(req, res) {
    try {
      const { sessionId } = req.params;
      const attendance = await attendanceService.getAttendances(sessionId);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async closeSession(req, res) {
    try {
      const { sessionId } = req.params;
      await attendanceService.closeSession(sessionId);
      res.json({ success: true });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async clearAttendances(req, res) {
    try {
      const { sessionId } = req.params;
      await attendanceService.deleteAttendancesBySession(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateNote(req, res) {
    try {
      const { attendanceId } = req.params;
      const { note } = req.body;
      const attendance = await attendanceService.updateAttendanceNote(attendanceId, note);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AttendanceController();
