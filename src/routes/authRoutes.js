import express from 'express';
import {authMiddleware} from '../middlewares/authMiddleware.js'
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

router.post('/create', (req, res, next) => userController.createUser(req, res, next));
router.post('/login', (req, res, next) => userController.loginUser(req, res, next));
router.post('/forget', (req, res, next) => userController.forgetPassword(req, res, next));
router.post('/resetPassword', (req, res, next) => userController.resetPassword(req, res, next));
router.get('/getTokenData', authMiddleware, (req, res, next) => userController.getTokenData(req, res, next));
router.get('/user/:id', authMiddleware, (req, res, next) => userController.getUserById(req, res, next));

export default router;
