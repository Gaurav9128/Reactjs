import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Award, 
  Code, 
  Laptop, 
  CheckCircle2, 
  ChevronRight, 
  PartyPopper,
  BookOpen
} from 'lucide-react';

const scheduleData = [
  {
    day: 1,
    title: "Inauguration & Commencement",
    subtitle: "Setting up the Foundation",
    sections: [
      {
        type: "Inauguration Ceremony",
        icon: <PartyPopper className="w-5 h-5 text-amber-500" />,
        color: "from-amber-500/10 to-orange-500/10 border-amber-500/20",
        items: [
          "Registration of Participants",
          "Welcome of Guests and Participants",
          "Lighting of the Lamp (Lamp Lighting Ceremony)",
          "Saraswati Vandana (Optional)",
          "Welcome Address by Workshop Coordinator",
          "Inaugural Speech by Chief Guest",
          "Address by University Authorities",
          "Introduction to the Workshop Objectives and Outcomes",
          "Distribution of Swag Kits to Participants",
          "Vote of Thanks"
        ]
      },
      {
        type: "Technical Session",
        icon: <BookOpen className="w-5 h-5 text-blue-500" />,
        color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
        items: [
          "Introduction to React.js",
          "Why React is Popular in Industry",
          "Setting up Development Environment",
          "Vite and React Project Creation",
          "JSX Fundamentals",
          "Components and Props"
        ]
      },
      {
        type: "Hands-on Activity",
        icon: <Laptop className="w-5 h-5 text-emerald-500" />,
        color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        items: [
          "Creating the First React Application",
          "Building a Student Profile Card"
        ]
      }
    ]
  },
  {
    day: 2,
    title: "Fundamentals & State",
    subtitle: "Core React Concepts",
    sections: [
      {
        type: "Topics Covered",
        icon: <Code className="w-5 h-5 text-blue-500" />,
        color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
        items: [
          "State Management using useState",
          "Event Handling",
          "Conditional Rendering",
          "List Rendering",
          "Form Handling"
        ]
      },
      {
        type: "Hands-on Activity",
        icon: <Laptop className="w-5 h-5 text-emerald-500" />,
        color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        items: [
          "Counter Application",
          "Student Registration Form",
          "Task Manager Application"
        ]
      }
    ]
  },
  {
    day: 3,
    title: "Routing & API Integration",
    subtitle: "Connecting to the Real World",
    sections: [
      {
        type: "Topics Covered",
        icon: <Code className="w-5 h-5 text-blue-500" />,
        color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
        items: [
          "React Router",
          "Navigation and Dynamic Routing",
          "REST APIs",
          "Fetch API and Axios"
        ]
      },
      {
        type: "Hands-on Activity",
        icon: <Laptop className="w-5 h-5 text-emerald-500" />,
        color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        items: [
          "Multi-Page Application",
          "User Directory using API"
        ]
      }
    ]
  },
  {
    day: 4,
    title: "Advanced Development",
    subtitle: "Hooks & State Ecosystem",
    sections: [
      {
        type: "Topics Covered",
        icon: <Code className="w-5 h-5 text-blue-500" />,
        color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
        items: [
          "useEffect Hook",
          "Context API",
          "Local Storage",
          "Project Structure and Best Practices"
        ]
      },
      {
        type: "Hands-on Activity",
        icon: <Laptop className="w-5 h-5 text-emerald-500" />,
        color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20",
        items: [
          "Theme Switcher",
          "Student Management System"
        ]
      }
    ]
  },
  {
    day: 5,
    title: "Deployment & Closing",
    subtitle: "Showcase & Valedictory",
    sections: [
      {
        type: "Technical Session",
        icon: <Code className="w-5 h-5 text-blue-500" />,
        color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20",
        items: [
          "Final Project Development",
          "Git and GitHub Basics",
          "Application Deployment on Vercel"
        ]
      },
      {
        type: "Project Showcase",
        icon: <Laptop className="w-5 h-5 text-purple-500" />,
        color: "from-purple-500/10 to-pink-500/10 border-purple-500/20",
        items: [
          "Participant Project Demonstrations",
          "Evaluation by Experts"
        ]
      },
      {
        type: "Valedictory / Closing Ceremony",
        icon: <Award className="w-5 h-5 text-rose-500" />,
        color: "from-rose-500/10 to-red-500/10 border-rose-500/20",
        items: [
          "Welcome of Dignitaries",
          "Summary of Workshop Outcomes",
          "Feedback from Participants",
          "Address by Chief Guest",
          "Certificate Distribution to Participants",
          "Distribution of Gifts and Mementos",
          "Announcement of Best Project Awards",
          "Selection & Recognition of 'React.js Best Student Ambassador'",
          "Group Photograph",
          "Vote of Thanks"
        ]
      }
    ]
  }
];

export default function WorkshopSchedule() {
  const [activeDay, setActiveDay] = useState(1);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 rounded-full uppercase">
            Event Schedule
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            5-Day National Level Workshop
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-base text-slate-500 dark:text-slate-400">
            Master React.js from basics to deployment with industry experts, hands-on labs, and final project certifications.
          </p>
        </div>

        {/* Desktop & Mobile Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          {scheduleData.map((d) => (
            <button
              key={d.day}
              onClick={() => setActiveDay(d.day)}
              className={`flex-1 min-w-[100px] sm:flex-initial px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                activeDay === d.day
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="text-xs opacity-80 uppercase tracking-wider">Day</div>
              <div className="text-base font-bold">0{d.day}</div>
            </button>
          ))}
        </div>

        {/* Active Content Display */}
        <AnimatePresence mode="wait">
          {scheduleData.map((d) => d.day === activeDay && (
            <motion.div
              key={d.day}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              {/* Day Summary Card */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 opacity-80" />
                  <span className="text-sm font-semibold tracking-wider uppercase opacity-90">Timeline Blueprint</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold">Day {d.day}: {d.title}</h3>
                <p className="mt-1 text-blue-100 font-medium text-sm sm:text-base opacity-90">{d.subtitle}</p>
              </div>

              {/* Grid Layout for Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {d.sections.map((section, sIndex) => (
                  <div 
                    key={sIndex}
                    className={`bg-gradient-to-br ${section.color} border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:gap-8 items-start`}
                  >
                    {/* Left Column: Section Badge */}
                    <div className="flex items-center gap-3 md:w-1/4 mb-4 md:mb-0 shrink-0">
                      <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700">
                        {section.icon}
                      </div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base md:text-md">
                        {section.type}
                      </h4>
                    </div>

                    {/* Right Column: Detailed Items Grid */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {section.items.map((item, iIndex) => (
                        <div 
                          key={iIndex} 
                          className="flex items-start gap-2.5 bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm p-3 rounded-xl border border-white/50 dark:border-slate-700/50 hover:shadow-sm transition-all"
                        >
                          <CheckCircle2 className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-tight">
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

      </div>
    </div>
  );
}