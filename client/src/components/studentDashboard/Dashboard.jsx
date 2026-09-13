import { useState } from "react";
import Icon from "./Icon.jsx";
import ProfileTab from "./ProfileTab.jsx";
import TicketsTab from "./TicketsTab.jsx";
import AttendanceTab from "./AttendanceTab.jsx";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("");

  return (
    <div className="min-h-screen bg-[#edf4fb] py-6 sm:py-8 lg:py-10">
      <div className="mx-auto w-full max-w-[1450px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_20px_60px_rgba(30,64,175,0.08)]">
          {/* =================================================
              PAGE HEADER
          ================================================= */}

          <div className="px-5 py-6 sm:px-8 lg:px-12 lg:py-7">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1935] sm:text-4xl">
                Welcome, {displayName || "Student"}
              </h1>

              <p className="mt-1.5 text-sm font-medium text-slate-500 sm:text-base">
                Manage your profile, tickets, and attendance
              </p>
            </div>
          </div>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="border-y border-slate-100 px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-3">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                aria-label="Profile"
                className={`relative flex items-center justify-center gap-2.5 px-2 py-5 text-sm font-bold transition sm:text-base ${
                  activeTab === "profile"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon name="user" size={23} />

                <span className="hidden sm:inline">Profile</span>

                {activeTab === "profile" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                aria-label="Tickets"
                className={`relative flex items-center justify-center gap-2.5 border-l border-slate-100 px-2 py-5 text-sm font-bold transition sm:text-base ${
                  activeTab === "tickets"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon name="ticket" size={23} />

                <span className="hidden sm:inline">Tickets</span>

                {activeTab === "tickets" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("attendance")}
                aria-label="Attendance"
                className={`relative flex items-center justify-center gap-2.5 border-l border-slate-100 px-2 py-5 text-sm font-bold transition sm:text-base ${
                  activeTab === "attendance"
                    ? "text-blue-600"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                <Icon name="chart" size={23} />

                <span className="hidden sm:inline">Attendance</span>

                {activeTab === "attendance" && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] rounded-full bg-blue-600" />
                )}
              </button>
            </div>
          </div>

          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="px-5 py-6 sm:px-8 lg:px-12 lg:py-7">
            {activeTab === "profile" && (
              <ProfileTab onNameLoaded={setDisplayName} />
            )}

            {activeTab === "tickets" && <TicketsTab />}

            {activeTab === "attendance" && <AttendanceTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
