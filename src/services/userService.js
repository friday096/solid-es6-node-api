// services/UserService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenGenerator from '../utils/TokenGenerator.js';
import EmailService from '../utils/EmailService.js';
import { HTTP_STATUS, RESPONSE_STATUS } from '../utils/constant.js';
import { RESPONSE_MESSAGES } from '../utils/response-message.js';
import { comparePasswords, hashPassword } from '../utils/index.js';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.tokenGenerator = new TokenGenerator();
    this.emailService = new EmailService();
  }

  async createUser(payload) {
    try {
      // Check if the email already exists
      const existingUser = await this.userRepository.findByEmail(payload.email);
      if (existingUser) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.EMAIL_ALREADY_IN_USE,
          httpStatus: HTTP_STATUS.CONFLICT, // Conflict
        };
      }
  
      // Hash the password from the payload
      payload.password = await hashPassword(payload.password);
  
      // Create a new user using the data from the payload
      const newUser = await this.userRepository.create({
        ...payload,
        status: payload.status || 1, // Default status if not provided
      });
  
      // Define the JWT payload (the data to encode in the token)
      const tokenPayload = {
        id: newUser._id,
        email: newUser.email,
        fname: newUser.fname,
        lname: newUser.lname,
        status: newUser.status, // Include any additional fields needed for the JWT
        role: newUser.role,     // Example: Include user role if applicable
      };
  
      // Generate JWT token using the tokenPayload
      const token = this.tokenGenerator.generateToken(tokenPayload);
  
      // Save the token in the database (optional, if you want to keep it stored)
      await this.userRepository.update(newUser._id, { token });
  
      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.USER_CREATED,
        token,
        httpStatus: HTTP_STATUS.SUCCESS, // Created
      };
    } catch (error) {
      // Handle unexpected errors
      console.error('Error creating user:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }
  

  async loginUser(email, password) {
    try {
      const user = await this.userRepository.findByEmail(email);
      
      // Use comparePasswords function to check password
      if (!user || !(await comparePasswords(password, user.password || ""))) {
        console.log('unnnn')
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          httpStatus: HTTP_STATUS.UNAUTHORIZED, // Unauthorized
        };
      }
  
      // Generate token after successful login
      const token = this.tokenGenerator.generateToken(user);
      
      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.LOGIN_SUCCESS,
        token,
        httpStatus: HTTP_STATUS.OK, // OK
      };
    } catch (error) {
      console.error('Error logging in user:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }

  async sendResetLink(email) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          httpStatus: HTTP_STATUS.NOT_FOUND, // Not Found
        };
      }

      // Generate the reset token
      const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const resetUrl = `http://yourdomain.com/reset-password/${resetToken}`;

      await this.emailService.send(user.email, 'Password Reset', `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`);
      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RESET_LINK_SENT,
        httpStatus: HTTP_STATUS.OK, // OK
      };
    } catch (error) {
      console.error('Error sending reset link:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }

  async verifyTokenAndResetPassword(token, password) {
    try {
      // Verify the token to extract the user ID
      const decoded = this.tokenGenerator.verifyToken(token); // Verify the token first
      const userId = decoded.user_id; // Extract the user ID from the token
      const user = await this.userRepository.findById(userId); // Retrieve the user by ID

      if (!user) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          httpStatus: HTTP_STATUS.NOT_FOUND, // Not Found
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password

      // Use the update method from userRepository instead of findByIdAndUpdate
      const updatedUser = await this.userRepository.update(
        userId, // Find the user by ID
        { password: hashedPassword } // Update the password field
      );

      if (!updatedUser) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.PASSWORD_UPDATE_FAILED,
          httpStatus: HTTP_STATUS.INTERNAL_SERVER_ERROR, // Internal Server Error
        };
      }

      // Return success message
      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.PASSWORD_RESET_SUCCESS,
        httpStatus: HTTP_STATUS.OK, // OK
      };
    } catch (error) {
      console.error('Error verifying token and resetting password:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }

  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          httpStatus: HTTP_STATUS.NOT_FOUND, // Not Found
        };
      }
      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RETRIEVED,
        data: user,
        httpStatus: HTTP_STATUS.OK, // OK
      };
    } catch (error) {
      console.error('Error retrieving user by ID:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }

  async getAllUsers() {
    try {
      const users = await this.userRepository.getAll(); // Fetch all users
      if (!users || users.length === 0) {
        return {
          status: RESPONSE_STATUS.ERROR,
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          httpStatus: HTTP_STATUS.NOT_FOUND, // Not Found
        };
      }

      return {
        status: RESPONSE_STATUS.SUCCESS,
        message: RESPONSE_MESSAGES.RETRIEVED,
        data: users,
        httpStatus: HTTP_STATUS.OK, // OK
      };
    } catch (error) {
      console.error('Error retrieving all users:', error);
      return {
        status: RESPONSE_STATUS.ERROR,
        message: RESPONSE_MESSAGES.INTERNAL_ERROR,
        httpStatus: HTTP_STATUS.SERVER_ERROR, // Internal Server Error
      };
    }
  }
}

export default UserService;
