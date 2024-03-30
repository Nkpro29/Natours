import Tour from '../models/tourModel.js';

const getAllTours = async (req, res) => {
  try {
    //filtering , sorting , limiting, pagination, aliasing

    //Build Query
    // 1A) simple filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // 1B) advanced filtering
    const queryStr = JSON.stringify(queryObj);
    let outputStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    // console.log("outputStr ==>",JSON.parse(outputStr));
    let query = Tour.find(JSON.parse(outputStr));

    // 2)sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      console.log('sortBy ==>', sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 3)fields limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    }else{
      query = query.select('-__v')
    }

    // 4) pagination
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 10;
    const skipValue = (page - 1) * limit;

    query = query.skip(skipValue).limit(limit);

    if(req.query.page){
      const newTours = await Tour.countDocuments();
      if(skipValue >= newTours){
        throw new Error('this page does not exist');
      }
    }

    //Execute query
    const tours = await query;

    res.status(200).json({
      status: 'success',
      resultLength: tours.length,
      data: {
        tours: tours,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: 'failure',
      error: error,
    });
  }
};

const getTour = async (req, res) => {
  try {
    console.log('req.params ==>', req.params.tourId);
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

export default {
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
