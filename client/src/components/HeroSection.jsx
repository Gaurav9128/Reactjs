import React, { useEffect, useState } from "react";
import homeImage from "../assets/home.png";
import homeVideo from "../assets/Video.mp4";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden py-20">

      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            transform: `translateY(${offset * 0.1}px)`,
            willChange: "transform",
          }}
        >
          <source src={homeVideo} type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Floating Glow */}
      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-pink-500/30 blur-[140px] rounded-full animate-pulse" />

      {/* Content Wrapper */}
      <div className="relative z-10 w-full flex justify-center px-4">

        {/* Glass Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-6 md:p-10 shadow-2xl animate-fadeUp max-w-4xl w-full text-center">

          {/* Title */}
          <h1 className="text-center leading-none">
            {/* First Line */}
            <span className="block text-3xl md:text-7xl font-extrabold text-white">
              React Rajasthan
            </span>

            {/* Second Line */}
            <span className="block text-3xl md:text-7xl font-extrabold text-white mt-2">
              Workshop
            </span>

            {/* Hosted By */}
            <div className="flex items-center justify-center gap-5 my-5">
              <div className="w-16 md:w-32 h-[2px] bg-white/30"></div>

              <span className="text-pink-300 text-xl md:text-4xl font-bold">
                Hosted by
              </span>

              <div className="w-16 md:w-32 h-[2px] bg-white/30"></div>
            </div>

            {/* University */}
            <span className="block text-3xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-500 to-blue-500 bg-clip-text text-transparent">
              Poornima University
            </span>
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg md:text-3xl mt-4 font-medium text-pink-200">
            5 Days Immersive React Workshop
          </h2>

          {/* Description */}
          <p className="mt-5 text-white/80 text-base md:text-xl">
            Experience a hands-on learning journey with real-world projects,
            expert mentorship, and community-driven development.
          </p>

          {/* Info */}
          <div className="mt-6 space-y-2 text-white/80 text-base md:text-lg">
            <p>📅Tentative : 8 Sept – 13 Sept 2026</p>
            <p>⏰ 2:00 PM – 5:00 PM</p>
            <p>📍 Poornima University</p>
          </div>

          {/* Buttons */}
          <div  onClick={() => navigate("/register")} className="mt-8 flex flex-wrap gap-4 justify-center pb-2">
            <button className="px-6 md:px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition transform">
              Register Now
            </button>

            <button className="px-6 md:px-8 py-3 rounded-full border border-white/40 text-white hover:bg-white hover:text-black transition">
              Join Us
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;