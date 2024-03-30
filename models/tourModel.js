import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name of the tour is required.'],
    // unique: true,
    trim: true,
  },
  duration: {
    type: Number,
    required: [true, 'duration is required for a tour.'],
  },
  price: {
    type: Number,
    required: [true, 'price should be given with every tour.'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'maximum group size must be given.'],
  },
  difficulty: {
    type: String,
    required: [true, 'difficulty must be known.'],
  },
  ratingsAverage: {
    type: Number,
  },
  ratingsQuantity: {
    type: Number,
    required: [true, 'ratingQuantity must be known.'],
  },
  summary: {
    type: String,
    required: true,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have an image cover.'],
  },
  priceDisCount: Number,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: {
    type: [Date],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
