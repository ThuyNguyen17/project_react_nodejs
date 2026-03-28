const studentService = require('../services/studentService');
const authService = require('../services/authService');

class StudentController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await studentService.login(username, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async loginByStudentCode(req, res) {
    try {
      const { studentCode } = req.body;
      const result = await studentService.loginByStudentCode(studentCode);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async loginNew(req, res) {
    try {
      const { username, password } = req.body;
      
      // Use universal login that handles both teacher and student
      const result = await authService.universalLogin(username, password);
      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStudentSubjects(req, res) {
    try {
      const { studentId } = req.params;
      const subjects = await studentService.getStudentSubjects(studentId);
      res.json(subjects);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getAttendanceDetails(req, res) {
    try {
      const { studentId, assignmentId } = req.params;
      const attendance = await studentService.getAttendanceDetails(studentId, assignmentId);
      res.json(attendance);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getStudentsByClass(req, res) {
    try {
      const { className } = req.params;
      const students = await studentService.getStudentsByClass(className);
      res.json(students);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new StudentController();
