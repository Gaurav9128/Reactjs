import React from "react";
import { FaLinkedinIn, FaGithub, FaXTwitter } from "react-icons/fa6";

import Team1 from "../assets/Team1.1.jpeg";
import Team2 from "../assets/Team2.jpeg";
import Team3 from "../assets/Team3.jpeg";
import Team4 from "../assets/Team4.jpeg";

const organizers = [
  {
    name: "Divyanshi Jain",
    role: "Registration & Management",
    desc: "Manages student registration, attendance tracking and certificate distribution.",
    image: Team1,
  },
  {
    name: "Yuvraj Singh",
    role: "Media & Documentation",
    desc: "Captures photos & videos and manages social media highlights.",
    image: Team2,
  },
  {
    name: "Kushika Mittal",
    role: "Communication Team",
    desc: "Manages announcements and acts as a bridge between speakers and participants.",
    image: Team3,
  },
  {
    name: "Riddhi Bhatnagar",
    role: "Registration & Management",
    desc: "Handles registrations, attendance tracking and certificates.",
    image: Team4,
  },
];

const ExecutiveCards = () => {
  return (
    <section className="bg-gradient-to-br from-slate-50 to-blue-50 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Meet Our Crew Team
          </h2>

          <p className="text-gray-500 mt-3 text-base">
            The minds behind the event — building, managing & executing everything.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-2">

          {organizers.map((person, index) => (
            <div
              key={index}
              className="
              bg-white
              rounded-2xl
              shadow-md
              hover:shadow-xl
              transition
              duration-300
              border
              border-gray-100
              p-5
              flex
              flex-col
              sm:flex-row
              items-center
              gap-5
              "
            >

              {/* Image */}
              <img
                src={person.image}
                alt={person.name}
                className="
                w-32
                h-32
                rounded-xl
                object-cover
                border-4
                border-blue-100
                shrink-0
                "
              />

              {/* Content */}
              <div className="flex-1 text-center sm:text-left">

                <h3 className="text-xl font-semibold text-gray-800">
                  {person.name}
                </h3>

                <p className="text-blue-600 font-medium mt-1">
                  {person.role}
                </p>

                <p className="text-sm text-gray-500 mt-2 leading-6">
                  {person.desc}
                </p>

                <div className="flex justify-center sm:justify-start gap-4 mt-5 text-gray-500 text-lg">

                  <FaLinkedinIn className="cursor-pointer hover:text-blue-700 transition" />
                  <FaGithub className="cursor-pointer hover:text-black transition" />
                  <FaXTwitter className="cursor-pointer hover:text-sky-500 transition" />

                </div>

              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default ExecutiveCards;