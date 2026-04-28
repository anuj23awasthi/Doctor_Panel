import validator from "validator"
import bycrpt from "bcrypt";
import {v2 as cloudinary} from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const addDoctor = async (req, res) => {

 try {

        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({message: "Please fill out the fields"})
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({message: "Please fill valid email"})
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Please enter at least 6 characters"})
        }

        const salt = await bycrpt.genSalt(10)
        const hashPassword = await bycrpt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: "image"})
        const imageUrl = imageUpload.secure_url


        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        res.json({success: true, message: "Doctor Added Successfully"})

    } catch (error) {

        console.log(error)
        res.status(400).json({message: error.message})

    }
}

const loginAdmin = async (req, res) => {
    try {

        const {email, password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.status(400).json({message: "Invalid Credentials"})
        }

    } catch (error) {

        console.log(error)
        res.status(400).json({message: error.message})

    }
}

const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select("-password");
        res.json({success: true, doctors})

    } catch (e) {

        console.log(e)
        res.status(400).json({message: e.message})

    }
}

const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({}).lean();

        const userIds = [...new Set(appointments.map((item) => item.userId).filter(Boolean))];
        const users = await userModel.find({_id: {$in: userIds}}).select('name image dob').lean();
        const usersById = new Map(users.map((user) => [String(user._id), user]));

        const normalizedAppointments = appointments.map((appointment) => {
            const currentUser = usersById.get(String(appointment.userId));
            if (!currentUser) return appointment;

            return {
                ...appointment,
                userData: {
                    ...appointment.userData,
                    name: currentUser.name ?? appointment.userData?.name,
                    image: currentUser.image ?? appointment.userData?.image,
                    dob: currentUser.dob ?? appointment.userData?.dob,
                },
            };
        });

        res.json({success: true, appointments: normalizedAppointments})

    }
    catch (e) {

        console.log(e)
        res.status(400).json({message: e.message})
    }
}

const appointmentCancel = async (req, res) => {

    try {
        
        const { appointmentId } = req.body;

        if ( !appointmentId) {
            return res.json({success: false, message: "Missing required appointment data."});
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({success: false, message: "Appointment not found."});
        }

    

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true});

        const {docId, slotDate, slotTime} = appointmentData;

        const doctorData = await doctorModel.findById(docId);

        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);

        await doctorModel.findByIdAndUpdate(docId, {slots_booked});

        res.json({success: true, message: "Appointment Cancelled"});
        
    }
    catch (err) {
        console.log(err);
        return res.json({success: false, message: err.message});
    }
}

const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});
        

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse().slice(0,5)
        }

        res.json({success: true, dashData});

    } catch (e) {       
        console.log(e); 
        return res.json({success: false, message: e.message});
    }
}

export {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard}