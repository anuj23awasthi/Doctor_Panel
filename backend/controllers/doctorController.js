import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";

const changeAvailability = async (req, res) => {

    try {
        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, {availability: !docData.availability})
        res.json({success: true, message: "Availability Changed"})

    } catch (err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }

}

const doctorList = async (req, res ) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({success: true, doctors})

    } catch (err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

const loginDoctor = async (req, res) => {
    try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})


        if (!doctor) {            
            return res.json({success: false, message: "Invalid Credentials"})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET)
            res.json({success: true,token})
        } else {
            res.json({success: false, message: "Invalid Credentials"})
        }


    }


    catch (err) {
        console.log(err)
        res.json({success: false, message: err.message})
    }
}



const appointmentsDoctor = async (req,res) => {
    try{
        const {docId} = req.body
        const appointments  = await appointmentModel.find({docId})

        res.json({success: true, appointments})


    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

const appointmentComplete = async (req,res) => {
    try{

        const {docId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})

            return res.json({success: true, message: "Appointment Completed"})
        }

        else{
            return res.json({success: false, message: "Mark Failed"})
        }
    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

const appointmentCancel = async (req,res) => {
    try{

        const {docId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){

            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})

            return res.json({success: true, message: "Appointment Cancelled"})
        }

        else{
            return res.json({success: false, message: "Cancellation Failed"})
        }
    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

const doctorDashboard = async (req,res) => {
    try{
        const {docId} = req.body
        const appointments  = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item) => {
            if(item.isCompleted || item.Payment){
                earnings += item.amount
            }
        })

       let patients = []

       appointments.map((item) => {
        if(!patients.includes(item.userId)){
            patients.push(item.userId)
        }
       })

       const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: appointments.reverse().slice(0,5)

       }

         res.json({success: true, dashData}) 

    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

const doctorProfile = async (req,res) => {
    try{
        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select(['-password'])

        res.json({success: true, profileData})
    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}


const updateDoctorProfile = async (req,res) => {

    try{
        const {docId, fees, address, availability} = req.body

        await doctorModel.findByIdAndUpdate(docId, {
            fees: Number(fees),
            address,
            availability
        })

        const profileData = await doctorModel.findById(docId).select(['-password'])

        res.json({success: true, message: "Profile Updated", profileData})

    }
    catch(err){
        console.log(err)
        res.json({success: false, message: err.message})
    }
}

export  { changeAvailability, 
          doctorList,
          loginDoctor, 
          appointmentsDoctor, 
          appointmentComplete, 
          appointmentCancel,
          doctorDashboard,
          doctorProfile, 
          updateDoctorProfile
        
        };