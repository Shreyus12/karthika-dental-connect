

const appointmentModel = require('../models/appointmentModel')
const doctorModel = require('../models/doctorModel')
const userModel = require('../models/userModels')


const getDoctorInfoController = async (req, res) => {

    try {
        const doctor = await doctorModel.findOne({ userId: req.body.userId })
        res.status(200).send({
            success: true,
            message: "doctor data detch success",
            data: doctor,

        })



    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in fetching doctor details",
            error


        })

    }
}

const updateProfileController = async (req, res) => {

    try {

        const doctor = await doctorModel.findOneAndUpdate({ userId: req.body.userId }, req.body)
        res.status(200).send({
            success: true,
            message: "Updated doctor profile",
            data: doctor,

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Doctor profile update issue",
            error


        })

    }
}

const getDoctorByIdController = async (req, res) => {
    try {

        const doctor = await doctorModel.findOne({ _id: req.body.doctorId })
        res.status(200).send({
            success: true,
            message: "Doctor info fetched",
            data: doctor,

        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in single doctor info"


        })

    }
}

const doctorAppointmentsController = async (req, res) => {
    try {
      const doctor = await doctorModel.findOne({ userId: req.body.userId });
      const appointments = await appointmentModel.find({
        doctorId: doctor._id,
      });
      res.status(200).send({
        success: true,
        message: "Doctor Appointments fetch Successfully",
        data: appointments,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        error,
        message: "Error in Doc Appointments",
      });
    }
  };


const updateStatusController = async (req,res) => {

    try {

        const { appointmentsId , status } = req.body
        const appointments = await appointmentModel.findByIdAndUpdate( appointmentsId, {status} )
        const user = await userModel.findOne({ _id: appointments.userId })
        const notification = user.notification;
        notification.push({
            type: "Status - updated",
            message: `Your Appointment has been ${status}`,
            onClickPath: '/doctor-appointments'
        })
        await user.save()
        res.status(200).send({
            success: true,
            message: "Appointment status updated",

        })


        
    } catch (error) {
        
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in updating status"

        })
    }
}

module.exports = { getDoctorInfoController, updateProfileController, getDoctorByIdController, doctorAppointmentsController, updateStatusController } 