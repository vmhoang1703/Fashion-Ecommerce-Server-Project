const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

class AuthService {
  async authenticate(email, password) {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Lỗi xác thực người dùng:', error.message);
      throw error;
    }
  }

  generateToken(user) {
    const token = jwt.sign({ userId: user._id, email: user.email }, 'your-secret-key', { expiresIn: '1h' });
    return token;
  }

  verifyToken(token) {
    try {
      const decoded = jwt.verify(token, 'your-secret-key');
      return decoded;
    } catch (error) {
      return null;
    }
  }
}

module.exports = AuthService;
