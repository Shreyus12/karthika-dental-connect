const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({

    userid:
    {
        type: String,
    },
    firstName: 
    {
        type: String,
        required : [true, 'first name is required']

    },
    lastName:
    {
        type:String,
        required:[true,"Last name is required"]
    },
    phone:
    {
        type:String,
        required: [true, " Phone number is required"]
    },
    email:
    {
        type:String,
        required: [true, " Email is required"]
    },
    website:
    {
        type:String
    },
    address:
    {
        type:String,
        required:[true," Address is required"]
    },
    specialization:
    {
        type:String,
        required:[true," sepcialization is required"]

    },
    experience:
    {
        type:String,
        required:[true," experience is required"]

    },
    feesperconsultation:
    {
        type:Number,
        required:[true," fee is required"]

    },
    status:
    {
        type:String,
        default:'pending'


    },

    timings:
    {
        type:Object,
        required:[true," Work-time is required"]

    }




}, {timestamps:true})

const doctorModel = mongoose.model('doctors',doctorSchema)

module.exports = doctorModel