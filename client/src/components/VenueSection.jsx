import React from "react";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  ExternalLink, 
  Building, 
  Users, 
  ParkingSquare, // Ample Parking ke liye
  Leaf, 
  Briefcase, 
  Heart,
  Star
} from "lucide-react";
import poornimaImg from "../assets/poornima.png";
import WhatToExpect from "./WhatToExpect";

const VenueSection = () => {
  return (
    <section className="w-full bg-[#f9fafc] py-16 px-4 md:px-20 font-sans">
      
      {/* Header */}
      <div className="text-center mb-12">
        <span className="inline-block px-4 py-1 text-xs font-bold bg-[#efe9ff] text-[#7c3bed] rounded-full uppercase tracking-wider">
          📍 Event Venue
        </span>

        <h2 className="text-4xl md:text-5xl font-extrabold mt-4 text-[#0f172a]">
          Our Venue
        </h2>

        <p className="text-gray-500 mt-3 max-w-2xl mx-auto text-base">
          Join us for an inspiring day of learning, collaboration and networking at Poornima University.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-7xl mx-auto">
        
        {/* Left Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-gray-100 flex flex-col justify-between">
          <div>
            {/* Title Section with Icon */}
            <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
              <div className="p-3 bg-[#f3e8ff] rounded-2xl text-[#7c3bed]">
                <Building size={28} />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
                  Poornima University
                </h3>
                <p className="text-gray-500 text-sm mt-1">
                  A premier destination for innovation and learning.
                </p>
              </div>
            </div>

            {/* Info List */}
            <div className="mt-8 space-y-6">
              {/* Location */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#f3e8ff] rounded-xl text-[#7c3bed] mt-0.5">
                  <MapPin size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7c3bed] uppercase tracking-wider">Location</p>
                  <p className="text-gray-600 font-medium text-sm mt-0.5">
                    Plot No. IS-2027-2031, Ramchandrapura P.O. Vidhani Vatika Road Sitapura, Rajasthan 302022
                  </p>
                </div>
              </div>

              {/* Date */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#f3e8ff] rounded-xl text-[#7c3bed] mt-0.5">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7c3bed] uppercase tracking-wider">Date</p>
                  <p className="text-gray-600 font-medium text-sm mt-0.5">
                    Tentative - 10 Aug to 14 Aug  2026
                  </p>
                </div>
              </div>

              {/* Time */}
              <div className="flex gap-4 items-start">
                <div className="p-2.5 bg-[#f3e8ff] rounded-xl text-[#7c3bed] mt-0.5">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#7c3bed] uppercase tracking-wider">Time</p>
                  <p className="text-gray-600 font-medium text-sm mt-0.5">
                    9:00 AM Onwards
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="mt-8">
            <a
              href="https://maps.app.goo.gl/H1fNf2dUakBTdJnj7"
              target="_blank"
              rel="noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 border-2 border-[#7c3bed] text-[#7c3bed] font-semibold rounded-xl hover:bg-[#f3e8ff] transition-all duration-300"
            >
              <ExternalLink size={18} /> View on Google Maps
            </a>
          </div>
        </div>

        {/* Right Card (Image + Overlay Specs) */}
        <div className="relative rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between group min-h-[450px]">
          {/* Main Background Image */}
          <img
            src={poornimaImg}
            alt="Poornima University Campus"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-102 transition duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          {/* Bottom Dark Overlay Section */}
          <div className="relative mt-auto m-4 p-5 bg-[#1e1b4b]/80 backdrop-blur-md rounded-2xl border border-white/10 grid grid-cols-3 gap-2 text-white">
            {/* Spec 1 */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2.5">
              <Building size={20} className="text-white/80 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs md:text-sm">Modern Campus</p>
                <p className="text-[10px] md:text-xs text-gray-300 mt-0.5">State-of-the-art infrastructure</p>
              </div>
            </div>

            {/* Spec 2 */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2.5 border-x border-white/10 px-2">
              <Users size={20} className="text-white/80 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs md:text-sm">Great Connectivity</p>
                <p className="text-[10px] md:text-xs text-gray-300 mt-0.5">Well-connected location in Jaipur</p>
              </div>
            </div>

            {/* Spec 3 */}
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-2.5">
              <ParkingSquare size={20} className="text-white/80 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs md:text-sm">Ample Parking</p>
                <p className="text-[10px] md:text-xs text-gray-300 mt-0.5">Hassle-free parking for all attendees</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Features Strip: "Why this venue?" */}
      <div className="max-w-7xl mx-auto mt-8 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Label */}
        <div className="flex items-center gap-2 border-l-4 border-[#7c3bed] pl-4 self-start md:self-auto shrink-0">
          <Star size={18} className="text-[#7c3bed] fill-[#7c3bed]" />
          <h4 className="text-lg font-bold text-[#0f172a]">Why this venue?</h4>
        </div>

        {/* Feature 1 */}
        <div className="flex items-start gap-3 w-full md:w-auto">
          <div className="p-2.5 bg-[#f3e8ff] rounded-full text-[#7c3bed] shrink-0">
            <Leaf size={18} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-[#0f172a]">Inspiring Environment</h5>
            <p className="text-xs text-gray-500 mt-0.5">Conducive atmosphere for learning & innovation</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-3 w-full md:w-auto">
          <div className="p-2.5 bg-[#f3e8ff] rounded-full text-[#7c3bed] shrink-0">
            <Briefcase size={18} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-[#0f172a]">Industry Ready</h5>
            <p className="text-xs text-gray-500 mt-0.5">Perfect for professional events & networking</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-3 w-full md:w-auto">
          <div className="p-2.5 bg-[#f3e8ff] rounded-full text-[#7c3bed] shrink-0">
            <Heart size={18} />
          </div>
          <div>
            <h5 className="font-bold text-sm text-[#0f172a]">Memorable Experience</h5>
            <p className="text-xs text-gray-500 mt-0.5">Creating connections that last beyond the event</p>
          </div>
        </div>

      </div>

    </section>
  );
};
<WhatToExpect/>
export default VenueSection;