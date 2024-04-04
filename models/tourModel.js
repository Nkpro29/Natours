import mongoose from 'mongoose';
import slugify from 'slugify';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'name of the tour is required.'],
      // unique: true,
      trim: true,
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

tourSchema.post(/^find/, function(docs, next){
  console.log(`Query took ${Date.now() - this.start} ms.`);
  console.log(docs);
  next();
})

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
