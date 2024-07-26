import express from 'express';
import tourControllers from '../controllers/tourControllers.js';
import authController from '../controllers/authController.js';
const router = express.Router();

// router.param('tourId', tourControllers.checkID);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTopTours, tourControllers.getAllTours);

router.route('/tourstats').get(tourControllers.getToursStats);
router.route('/monthlyplan/:year').get(tourControllers.getMonthlyPlan);

router
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);
router
  .route('/:tourId')
  .get(authController.protect, tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(tourControllers.deleteTour);

export default router;
