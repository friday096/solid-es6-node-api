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

/**
 * @api {post} /create Create a new user
 * @apiName CreateUser
 * @apiGroup User
 * 
 * @apiParam {String} email User's email.
 * @apiParam {String} password User's password.
 * @apiParam {String} fname User's first name.
 * @apiParam {String} lname User's last name.
 * @apiParam {String} [status=1] User's status (optional, defaults to 1).
 * 
 * @apiSuccess {String} status Status of the request (e.g., success).
 * @apiSuccess {String} message Success message.
 * @apiSuccess {String} token The authentication token for the newly created user.
 * @apiSuccess {Number} httpStatus The HTTP status code (e.g., 201).
 * 
 * @apiError (Error 400) BadRequest The request data is invalid or incomplete.
 * @apiError (Error 500) InternalServerError Internal server error occurred.
 * @apiError (Error 409) Conflict Email already in use.
 * 
 * @apiExample {js} Example usage:
 * const data = {
 *   email: 'test@example.com',
 *   password: 'password123',
 *   fname: 'John',
 *   lname: 'Doe',
 *   status: 1
 * };
 * fetch('/create', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify(data)
 * }).then(response => response.json()).then(data => console.log(data));
 * 
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 Created
 *  {
 *    "status": "success",
 *    "message": "User created successfully",
 *    "token": "your-jwt-token",
 *    "httpStatus": 201
 *  }
 * 
 * @apiErrorExample Error-Response:
 *  HTTP/1.1 400 Bad Request
 *  {
 *    "status": "error",
 *    "message": "Invalid input",
 *    "httpStatus": 400
 *  }
 */
router.post('/create', (req, res, next) => userController.createUser(req, res, next));
router.post('/login', (req, res, next) => userController.loginUser(req, res, next));
router.post('/forget', (req, res, next) => userController.forgetPassword(req, res, next));
router.post('/resetPassword', (req, res, next) => userController.resetPassword(req, res, next));
router.get('/getTokenData', authMiddleware, (req, res, next) => userController.getTokenData(req, res, next));
router.get('/user/:id', authMiddleware, (req, res, next) => userController.getUserById(req, res, next));

export default router;
