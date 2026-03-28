const authService = require('../services/authService');

class AuthController {
  async login(req, res) {
    try {
      const { username, password } = req.body;
      const result = await authService.universalLogin(username, password);
      res.json(result);
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new AuthController();

