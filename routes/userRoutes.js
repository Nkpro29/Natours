import express from 'express';
const router = express.Router();
import userController from '../controllers/userControllers.js';
import authController from '../controllers/authController.js';

router.route('/signup').post(authController.signup);
router.route('/login').get(authController.login);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:userId')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
