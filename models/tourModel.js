import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of the tour is required.'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour can have maximum 40 characters'],
      minlength: [5, 'A tour can have maximum 5 characters'],
      // validate: [validator.isAlpha, 'a tour must contain only letters.'],
    },
    slug: String,
    secretTour: Boolean,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'difficulty is either: easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: 2,
      max: 5,
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
    priceDisCount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'discount price should be lesser than regular price.',
      },
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: {
      type: [Date],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// document middleware: 'save' and 'create' document
// tourSchema.pre('save', function (next) {
//   console.log(this);
//   this.slug = slugify(this.name);
//   next();
// });

// tourSchema.post('save', function(doc, next){
//   console.log(doc);
//   next();
// });

//query middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} ms.`);
  console.log(docs);
  next();
});

//aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log('pipeline method ==>', this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
