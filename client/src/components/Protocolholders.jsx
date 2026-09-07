import React from "react";
import { FaLinkedinIn, FaGithub, FaTwitter } from "react-icons/fa";

import organizer1 from "../assets/Organizer3.jpeg";
// import organizer2 from "../assets/Organizer1.jpeg";

const Protocolholders = () => {
  const patrons = [
    {
      name: "Shri Shashikant Singhi",
      role: "Chairperson",
      organization: "Poornima University",
      image: organizer1,
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Dr. Suresh Chand Padhy",
      role: "President",
      organization: "Poornima University",
      image: organizer1,
      linkedin: "#",
      twitter: "#",
    },
    {
      name: "Ar. Rahul Singhi",
      role: "Director",
      organization: "Poornima University",
      image: organizer1,
      linkedin: "#",
      twitter: "#",
    },
  ];

  const advisors = [
    {
      name: "Advisor Name",
      role: "Technical Advisor",
      organization: "Tech Lead",
      image: organizer1,
      linkedin: "#",
      github: "#",
    },
    {
      name: "Advisor Name",
      role: "Industry Mentor",
      organization: "Product Engineer",
      image: organizer1,
      linkedin: "#",
      github: "#",
    },
    {
      name: "Advisor Name",
      role: "Community Mentor",
      organization: "Community Lead",
      image: organizer1,
      linkedin: "#",
      github: "#",
    },
    {
      name: "Advisor Name",
      role: "Faculty Mentor",
      organization: "Assistant Professor",
      image: organizer1,
      linkedin: "#",
      github: "#",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <span className="inline-flex px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-xs uppercase tracking-wider">
            Our Protocol Holders
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            CHIEF PATRONS
          </h2>
          <p className="text-gray-500 mt-3 text-base md:text-lg">
            Guiding minds behind React Rajasthan Workshop
          </p>
        </div>

        {/* --- CHIEF PATRONS (Square / Rectangular Cards) --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-24">
          {patrons.map((patron, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col group"
            >
              {/* Rectangular Image Container */}
              <div className="w-full aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={patron.image}
                  alt={patron.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Details */}
              <div className="p-6 text-center flex flex-col items-center flex-grow">
                <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {patron.name}
                </h3>
                
                <p className="text-slate-600 font-medium text-sm mt-1">
                  {patron.role}
                </p>

                <span className="text-slate-400 text-xs mt-1">
                  {patron.organization}
                </span>

                {/* Social Links */}
                <div className="flex gap-3 mt-5">
                  {patron.linkedin && (
                    <a
                      href={patron.linkedin}
                      className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                      aria-label="LinkedIn"
                    >
                      <FaLinkedinIn size={14} />
                    </a>
                  )}
                  {patron.twitter && (
                    <a
                      href={patron.twitter}
                      className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-400 hover:text-white transition-all duration-200"
                      aria-label="Twitter"
                    >
                      <FaTwitter size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- GENERAL CHAIRS & ADVISORS --- */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
            GENERAL CHAIRS & ADVISORS
          </h3>
          <div className="w-16 h-1 bg-blue-600 mx-auto rounded-full mt-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {advisors.map((advisor, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200 flex flex-col group"
            >
              {/* Rectangular Image for Advisors */}
              <div className="w-full aspect-square overflow-hidden bg-slate-100">
                <img
                  src={advisor.image}
                  alt={advisor.name}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5 text-center flex flex-col items-center flex-grow">
                <h4 className="text-base font-bold text-slate-800">
                  {advisor.name}
                </h4>
                
                <p className="text-blue-600 font-medium text-xs mt-1">
                  {advisor.role}
                </p>

                <span className="text-slate-400 text-xs mt-0.5">
                  {advisor.organization}
                </span>

                <div className="flex gap-2.5 mt-4">
                  <a
                    href={advisor.linkedin}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-blue-600 hover:text-white transition-colors"
                  >
                    <FaLinkedinIn size={12} />
                  </a>
                  <a
                    href={advisor.github}
                    className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    <FaGithub size={12} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Protocolholders;