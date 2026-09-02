import React from "react";

// Import your logos
import company1 from "../assets/company1.png";
import company2 from "../assets/company2.png";
import company3 from "../assets/company3.png";
import company4 from "../assets/company4.png";

const companies = [
  {
    name: "Company 1",
    logo: company1,
  },
  {
    name: "Company 2",
    logo: company2,
  },
  {
    name: "Company 3",
    logo: company3,
  },
  {
    name: "Company 4",
    logo: company4,
  },
];

const PartnersSection = () => {
  return (
    <section className="bg-[#f5f5f5] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-5">

        {/* Heading */}
        <h2 className="text-center text-[#D97706] font-bold uppercase tracking-wide text-2xl md:text-4xl mb-12">
          In Collaboration With
        </h2>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">

          {companies.map((company, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg border border-gray-100
              h-40 md:h-52 flex items-center justify-center
              transition-all duration-300 hover:-translate-y-2
              hover:shadow-2xl"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="max-h-20 md:max-h-28 max-w-[75%] object-contain"
              />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default PartnersSection;