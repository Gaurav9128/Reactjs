import React from "react";
import {
  FaLinkedinIn,
  FaGithub,
  FaTwitter,
} from "react-icons/fa";

import organizer1 from "../assets/Organizer3.jpeg";
//import organizer2 from "../assets/Organizer1.jpeg";

const Protocolholders = () => {
  const featuredMentor = {
    name: "Dr. Manoj Gupta",
    role: "Pro-President FCE & FET",
    image: organizer1,
    linkedin: "#",
    github: "#",
    twitter: "#",
  };

  const advisors = [
    {
      name: "Advisor Name",
      role: "Technical Advisor",
    //   image: organizer2,
      linkedin: "#",
      github: "#",
      twitter: "#",
    },
    {
      name: "Advisor Name",
      role: "Industry Mentor",
    //   image: organizer2,
      linkedin: "#",
      github: "#",
      twitter: "#",
    },
    {
      name: "Advisor Name",
      role: "Community Mentor",
    //   image: organizer2,
      linkedin: "#",
      github: "#",
      twitter: "#",
    },
    {
      name: "Advisor Name",
      role: "Faculty Mentor",
    //   image: organizer2,
      linkedin: "#",
      github: "#",
      twitter: "#",
    },
  ];

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}

        <div className="text-center mb-16">

          <span className="inline-flex px-5 py-2 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
            OUR PROTOCOL HOLDERS
          </span>

          <h2 className="text-5xl font-bold text-slate-900 mt-5">
            Mentors & Advisors
          </h2>

          <p className="text-gray-500 mt-4 text-lg">
            The passionate minds behind React Rajasthan Workshop
          </p>

        </div>

        {/* Featured Mentor */}

        <div className="flex justify-center mb-20">

          <div className="group relative w-full max-w-[420px] h-[360px] rounded-3xl overflow-hidden shadow-2xl">

            <img
              src={featuredMentor.image}
              alt={featuredMentor.name}
              className="w-full h-full object-cover object-top transition duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

            <div className="absolute bottom-0 left-0 right-0 p-7">

              <h3 className="text-white text-4xl font-bold">
                {featuredMentor.name}
              </h3>

              <p className="text-blue-400 mt-2">
                {featuredMentor.role}
              </p>

              <div className="w-16 h-1 rounded-full bg-blue-500 mt-3"></div>

              <div className="flex gap-3 mt-6">

                <a
                  href={featuredMentor.linkedin}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                >
                  <FaLinkedinIn />
                </a>

                <a
                  href={featuredMentor.github}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                >
                  <FaGithub />
                </a>

                <a
                  href={featuredMentor.twitter}
                  className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                >
                  <FaTwitter />
                </a>

              </div>

            </div>

            <div className="absolute top-5 right-5 w-14 h-14 border-4 border-white/50 rounded-2xl rotate-12"></div>

          </div>

        </div>

        {/* Advisors */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

          {advisors.map((person, index) => (

            <div
              key={index}
              className="group relative h-[260px] rounded-2xl overflow-hidden shadow-xl hover:-translate-y-2 duration-300"
            >

              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover object-top group-hover:scale-110 transition duration-700"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent"></div>

              <div className="absolute bottom-0 left-0 right-0 p-5">

                <h3 className="text-white text-2xl font-bold">
                  {person.name}
                </h3>

                <p className="text-blue-400 text-sm mt-1">
                  {person.role}
                </p>

                <div className="w-10 h-1 rounded-full bg-blue-500 mt-2"></div>

                <div className="flex gap-2 mt-4">

                  <a
                    href={person.linkedin}
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                  >
                    <FaLinkedinIn size={14} />
                  </a>

                  <a
                    href={person.github}
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                  >
                    <FaGithub size={14} />
                  </a>

                  <a
                    href={person.twitter}
                    className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex justify-center items-center text-white hover:bg-blue-600 duration-300"
                  >
                    <FaTwitter size={14} />
                  </a>

                </div>

              </div>

              <div className="absolute top-4 right-4 w-10 h-10 border-2 border-white/40 rounded-xl rotate-12"></div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
};

export default Protocolholders;