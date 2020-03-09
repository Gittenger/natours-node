const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty']
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must be associated with a user']
    },
    tour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

//every combination of tour/user will be unique, to prevent duplicate reviews
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

//populate ref fields
reviewSchema.pre(/^find/, function(next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name'
  // }).populate({
  //   path: 'tour',
  //   select: 'name photo'
  // });
  //
  //turned off tour populate in reviews to prevent populate chaining
  this.populate({
    path: 'user',
    select: 'name photo'
  });

  next();
});

//STATIC METHODS
reviewSchema.statics.calcAverageRatings = async function(tourId) {
  //"this" points to the model directly since static method
  //match all docs "tour" field (which is a tour Id), passed in via "this.tour"
  //group by tour, calc stats
  const stats = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    //assign calc'd stats to matching Tour doc
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating
    });
  } else {
    //assign calc'd stats to matching Tour doc
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5
    });
  }
};

//POST-SAVE MIDDLEWARE (NO ACCESS TO NEXT)
//middleware for avg ratings calc every time (after) a new review is saved
reviewSchema.post('save', function() {
  //using this.constructor to access static method
  this.constructor.calcAverageRatings(this.tour);
});

//middleware for saving currently queried doc
reviewSchema.pre(/^findOneAnd/, async function(next) {
  //find current doc, save it as a virtual field
  this.virtualReview = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function(next) {
  await this.virtualReview.constructor.calcAverageRatings(
    this.virtualReview.tour
  );
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
