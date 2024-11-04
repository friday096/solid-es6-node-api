import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import UserController from '../controllers/userController.js';
import UserService from '../services/userService.js';
import UserRepository from '../repositories/userRepository.js';

const router = express.Router();

// Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', (req, res, next) => {
  res.send({ status: 'API is working' });
});

router.get('/user', authMiddleware, (req, res, next) => userController.getAllUsers(req, res, next));

// router.post('/create', (req, res, next) => userController.createUser(req, res, next));



export default router;
