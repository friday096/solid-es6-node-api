// controllers/UserController.js
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  // Create a new user
  async createUser(req, res, next) {
    try {
      const userData = req.body;
      const { token, message, status } = await this.userService.createUser(userData);
      res.status(201).json({ message, status, token });
    } catch (error) {
      next(error);
    }
  }

//login user
  async loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Ensure both email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
        status: 'error'
      });
    }

    // Call the login service and capture the result
    const result = await this.userService.loginUser(email, password);

    // Check the result for a successful login
    if (result.success) {
      return res.status(200).json({
        message: 'Login successful.',
        status: 'success',
        token: result.token
      });
    } 

    // If login fails (e.g., invalid credentials)
    res.status(401).json({
      message: result.message || 'Invalid credentials.',
      status: 'error'
    });
    
  } catch (error) {
    // Log the error (optional)
    console.error('Login error:', error);
    // Pass any unexpected errors to the error handling middleware
    next(error);
  }
}

//forget password
async forgetPassword(req, res, next) {
  try {
    const { email } = req.body; // Extract email from request body

    // Call the userService to send reset link to the user's email
    const result = await this.userService.sendResetLink(email);

    // Check if sending the reset link was successful
    if (result.success) {
      res.status(200).json({
        message: 'A password reset link has been sent to your email.',
        status: 'success',
        token: result.token // This could be used for tracking purposes if needed
      });
    } else {
      // Handle case where the reset link could not be sent (e.g., user not found)
      res.status(404).json({
        message: result.message || 'Email not found. Please try again.',
        status: 'error'
      });
    }
  } catch (error) {
    // Pass any error to the error-handling middleware
    next(error);
  }
}

// Reset Password Method
async resetPassword(req, res, next) {
  try {
    const { token, password } = req.body; // Extract token and new password from the request body
    const result = await this.userService.verifyTokenAndResetPassword(token, password); // Call service to verify token and reset password

    if (result.success) {
      res.status(200).json({
        message: result.message,
        status: 'success',
        token: result.token // Include token if needed (e.g., for login purposes)
      });
    } else {
      res.status(401).json({
        message: result.message,
        status: 'error'
      });
    }
  } catch (error) {
    next(error); // Forward error to middleware
  }
}

// Get Token Data Method
async getTokenData(req, res, next) {
  try {
    // req.user should contain decoded user data, possibly set by a middleware after token verification
    if (req.user) {
      res.status(200).json({
        message: 'Token data retrieved successfully',
        status: 'success',
        data: req.user // Return user data associated with the token
      });
    } else {
      res.status(401).json({
        message: 'Invalid token data',
        status: 'error'
      });
    }
  } catch (error) {
    next(error); // Forward error to middleware
  }
}


  // Get user by ID
  async getUserById(req, res, next) {
    try {
      const userId = req.params.id;
      const user = await this.userService.getUserById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found', status: 'error' });
      }

      res.status(200).json({ status: 'success', user });
    } catch (error) {
      next(error);
    }
  }

  // Get all users
  async getAllUsers(req, res, next) {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({ status: 'success', users });
    } catch (error) {
      next(error);
    }
  }

  // Update user by ID
  async updateUser(req, res, next) {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const { message, status, user } = await this.userService.updateUser(userId, updatedData);

      if (!user) {
        return res.status(404).json({ message: 'User not found', status: 'error' });
      }

      res.status(200).json({ message, status, user });
    } catch (error) {
      next(error);
    }
  }

  // Delete user by ID
  async deleteUser(req, res, next) {
    try {
      const userId = req.params.id;
      const { message, status } = await this.userService.deleteUser(userId);

      if (status === 'error') {
        return res.status(404).json({ message });
      }

      res.status(200).json({ message, status });
    } catch (error) {
      next(error);
    }
  }

  // Authenticate user (login)
  async authenticateUser(req, res, next) {
    try {
      const { email, password } = req.body;
      const { token, message, status } = await this.userService.authenticateUser(email, password);

      if (status === 'error') {
        return res.status(401).json({ message });
      }

      res.status(200).json({ message, status, token });
    } catch (error) {
      next(error);
    }
  }

  // Other custom user-related methods can follow the same pattern
}

export default UserController;
