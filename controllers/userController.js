const multer = require('multer');
const sharp = require('sharp');
const User = require('./../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./_handlerFactory');

//create filtered object to filter thru select fields. for filtering allowed updates
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(field => {
    if (allowedFields.includes(field)) newObj[field] = obj[field];
  });
  return newObj;
};

//NOT DEFINED
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined. Please use /signup'
  });
};

//CRUD
exports.getAllUsers = factory.getAll(User);
//
//do NOT update passwords with this one
exports.updateUser = factory.updateOne(User);
exports.getUser = factory.getOne(User);
exports.deleteUser = factory.deleteOne(User);

//SPECIAL
//
//middleware to pass currently logged in user ID to getOne
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //create error if user POSTS password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  //update user document
  //only allow select properties to be changed, filter unwanted object fields
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  //new option will return the new, updated object
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});

//MULTER FOR IMAGE UPLOADS
//config multer storage
//longhand config for save to disk
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     //create unique filename  user-userid-timestamp
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
//config for save to buffer
const multerStorage = multer.memoryStorage();
//config multer filter (only upload imgs)
const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};
//multer with config options
const upload = multer({
  storage: multerStorage,
  filter: multerfilter
});

exports.uploadUserPhoto = upload.single('photo');
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  //resize to 500x500 jpeg 90% quality
  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    //write to file on disk
    .toFile(`public/img/users/${req.file.filename}`);

  next();
};
