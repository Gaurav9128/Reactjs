import React from "react";
import { Mail, Phone, Users, Star } from "lucide-react";
import PartnersSection from "./PartnersSection";

const SponsorsPartners = () => {
  return (
    <section className="w-full py-16 bg-gray-50">

      {/* Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl font-bold text-gray-900">
          Our Sponsors & Partners
        </h2>
        <p className="text-gray-600 mt-2">
          The amazing companies and organizations that make this event possible
        </p>
      </div>

      {/* Cards Container */}
      <div className="max-w-6xl mx-auto px-4 space-y-8">

        {/* Sponsor Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-500/80"></div>

          <div className="relative text-white p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Star size={28} />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3">Become a Sponsor</h3>

            <p className="max-w-2xl mx-auto text-sm md:text-base text-white/90">
              Support the React community in Rajasthan and showcase your brand
              to hundreds of tech enthusiasts. We offer various sponsorship
              packages to meet your goals.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>info@reactrajasthan.com</span>
              </div>

              <div className="hidden md:block">|</div>

              <div className="flex items-center gap-2">
                <Phone size={16} />
                <span>+91 9782312993</span>
              </div>
            </div>
          </div>
        </div>

        {/* Community Partner Card */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-blue-500/80"></div>

          <div className="relative text-white p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-3 rounded-full">
                <Users size={28} />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Become a Community Partner
            </h3>

            <p className="max-w-2xl mx-auto text-sm md:text-base text-white/90">
              If you're a community, meetup group, or nonprofit interested in
              collaborating, we'd love to partner with you.
            </p>

            <div className="mt-6 text-sm flex justify-center items-center gap-2">
              <Mail size={16} />
              <span>Reach out to us</span>
            </div>
          </div>
        </div>

      </div>
      <PartnersSection />
    </section>
  );
};

export default SponsorsPartners;