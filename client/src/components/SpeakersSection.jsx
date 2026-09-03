import React from "react";

const SpeakersSection = () => {
  return (
    <section className="w-full py-20 bg-white flex flex-col items-center justify-center px-4">

      {/* Title */}
      <h2 className="text-4xl font-bold text-gray-900 text-center">
        Meet Our Speakers
      </h2>

      {/* Subtitle */}
      <p className="mt-3 text-lg text-gray-600 text-center">
        Learn from industry experts and React professionals
      </p>

      {/* Empty State Card */}
      <div className="mt-10 bg-gray-50 shadow-md rounded-xl px-8 py-6 max-w-2xl text-center border border-gray-100">
        <p className="text-gray-700 font-medium">
          No speakers have been announced yet. Stay tuned for updates!
        </p>
      </div>

      {/* Call for Speaker */}
      <p className="mt-10 text-center text-gray-700">
        Have a good tech tale to tell?{" "}
        <span className="text-blue-500 font-semibold cursor-pointer hover:underline">
          Call for Speaker
        </span>
      </p>

    </section>
  );
};

export default SpeakersSection;