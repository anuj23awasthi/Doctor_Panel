import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";

const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        if (!name || !password || !email) {
            return res.json({success: false, message: "Please enter valid credentials."});
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message: "Please enter valid email."});
        }

        if (password.length < 5) {
            return res.json({success: false, message: "Password must be at least 5 characters."});
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password : hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token})

    } catch (err) {
        console.log(err);
        return res.json({success: false, message: err.message});
    }

}

const loginUser = async (req, res) => {

    try {

        const {email, password} = req.body;
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success: false, message: "Invalid Credentials."});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            return res.json({success: false, message: "Invalid Credentials."});
        }

    } catch (err) {
        console.log(err);
        return res.json({success: false, message: "Something went wrong."});
    }

}

const getProfile = async (req, res) => {

    try {

        const userId = req.userId;

        if (!userId) {
            return res.json({success: false, message: "User not authenticated."});
        }

        const userData = await userModel.findById(userId).select('-password');

        res.json({success: true, userData})

    } catch (err) {

        console.log(err);
        return res.json({success: false, message: "Something went wrong."});

    }

}


const updateProfile = async (req, res) => {

    try {

        const {name, phone, address, dob, gender} = req.body;
        const userId = req.userId;
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({success: false, message: "Data Missing"});
        }

        await userModel.findByIdAndUpdate(userId, {
            name,
            phone,
            address: JSON.parse(address),
            dob,
            gender,
        });

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
                resource_type: "image",
            });
            const imageURL = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {image: imageURL});
        }

        res.json({success: true, message: "Profile Updated"});


    } catch (err) {
        console.log(err);
        return res.json({success: false, message: "Something went wrong."});
    }

}

const bookAppointment = async (req, res) => {

    try {

        const userId = req.userId;
        const {docId, slotDate, slotTime} = req.body;

        if (!userId || !docId || !slotDate || !slotTime) {
            return res.json({success: false, message: "Missing required appointment data."});
        }

        const docData = await doctorModel.findById(docId).select('-password').lean();

        if (!docData) {
            return res.json({success: false, message: "Doctor not found."});
        }

        if(!docData.availability){
            return res.json({success: false, message: "Doctor is not available."});
        }

        let slots_booked = docData.slots_booked;

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success: false, message: "Slot already booked."});
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        }   

        const userData = await userModel.findById(userId).select('-password').lean();

        if (!userData) {
            return res.json({success: false, message: "User not found."});
        }

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,      
            userData,  
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
        }

         const newAppointment = new appointmentModel(appointmentData);
         await newAppointment.save();

         await doctorModel.findByIdAndUpdate(docId, {slots_booked});

         res.json({success: true, message: "Appointment Booked"});

    }
    catch (err) {
        console.log(err);
        return res.json({success: false, message: err.message});
    }
}

const listAppointment = async (req, res) => {

    try {

        const userId = req.userId;
        const appointments = await appointmentModel.find({userId})
        res.json({success: true, appointments})

    }
    catch (err) {
        console.log(err);
        return res.json({success: false, message: err.message});
    }
}

const cancelAppointment = async (req, res) => {

    try {
        const userId = req.userId;
        const { appointmentId } = req.body;

        if (!userId || !appointmentId) {
            return res.json({success: false, message: "Missing required appointment data."});
        }

        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({success: false, message: "Appointment not found."});
        }

        if (String(appointmentData.userId) !== String(userId)) {
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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async(req, res) => {

    try{

         const {appointmentId} = req.body
         const appointmentData = await appointmentModel.findById(appointmentId)

    if(!appointmentData || appointmentData.cancelled){
        return res.json({success: false, message: "Appointment Cancelled OR Not Found"});
    }

    const options = {

        amount: appointmentData.amount * 100,
        currency: process.env.CURRENCY,
        receipt: appointmentId,
    }

    const order = await razorpayInstance.orders.create(options);

    res.json({success: true, order})

    }
    catch(err){
        console.log(err);
        return res.json({success: false, message: err.message});
    }



}

const verifyRazorPay = async (req, res) => {
    try{
        const {razorpay_order_id, razorpay_payment_id} = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.json({success: false, message: "Missing payment details."});
        }

        const paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id);

        if (paymentInfo.status !== 'captured' || paymentInfo.order_id !== razorpay_order_id) {
            return res.json({success: false, message: "Payment verification failed."});
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {Payment: true});
        res.json({success: true, message: "Payment Successful"})
       


    }
    catch(error){
        console.log(error);
        return res.json({success: false, message: error.message});
    }
}


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay, verifyRazorPay};