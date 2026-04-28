import React from 'react'
import {assets} from "../assets/assets.js";

const About = () => {
    return (
        <div>
            <div className="text-center text-2xl pt-10 text-gray-500">
                <p>ABOUT <span className="text-gray-700 font-medium">US</span></p>
            </div>
            <div className="my-10 flex flex-col md:flex-row gap-12">
                <img className="w-full md:max-w-[360px]" src={assets.about_image}/>
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600">
                    <p>
                        Apna Sehat is an AI-powered healthcare platform that simplifies patient–doctor interaction through digital automation. It enables appointment booking, symptom-based triage, secure medical records, and online consultations in one system, helping hospitals reduce waiting time while providing patients with faster, transparent, and more accessible healthcare services across urban and rural communities nationwide.
                    </p>
                    <p>
                        Our team developed Apna Sehat to address overcrowding, poor record management, and delayed emergency responses common in many healthcare centers. The system uses AI-based zone classification to prioritize patients, supports video consultations, digital prescriptions, and real-time doctor queues, and ensures efficient care delivery even in low-resource environments. By combining mobile technology, cloud services, and intelligent automation, the platform creates a scalable, reliable, and user-friendly healthcare ecosystem benefiting patients, doctors, and hospitals alike.
                    </p>
                    <b className=" text-gray-800 ">
                        Our Vision
                    </b>
                    <p>
                        Our vision is to build an accessible, AI-driven healthcare ecosystem that delivers timely, affordable, and quality medical assistance, reduces hospital overload, and connects patients and doctors through secure, intelligent, and scalable digital healthcare solutions worldwide.
                    </p>
                </div>
            </div>

            <div className="text-xl my-9">
                <p>WHY <span className="text-gray-700 font-semibold">CHOOSE US</span></p>
            </div>


                <div className="flex flex-col md:flex-row mb-20">
                    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"><b>Efficiency:</b><p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
                    </div>
                    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"><b>Convenience:</b><p>Access to a network of trusted healthcare professionals in your area.</p>
                    </div>
                    <div className="border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-blue-600 hover:text-white transition-all duration-300 text-gray-600 cursor-pointer"><b>Personalization:</b><p>Tailored recommendations and reminders to help you stay on top of
                        your health</p></div>
                </div>

        </div>
    )
}

export default About