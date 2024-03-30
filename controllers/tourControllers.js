import Tour from '../models/tourModel.js';

const getAllTours = async (req, res) => {
  try {
    //filtering , sorting , limiting, pagination, aliasing

    // 1) simple filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach((el) => {
      delete queryObj[el];
    });

    // 2) advanced filtering
    const queryStr = JSON.stringify(queryObj);
    const outputStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );
    console.log(JSON.parse(outputStr));

    const tours = await Tour.find(JSON.parse(outputStr));

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
