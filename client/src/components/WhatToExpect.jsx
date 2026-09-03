import {
  Mic,
  Users,
  GraduationCap,
} from "lucide-react";

const WhatToExpect = () => {
  const features = [
    {
      icon: <Mic size={40} />,
      title: "Technical Talks",
      description:
        "Learn React, Node.js, modern frontend architecture, performance optimization and industry best practices from experts.",
      color: "from-purple-500 to-pink-500",
      glow: "shadow-purple-500/30",
    },
    {
      icon: <Users size={40} />,
      title: "Networking",
      description:
        "Connect with fellow developers, mentors, industry professionals and like-minded tech enthusiasts.",
      color: "from-cyan-500 to-blue-500",
      glow: "shadow-cyan-500/30",
    },
    {
      icon: <GraduationCap size={40} />,
      title: "Hands-on Workshops",
      description:
        "Build real-world React projects, explore modern tools and gain practical experience during the sessions.",
      color: "from-yellow-500 to-orange-500",
      glow: "shadow-yellow-500/30",
    },
  ];

  return (
    <section className="relative py-24 bg-gradient-to-b from-white via-blue-50 to-white overflow-hidden">
  {/* Background Effects */}
  <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300/20 blur-[120px]" />
  <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-300/20 blur-[120px]" />

  <div className="max-w-7xl mx-auto px-6 relative z-10">
    
    {/* Heading */}
    <div className="text-center mb-16">
      <p className="uppercase tracking-[6px] text-blue-600 font-semibold mb-4">
        WHAT TO EXPECT
      </p>

      <h2 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight">
        Learn.
        <span className="text-blue-600"> Build.</span>
        <br />
        Connect.
      </h2>

      <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 mx-auto mt-6 rounded-full"></div>
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="group relative bg-white border border-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-blue-200 transition-all duration-500 hover:-translate-y-3">

        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white mx-auto mb-6">
          <Mic size={38} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
          Technical Talks
        </h3>

        <p className="text-slate-600 text-center leading-relaxed">
          Explore React, Frontend Architecture, Performance Optimization and Industry Trends.
        </p>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-b-3xl"></div>
      </div>

      {/* Card 2 */}
      <div className="group relative bg-white border border-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-blue-200 transition-all duration-500 hover:-translate-y-3">

        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-sky-500 to-blue-500 text-white mx-auto mb-6">
          <Users size={38} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
          Networking
        </h3>

        <p className="text-slate-600 text-center leading-relaxed">
          Meet Developers, Mentors, Industry Experts and Build Valuable Connections.
        </p>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-b-3xl"></div>
      </div>

      {/* Card 3 */}
      <div className="group relative bg-white border border-blue-100 rounded-3xl p-8 shadow-lg hover:shadow-blue-200 transition-all duration-500 hover:-translate-y-3">

        <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white mx-auto mb-6">
          <GraduationCap size={38} />
        </div>

        <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
          Hands-on Workshops
        </h3>

        <p className="text-slate-600 text-center leading-relaxed">
          Build Real Projects, Learn Best Practices and Gain Practical Experience.
        </p>

        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-b-3xl"></div>
      </div>

    </div>
  </div>
</section>
  );
};

export default WhatToExpect;