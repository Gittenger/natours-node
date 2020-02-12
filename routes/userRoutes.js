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
  getMe,
  updateMe,
  deleteMe,
  uploadUserPhoto,
  resizeUserPhoto
} = userController;

const {
  signup,
  login,
  logout,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo
} = authController;

////
//ROUTE MIDDLEWARE
//
//AUTH, UNPROTECTED ROUTES
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

//PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(protect);

//ME
router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', uploadUserPhoto, resizeUserPhoto, updateMe);
router.patch('/deleteMe', deleteMe);

//RESTRICT FOLLOWING ROUTES TO ADMINS ONLY
router.use(restrictTo('admin'));

//OTHER CRUD ROUTES
router.route('/').get(getAllUsers);
router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
