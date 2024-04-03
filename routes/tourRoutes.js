import express, { Router } from 'express';
import tourControllers from '../controllers/tourControllers.js';
const router = express.Router();

// router.param('tourId', tourControllers.checkID);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tourstats').get(tourControllers.getToursStats);
router.route('/monthlyplan/:year').get(tourControllers.getMonthlyPlan);

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
