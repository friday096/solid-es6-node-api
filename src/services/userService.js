// services/UserService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import TokenGenerator from '../utils/TokenGenerator.js';
import EmailService from '../utils/EmailService.js';

class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.tokenGenerator = new TokenGenerator()
    this.emailService = new EmailService();
  }

  async createUser(userData) {
    try {
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        return { status: 'error', message: 'Email already in use' };
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword,
        status: userData.status || 1,
      });

      const token = this.tokenGenerator.generateToken({
        id: newUser._id,
        email: newUser.email,
        fname: newUser.fname,
        lname: newUser.lname,
      });

      await this.userRepository.update(newUser._id, { token });
      return { status: 'success', token, message: 'User created successfully' };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }

  async loginUser(email, password) {
    const user = await this.userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return { success: false, message: 'Invalid credentials' };
    }

    const token = this.tokenGenerator.generateToken(user);
    return { success: true, token, message: 'Successfully logged in' };
  }

  async sendResetLink(email) {
    try {
      const user = await this.userRepository.findByEmail(email);
      if (!user) return { success: false, message: 'User not found' };

      // const resetToken = TokenGenerator.generateResetToken(user._id);
      const resetToken = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
      const resetUrl = `http://yourdomain.com/reset-password/${resetToken}`;

      await this.emailService.send(user.email, 'Password Reset', `<p>Click <a href="${resetUrl}">here</a> to reset your password</p>`);
      return { success: true };
    } catch (error) {
      return { success: false, message: `Failed to send reset link: ${error.message}` };
    }
  }

  async verifyTokenAndResetPassword(token, password) {
    try {
        // Verify the token to extract the user ID
        const decoded = this.tokenGenerator.verifyToken(token); // Verify the token first
        const userId = decoded.user_id; // Extract the user ID from the token
        const user = await this.userRepository.findById(userId); // Retrieve the user by ID

        if (!user) {
            return { success: false, message: 'User not found' }; // Handle user not found case
        }

        const saltRounds = 10; // Define salt rounds for password hashing
        const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash the new password

        // Use the update method from userRepository instead of findByIdAndUpdate
        const updatedUser = await this.userRepository.update(
            userId, // Find the user by ID
            { password: hashedPassword } // Update the password field
        );

        if (!updatedUser) {
            return { success: false, message: 'Failed to update password' }; // Handle update failure
        }

        // Return success message
        return { success: true, message: 'Password reset successfully' };
    } catch (error) {
        // Handle errors such as token verification failure or other errors
        return { success: false, message: `Failed to verify token: ${error.message}` };
    }
}


  async getUserById(id) {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) return { success: false, message: 'User not found' };
      return { success: true, data: user, message: 'User data retrieved successfully' };
    } catch (error) {
      return { success: false, message: `Error retrieving user: ${error.message}` };
    }
  }

  async getAllUsers() {
    try {
      return await this.userRepository.getAll(); // Call the repository method to fetch all users
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`); // Handle errors appropriately
    }
  }
}

export default UserService;
