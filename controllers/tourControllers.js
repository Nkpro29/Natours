import Tour from '../models/tourModel.js';

const aliasTopTours = (req, res, next) => {
  console.log('inside aliasTopTours');
  (req.query.limit = '5'),
    console.log('limit inside aliasTopTours==>', req.query.limit);
  (req.query.fields = 'name, price, -ratingsAverage, summary, difficulty'),
    (req.query.sort = '-ratingsAverage, price');
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    const queryStr = JSON.stringify(queryObj);
    let outputStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log("outputStr ==>",JSON.parse(outputStr));
    this.query = Tour.find(JSON.parse(outputStr));

    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
      console.log('sortBy ==>', sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skipValue = (page - 1) * limit;

    this.query = this.query.skip(skipValue).limit(limit);

    return this;
  }
}

const getAllTours = async (req, res) => {
  console.log('Get Tour hit==>');
  try {
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
  } catch (error) {
    console.log('Error==>', error);
    res.status(404).json({
      status: 'failure',
      error: error.message,
    });
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.tourId);
    //Tour.findOne({_id: req.params.tourId})
    res.status(200).json({
      status: 'success',
      data: {
        tours: tour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      error: error,
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(200).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'failure',
      error: error,
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      req.params.tourId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        updatedTour: updatedTour,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      error: error,
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.tourId);
    res.status(200).json({
      status: 'success',
      deletedTour: deletedTour,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      error: error,
    });
  }
};

const getToursStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      message: error.message,
    });
  }
};

const getMonthlyPlan = async (req, res) => {
  try {
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
      monthlyPlan: monthlyPlan,
    });
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      message: error.message,
    });
  }
};

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
