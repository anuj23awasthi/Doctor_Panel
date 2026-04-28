import React from "react";
import {assets} from "../assets/assets.js";

const Footer = () => {
    return (
        <div className="md:mx-10">
            <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">

                {/*LEFT SECTION*/}
                <div>
                    <img className="mb-5 w-30" src={assets.logo}/>
                    <p className="w-full md:w-2/3 text-gray-600 leading-6">Apna Sehat is an AI-powered healthcare platform that enables smart triage, online doctor consultations, and secure medical record management. It streamlines patient care through priority queues, digital appointments, and real-time support, reducing hospital workload while improving accessibility and efficiency of healthcare services for patients across urban and rural communities.</p>
                </div>

                {/*CENTER SECTION*/}
                <div>
                    <p className="text-xl font-medium mb-5">COMPANY</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>Home</li>
                        <li>About Us</li>
                        <li>Contact</li>
                        <li>Privacy Policy</li>
                    </ul>

                </div>

                {/*RIGHT SECTION*/}
                <div>
                    <p className="text-xl font-medium mb-5">Get In Touch</p>
                    <ul className="flex flex-col gap-2 text-gray-600">
                        <li>
                            +91 8755157399
                        </li>
                        <li>
                            apnasehat@gmail.com
                        </li>
                    </ul>
                </div>

            </div>
            <div>
                <hr/>
                <p className="py-5 text-sm text-center">Copyright 2026@ Apna Sehat - All Right Reserved.</p>
            </div>
        </div>
    )
}
export default Footer;