const express = require('express')
const { loginController, registerController, authController,getallnotificationController, deleteallnotificationController, getAllDoctorsController, bookAppointmentController, bookAvailabilityController, userAppointmentsController } = require('../controllers/userCtrl');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();


router.post('/login',loginController);

router.post('/register',registerController);

router.post('/getUserData',authMiddleware, authController)



router.post('/get-all-notification',authMiddleware, getallnotificationController)


router.post('/delete-all-notification',authMiddleware, deleteallnotificationController)

router.get('/getAllDoctors',authMiddleware, getAllDoctorsController)


router.post('/book-appointment' ,authMiddleware, bookAppointmentController )


router.post('/booking-availability' ,authMiddleware, bookAvailabilityController )

router.get('/user-appointments',authMiddleware, userAppointmentsController)



module.exports = router;

