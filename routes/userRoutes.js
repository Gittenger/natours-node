const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

//INITIALIZE ROUTER
const router = express.Router();

//METHOD DEPENDENCIES
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = userController;

const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword
} = authController;

////
//ROUTE MIDDLEWARE
//
//AUTH
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);

//ME
router.patch('/updateMe', protect, updateMe);
router.patch('/deleteMe', protect, deleteMe);

//OTHER CRUD ROUTES
router.route('/').get(getAllUsers);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
