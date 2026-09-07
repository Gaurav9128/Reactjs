import React from "react";
import chairman from "../assets/committee/person1.png";
import president from "../assets/committee/person2.png";
import director from "../assets/committee/person3.png";

import proPresident from "../assets/committee/person4.png";
import HOD from "../assets/committee/person9.png";
import Registrar from "../assets/committee/person7.png";
import Dean from "../assets/committee/person8.png";
import AP from "../assets/committee/person10.jpeg";
import GJ from "../assets/committee/person11.jpeg";
import ExecutiveCards from "./ExecutiveCards";

const chiefPatrons = [
  {
    image: chairman,
    name: "Shri Shashikant Singhi",
    designation: "Chairperson",
    organization: "Poornima University",
  },
  {
    image: president,
    name: "Dr. Suresh Chand Padhy",
    designation: "President",
    organization: "Poornima University",
  },
  {
    image: director,
    name: "Ar. Rahul Singhi",
    designation: "Director",
    organization: "Poornima University",
  },
];

const generalChairs = [
  {
    image: proPresident,
    name: "Dr. Manoj Gupta",
    designation: "Pro-President (FET & FCE)",
    organization: "Poornima University",
  },
];

const coGeneralChairs = [
  {
    image: HOD,
    name: "Dr. Savita Shiwani",
    designation: "HOD(FCE BCA Higher)",
    organization: "Poornima University",
  },
  {
    image: Registrar,
    name: "Dr. Devendra Somvanshi",
    designation: "Registrar",
    organization: "Poornima University",
  },
  {
    image: Dean,
    name: "Dr. Shikha Sharma",
    designation: "Dean, FCE",
    organization: "Poornima University",
  },
];

const convener = [
  {
    image: AP,
    name: "Rishi kumar Jalwal",
    designation: "Assistant Professor",
    organization: "Poornima University",
  },
  {
    image: GJ,
    name: "Gaurav Jain",
    designation: "Assistant Professor",
    organization: "Poornima University",
  },
];

const CommitteeCard = ({ person }) => (
  <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-4 text-center border border-[#edf2fb] hover:-translate-y-1 w-full max-w-[260px] mx-auto flex flex-col items-center">
    {/* Compact Framed Image */}
    <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden bg-slate-100 mb-4">
      <img
        src={person.image}
        alt={person.name}
        className="w-full h-full object-cover object-top transition-transform duration-300 hover:scale-105"
      />
    </div>

    {/* Content */}
    <h3 className="text-base font-bold text-slate-800 line-clamp-1">
      {person.name}
    </h3>

    <p className="mt-1 text-xs font-semibold text-[#23439B]">
      {person.designation}
    </p>

    <p className="mt-1 text-[11px] text-gray-500">
      {person.organization}
    </p>
  </div>
);

const CommitteeSection = () => {
  return (
    <section className="bg-[#F7F8FC] py-14 sm:py-20 lg:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Chief Patrons */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-[#23439B] uppercase mb-8 sm:mb-12 tracking-wide">
          Chief Patrons
        </h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {chiefPatrons.map((item, index) => (
            <CommitteeCard key={index} person={item} />
          ))}
        </div>

        {/* General Chairs */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-[#23439B] uppercase mt-16 sm:mt-20 mb-8 sm:mb-12 tracking-wide">
          General Chairs
        </h2>

        <div className="flex justify-center max-w-5xl mx-auto">
          {generalChairs.map((item, index) => (
            <CommitteeCard key={index} person={item} />
          ))}
        </div>

        {/* CO-General Chairs */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-[#23439B] uppercase mt-16 sm:mt-20 mb-8 sm:mb-12 tracking-wide">
          CO-General Chairs
        </h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
          {coGeneralChairs.map((item, index) => (
            <CommitteeCard key={index} person={item} />
          ))}
        </div>

        {/* Convener */}
        <h2 className="text-center text-xl sm:text-2xl font-bold text-[#23439B] uppercase mt-16 sm:mt-20 mb-8 sm:mb-12 tracking-wide">
          Convener
        </h2>

        <div className="flex flex-wrap justify-center gap-6 max-w-3xl mx-auto">
          {convener.map((item, index) => (
            <CommitteeCard key={index} person={item} />
          ))}
        </div>
      </div>

      <ExecutiveCards />
    </section>
  );
};

export default CommitteeSection;