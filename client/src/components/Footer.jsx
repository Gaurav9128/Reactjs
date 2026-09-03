import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo1.png";
import {
  FaLinkedinIn,
  FaGithub,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-white to-blue-50 overflow-hidden">

      {/* Top Shape */}
      <div className="absolute top-0 left-0 w-full h-32 bg-blue-600 rounded-b-[100px] opacity-10"></div>

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">

        {/* Yahan grid ko 3 columns (lg:grid-cols-3) kar diya hai */}
        <div className="grid md:grid-cols-3 gap-12 items-start">

          {/* 1. Logo Section */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="Poornima University" className="h-25 w-auto" />
            </Link>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Rajasthan's largest React community helping developers
              learn, connect and grow together.
            </p>

            <div className="flex gap-4 mt-6">
              {[FaLinkedinIn, FaGithub, FaInstagram, FaYoutube, FaWhatsapp].map(
                (Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition"
                  >
                    <Icon />
                  </a>
                )
              )}
            </div>
          </div>

          {/* 2. Links Section */}
          <div className="md:pl-12">
            <h3 className="font-bold text-xl mb-5 text-gray-900">
              Explore
            </h3>

            <ul className="space-y-3 text-gray-600">
              <li>
                <Link to="#" className="hover:text-blue-600 cursor-pointer transition block">Home</Link>
              </li>
              <li>
                <Link to="/speakers" className="hover:text-blue-600 cursor-pointer transition block">Speakers</Link>
              </li>
              <li>
                <Link to="/sponsors" className="hover:text-blue-600 cursor-pointer transition block">Sponsors</Link>
              </li>
              <li>
                <Link to="/venue" className="hover:text-blue-600 cursor-pointer transition block">Venue</Link>
              </li>
              <li>
                <Link to="/organizers" className="hover:text-blue-600 cursor-pointer transition block">Organizers</Link>
              </li>
              <li>
                <Link to="/workshop-schedule" className="hover:text-blue-600 cursor-pointer transition block">Workshop Schedule</Link>
              </li>
            </ul>
          </div>

          {/* 3. Newsletter Section */}
          <div>
            <h3 className="font-bold text-xl mb-5 text-gray-900">
              Stay Updated
            </h3>

            <p className="text-gray-600 mb-4">
              Get updates about workshops and events.
            </p>

            <div className="bg-white p-2 rounded-2xl shadow-lg flex border border-gray-100">
              <input
                type="email"
                placeholder="Enter Email"
                className="flex-1 px-3 outline-none bg-transparent min-w-0"
              />

              <button className="bg-blue-600 text-white px-5 py-3 rounded-xl hover:bg-blue-700 transition shrink-0">
                Join
              </button>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t mt-16 pt-8 text-center border-gray-200">
          <p className="text-gray-600">
            © 2026 Poornima University. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;