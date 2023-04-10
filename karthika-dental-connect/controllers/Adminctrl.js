
const doctorModel = require('../models/doctorModel')

const userModel = require('../models/userModels')

const getAllUsersController = async (req, res) => {

    try {

        const users = await userModel.find({})
        res.status(200).send({
            success: true,
            message: 'user data',
            data: users
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while fetching users',
            error
        })

    }

}

const getAllDoctorsController = async (req, res) => {


    try {

        const doctors = await doctorModel.find({})
        res.status(200).send({
            success: true,
            message: 'doctors data',
            data: doctors
        })

    } catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error while fetching doctors data',
            error
        })

    }
}


const changeAccountStatusController = async (req, res) => {
    try {
      const { doctorId, status } = req.body;
      const doctor = await doctorModel.findByIdAndUpdate(doctorId, { status });
      const user = await userModel.findOne({ _Id: doctor.userid });
      
      const notification = user.notification;
      notification.push({
        type: "doctor-account-request-updated",
        message: `Your Doctor Account Request Has ${status} `,
        onClickPath: "/notification",
      });
      user.isDoctor = status === "approved" ? true : false;
      await user.save();
      res.status(201).send({
        success: true,
        message: "Account Status Updated",
        data: doctor,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Eror in Account Status",
        error,
      });
    }
  };

const applyDoctorController = async (req, res) => {

    try {

        const newDoctor = await doctorModel({ ...req.body, status: 'pending' })
        await newDoctor.save()
        const adminUser = await userModel.findOne({ isAdmin: true })
        const notification = adminUser.notification
        notification.push({
            type: 'apply-doctor-request',
            message: `${newDoctor.firstName} ${newDoctor.lastName} Has Applied for a Doctor Account`,
            data: {
                doctorId: newDoctor._id,
                name: newDoctor.firstName + " " + newDoctor.lastName,
                onClickPath: '/admin/doctors'
            }
        })

        await userModel.findByIdAndUpdate(adminUser._id, { notification })
        res.status(201).send({
            success: true,
            message: 'Doctor account applied successfully'
        })

    }
    catch (error) {

        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Error while appyling for Doctor"

        })

    }

}



module.exports = { getAllUsersController, getAllDoctorsController, changeAccountStatusController, applyDoctorController }