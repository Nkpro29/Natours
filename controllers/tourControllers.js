import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

const aliasTopTours = (req, res, next) => {
  console.log('inside aliasTopTours');
  (req.query.limit = '5'),
    console.log('limit inside aliasTopTours==>', req.query.limit);
  (req.query.fields = 'name, price, -ratingsAverage, summary, difficulty'),
    (req.query.sort = '-ratingsAverage, price');
  next();
};


const getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagination();
  const tours = await features.query;

  res.status(200).json({
    status: 'success',
    resultLength: tours.length,
    data: {
      tours: tours,
    },
  });
});

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  if (!tour) {
    return next(new AppError(`No tour found with the ID`, 404));
  }
  //Tour.findOne({_id: req.params.tourId})
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
});

const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);
  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

const updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(
    req.params.tourId,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedTour) {
    return next(new AppError(`No tour found with the ID`, 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      updatedTour: updatedTour,
    },
  });
});

const deleteTour = catchAsync(async (req, res, next) => {
  const deletedTour = await Tour.findByIdAndDelete(req.params.tourId);
  if (!deletedTour) {
    return next(new AppError(`No tour found with the ID`, 404));
  }
  res.status(200).json({
    status: 'success',
    deletedTour: deletedTour,
  });
});

const getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.0 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    stats: stats,
  });
});

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const monthlyPlan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tour: { $push: '$name' },
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $addFields: { month: '$_id' },
    },
  ]);
  res.status(200).json({
    status: 'success',
    responseLength: monthlyPlan.length,
    monthlyPlan: monthlyPlan,
  });
});

export default {
  getToursStats,
  getMonthlyPlan,
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
