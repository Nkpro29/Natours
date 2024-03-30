import express from 'express';
import tourControllers from '../controllers/tourControllers.js';
const router = express.Router();

// router.param('tourId', tourControllers.checkID);

router
  .route('/')
  .get(tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:tourId')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

export default router;
