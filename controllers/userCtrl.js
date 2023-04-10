const userModel = require('../models/userModels')

const bcrypt = require('bcryptjs')

const jwt = require('jsonwebtoken')

const doctorModel = require('../models/doctorModel')
const appointmentModel = require('../models/appointmentModel')

const moment = require('moment')


const registerController = async (req, res) => {

    try {
        const existingUser = await userModel.findOne({ email: req.body.email })
        if (existingUser) {
            return res.status(200).send({ message: 'user Already Exist', success: false })
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new userModel(req.body);
        await newUser.save();
        res.status(201).send({ message: "Register successfully", success: true });

    }
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: `register Controller ${error.message}` })
    }
}

const loginController = async (req, res) => {

    try {

        const user = await userModel.findOne({ email: req.body.email })

        if (!user) {
            return res
                .status(200)
                .send({ message: 'user not found', success: false })
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password)
        if (!isMatch) {
            return res.status(200).send({ message: 'Invalid Email or Password', success: false })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).send({ message: 'Login success', success: true, token })

    } catch (error) {

        console.log(error);
        res.status(500).send({ message: `Error in Login ${error.message}` })

    }
}

const authController = async (req, res) => {

    try {

        const user = await userModel.findById({ _id: req.body.userId })

        user.password = undefined
        if (!user) {
            return res.status(200).send({
                message: 'User not found',
                success: false
            })

        }
        else {
            res.status(200).send({
                success: true,
                data: user
            });

        }

    } catch (error) {

        console.log(error);
        res.status(500).send({
            message: 'auth error',
            success: false,
            error
        })

    }


};



const getallnotificationController = async (req, res) => {

    try {

        const user = await userModel.findOne({ _id: req.body.userId })
        const seennotification = user.seennotification;
        const notification = user.notification;
        seennotification.push(...notification);
        user.notification = [];
        user.seennotification = notification;
        const updatedUser = await user.save()
        res.status(200).send({
            success: true,
            message: "all notification marked as read",
            data: updatedUser,

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Error in notification",
            success: false,
            error

        })

    }
}

const deleteallnotificationController = async (req, res) => {

    try {

        const user = await userModel.findOne({ _id: req.body.userId })
        user.notification = []
        user.seennotification = []
        const updatedUser = await user.save()
        updatedUser.password = undefined
        res.status(200).send({
            success: true,
            message: "Notification deleted successfully",
            data: updatedUser,

        })



    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Unable to delete notification",
            error


        })

    }
}

const getAllDoctorsController = async (req, res) => {

    try {

        const doctors = await doctorModel.find({ status: 'approved' })
        res.status(200).send({
            success: true,
            message: "Doctor data fetched successfully",
            data: doctors,

        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error while fetching  doctors",
            error


        })

    }
}

const bookAppointmentController = async (req, res) => {

    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        req.body.time = moment(req.body.time, 'HH:mm').toISOString()

        req.body.status = 'pending';
        const newAppointment = new appointmentModel(req.body)
        await newAppointment.save()
        const user = await userModel.findOne({ _Id: req.body.doctorInfo.userId })
        user.notification.push({
            type: "New-Appointment-request",
            message: `A new Appointment Request from ${req.body.userInfo.name}`,
            onClickPath: '/user/appointments'
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "Appointment book successfully",
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while booking apoointment",

        })

    }

}

const bookAvailabilityController = async (req, res) => {

    try {

        const date = moment(req.body.date, 'DD-MM-YYYY').toISOString()
        const fromTime = moment(req.body.time, 'HH:mm').subtract(1, 'hours').toISOString()
        const toTime = moment(req.body.time, 'HH:mm').add(1, 'hours').toISOString()
        const doctorId = req.body.doctorId
        
        console.log(`Booking request received for doctor ${doctorId} on ${date} between ${fromTime} and ${toTime}`);

        // Get the doctor's working hours for the given date
        const doctor = await doctorModel.findOne({ _id: doctorId })
        const workingHours = doctor && doctor.workingHours ? doctor.workingHours[date] : null

        console.log(`Doctor's working hours on ${date} are ${workingHours ? workingHours.startTime : 'N/A'} to ${workingHours ? workingHours.endTime : 'N/A'}`);

        // Check if the fromTime and toTime fall within the doctor's working hours
        if (workingHours && moment(fromTime).isBetween(workingHours.startTime, workingHours.endTime) &&
            moment(toTime).isBetween(workingHours.startTime, workingHours.endTime)) {

            console.log('Booking time falls within the doctor\'s working hours');

            // Check if any appointment exists for the doctor at the given time
            const appointments = await appointmentModel.find({
                doctorId,
                date,
                time: {
                    $gte: fromTime, $lte: toTime
                }
            })

            console.log(`Found ${appointments.length} appointments for the doctor`);

            if (appointments.length > 0) {
                return res.status(200).send({
                    message: 'Appointment not available at this time',
                    success: true
                })
            } else {
                return res.status(200).send({
                    success: true,
                    message: 'Appointment available',
                })
            }

        } else {
            console.log('Booking time falls outside the doctor\'s working hours');
            return res.status(200).send({
                message: 'Doctor is not available at this time',
                success: true
            })
        }

    } catch (error) {
        console.log(`Error in booking: ${error}`);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Booking",
        })
    }
}




const userAppointmentsController = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "User appointments list",
            data: appointments
        })

    } catch (error) {
        console.log(error);

        res.status(500).send({
            success: false,
            error,
            message: "Error in user appointments",

        })

    }
}





module.exports = { loginController, registerController, authController, getallnotificationController, deleteallnotificationController, getAllDoctorsController, bookAppointmentController, bookAvailabilityController, userAppointmentsController };