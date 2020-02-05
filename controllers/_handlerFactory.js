const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    //for rest api, don't send anything back to client on delete, use 204 status code
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No tour found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  });
