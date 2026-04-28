import React, {useContext, useEffect, useState} from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {AppContext} from "../context/AppContext.jsx";
import {assets} from "../assets/assets.js";
import {toast} from "react-toastify";
import RelatedDoctors from "../components/RelatedDoctors.jsx";
import axios from 'axios';

const Appointment = () => {

    const {docId} = useParams()
    const {doctors, currencySymbol, token, backendUrl, getDoctorsData} = useContext(AppContext);
    const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

    const navigate = useNavigate();

    const [docInfo, setDocInfo] = useState(null);
    const [docSlots, setDocSlots] = useState([]);
    const [slotIndex, setSlotIndex] = useState(0);
    const [slotTime, setSlotTime] = useState('');

    const handleSlotDateClick = (index) => {
        setSlotIndex(index);
        setSlotTime('');
    }

    const fetchDocInfo = async () => {
        const docInfo = doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
    }

    const getAvailableSlots = async () => {
        const allSlots = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(today);
            dayDate.setDate(today.getDate() + i);

            const startTime = new Date(dayDate);
            const endTime = new Date(dayDate);
            endTime.setHours(21, 0, 0, 0);

            startTime.setHours(10, 0, 0, 0);

            const timeSlots = [];

            while (startTime < endTime) {
                const formattedTime = startTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});

              let day = startTime.getDate();
                let month = startTime.getMonth() + 1;
                let year = startTime.getFullYear(); 

                 const slotDate = day + "_" + month + "_" + year
                 const slotTime = formattedTime

                 const isSlotAvailable = docInfo.slots_booked[slotDate] && docInfo.slots_booked[slotDate].includes(slotTime) ? false : true


                  if(isSlotAvailable){
                    timeSlots.push({
                    datetime: new Date(startTime),
                    time: formattedTime
                    });
                  }


                startTime.setMinutes(startTime.getMinutes() + 30);
            }

            allSlots.push({
                date: new Date(dayDate),
                timeSlots
            });
        }

        setDocSlots(allSlots);
        setSlotIndex(0);
        setSlotTime('');
    }

     const bookAppointment = async () => {
     
        if(!token){
            toast.warn('Login to book an appointment')
            return navigate('/login')
        }

        try{
           
            const date = docSlots[slotIndex].date

            let day = date.getDate();
            let month = date.getMonth() + 1;
            let year = date.getFullYear();

            const slotDate = day + "_" + month + "_" + year

            const {data} = await axios.post(backendUrl + '/api/user/book-appointment', {docId, slotDate, slotTime}, {headers: {token}})

            if(data.success){
                toast.success(data.message)
                getDoctorsData()
                navigate('/my-appointments')
            }
            else{
                toast.error(data.message)
            }

        }
        catch (error){
            console.log(error)
            toast.error(error.message);

        }
    
    
    }








    useEffect(() => {
        fetchDocInfo()
    }, [doctors, docId])

    useEffect(() => {
        if (docInfo) {
            getAvailableSlots()
        }
    }, [docInfo])

    return docInfo && (

        <div>
            {/*Doctor details*/}
            <div className="flex flex-col sm:flex-row gap-4">

                <div>
                    <img className="bg-blue-600 w-full sm:max-w-72 rounded-lg" src={docInfo.image}/>
                </div>

                <div
                    className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">

                    {/*Doc info*/}
                    <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">{docInfo.name}
                        <img className="w-5" src={assets.verified_icon}/></p>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <p>{docInfo.degree} - {docInfo.speciality}</p>
                        <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
                    </div>

                    {/*Doctor's About*/}
                    <div>
                        <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">About <img
                            src={assets.info_icon}/></p>
                        <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
                    </div>
                    <p className="text-gray-600 font-medium mt-5">
                        Appointment fee:<span className="text-gray-700">{currencySymbol}{docInfo.fees}</span>
                    </p>

                </div>

            </div>
            {/*BOOKING SLOT*/}

            <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
                <p>Booking Slot</p>
                <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
                    {
                        docSlots.length && docSlots.map((item, index) => (
                            <div onClick={() => handleSlotDateClick(index)}
                                 className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-blue-600 text-white' : 'border border-gray-200'}`}
                                 key={index}>
                                <p>{daysOfWeek[item.date.getDay()]}</p>
                                <p>{item.date.getDate()}</p>
                            </div>

                        ))
                    }
                </div>

                <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
                    {
                        docSlots[slotIndex]?.timeSlots?.length ? docSlots[slotIndex].timeSlots.map((item, index) => (
                            <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-blue-600 text-white' : 'text-gray-400 border border-gray-300'}`}
                               key={index}>
                                {item.time.toLowerCase()}
                            </p>

                        )) : <p className="text-sm text-gray-500">No slots left for this day. Please choose another day.</p>
                    }
                </div>

                <button onClick={bookAppointment} className="bg-blue-600 text-white text-sm font-light px-14 py-3 rounded-full my-6 cursor-pointer">Book an appointment</button>

            </div>

            <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>

        </div>
    )
}

export default Appointment