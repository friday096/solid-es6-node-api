// controllers/UserController.js
import { HTTP_STATUS, RESPONSE_STATUS } from '../utils/constant.js';
import { RESPONSE_MESSAGES } from '../utils/response-message.js';

class UserController {
  constructor(userService) {
    this.userService = userService; 
  }

  // Create a new user
  async createUser(req, res, next) {
    try { 
      const userData = req.body;
      const result = await this.userService.createUser(userData);
      res.status(result.httpStatus).json({
        message: result.message || RESPONSE_MESSAGES.SUCCESS,
        status: result.status || RESPONSE_STATUS.SUCCESS,
        token: result.token || null, // Include token only if available
      });

    } catch (error) {
      console.error('Error creating user:', error);
      res.status(HTTP_STATUS.SERVER_ERROR).json({
        message: RESPONSE_MESSAGES.SERVER_ERROR,
        status: RESPONSE_STATUS.ERROR,
      });
      next(error);
    }
  }

  // Login user
  async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          message: RESPONSE_MESSAGES.EMAIL_PASSWORD_REQUIRED,
          status: RESPONSE_STATUS.ERROR,
        });
      }

      const result = await this.userService.loginUser(email, password);

      res.status(HTTP_STATUS.OK).json({
        message: RESPONSE_MESSAGES.LOGIN_SUCCESS || RESPONSE_MESSAGES.INVALID_CREDENTIALS,
          status: RESPONSE_STATUS.SUCCESS,
          token: result.token,
      });

    } catch (error) {
      console.error('Login error:', error);
      next(error);
    }
  }

  // Forget password
  async forgetPassword(req, res, next) {
    try {
      const { email } = req.body;

      const result = await this.userService.sendResetLink(email);

      res.status(result.httpStatus).json({
        message: result.message || RESPONSE_MESSAGES.RESET_LINK_SENT,
        status: result.status || RESPONSE_STATUS.SUCCESS,
        
      });

    } catch (error) {
      console.error('Error in forgetPassword:', error);
      next(error);
    }
  }

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
      const result = await this.userService.verifyTokenAndResetPassword(token, password);

        return res.status(HTTP_STATUS.OK).json({
          message: result.message || RESPONSE_MESSAGES.SUCCESS,
          status: RESPONSE_STATUS.SUCCESS,
          token: result.token || null,
        });
      // }

      // return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      //   message: result.message || RESPONSE_MESSAGES.ERROR,
      //   status: RESPONSE_STATUS.ERROR,
      // });
    } catch (error) {
      console.error('Error in resetPassword:', error);
      next(error);
    }
  }

  // Get token data
  async getTokenData(req, res, next) {
    try {
      if (req.user) {
        return res.status(HTTP_STATUS.OK).json({
          message: RESPONSE_MESSAGES.TOKEN_DATA_RETRIEVED,
          status: RESPONSE_STATUS.SUCCESS,
          data: req.user,
        });
      }

      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        message: RESPONSE_MESSAGES.INVALID_TOKEN,
        status: RESPONSE_STATUS.ERROR,
      });
    } catch (error) {
      console.error('Error in getTokenData:', error);
      next(error);
    }
  }

  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const result = await this.userService.getUserById(userId);

      if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          status: RESPONSE_STATUS.ERROR,
        });
      }
      res.status(result.httpStatus).json({
        status: result.status || RESPONSE_STATUS.SUCCESS,
        message: result.message || RESPONSE_MESSAGES.USER_FOUND,
        data:result.data || null
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const result = await this.userService.getAllUsers();
      res.status(result.httpStatus).json({
        status: result.status || RESPONSE_STATUS.SUCCESS,
        message: result.message || RESPONSE_MESSAGES.USER_FOUND,
        data:result.data || null
      });
    } catch (error) {
      console.error('Error fetching all users:', error);
      next(error);
    }
  }

  // Update user by ID
  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const result = await this.userService.updateUser(userId, updatedData);

      if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          message: RESPONSE_MESSAGES.USER_NOT_FOUND,
          status: RESPONSE_STATUS.ERROR,
        });
      }

      res.status(result.httpStatus).json({
        status: result.status || RESPONSE_STATUS.SUCCESS,
        message: result.message || RESPONSE_MESSAGES.USER_FOUND,
        data:result.data || null
      });
    } catch (error) {
      console.error('Error updating user:', error);
      next(error);
    }
  }

  // Delete user by ID
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      const result = await this.userService.deleteUser(userId);

      if (!result) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({ message });
      }

      res.status(result.httpStatus).json({
        status: result.status || RESPONSE_STATUS.SUCCESS,
        message: result.message || RESPONSE_MESSAGES.USER_FOUND,
        data:result.data || null
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      next(error);
    }
  }

  // Authenticate user (login)
  async authenticateUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.authenticateUser(email, password);

      if (!result) {
        return res.status(HTTP_STATUS.UNAUTHORIZED).json({
          message,
          status: RESPONSE_STATUS.ERROR,
        });
      }

      res.status(result.httpStatus).json({
        status: result.status || RESPONSE_STATUS.SUCCESS,
        message: result.message || RESPONSE_MESSAGES.USER_FOUND,
        data:result.data || null
      });
    } catch (error) {
      console.error('Error authenticating user:', error);
      next(error);
    }
  }
}

export default UserController;
