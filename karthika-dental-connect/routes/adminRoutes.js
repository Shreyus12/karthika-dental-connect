const express = require('express');

const { getAllUsersController, getAllDoctorsController, changeAccountStatusController, applyDoctorController } = require('../controllers/Adminctrl');

const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');


router.get('/getAllUsers',authMiddleware, getAllUsersController )


router.get('/getAllDoctors',authMiddleware, getAllDoctorsController )

router.post('/changeAccountStatus',authMiddleware, changeAccountStatusController )

router.post('/apply-doctor',authMiddleware, applyDoctorController)




module.exports = router;