import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

class TokenGenerator {
  constructor(secret = process.env.JWT_SECRET, defaultExpiry = '1h') {
    if (!secret) {
      throw new Error('JWT secret is required for TokenGenerator');
    }
    this.secret = secret;
    this.defaultExpiry = defaultExpiry;
  }

  generateToken(user, expiresIn = this.defaultExpiry) {
    if (!user) {
      throw new Error('User data is required to generate token');
    }

    const { _id, fname, lname, email, status } = user;

    return jwt.sign(
      {
        user_id: _id,
        fname,
        lname,
        email,
        status,
      },
      this.secret,
      { expiresIn }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export default TokenGenerator;
