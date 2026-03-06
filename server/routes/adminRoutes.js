const express = require('express');
const router = express.Router();
const { approveRestaurant, getStats, getPendingRestaurants } = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

router.put('/restaurants/:id/approve', approveRestaurant);
router.get('/stats', getStats);
router.get('/restaurants/pending', getPendingRestaurants);

module.exports = router;
