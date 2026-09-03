import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookOpen,
  FileSpreadsheet,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/admin/dashboard",
    },
    {
      name: "Students",
      icon: <Users size={20} />,
      path: "/admin/students",
    },
    {
      name: "Attendance",
      icon: <CalendarCheck size={20} />,
      path: "/admin/attendance",
    },
    {
      name: "Attendance Scanner",
      icon: <CalendarCheck size={20} />,
      path: "/admin/attendance-scanner",
    },
    {
      name: "Workshop",
      icon: <BookOpen size={20} />,
      path: "/admin/workshop",
    },
    {
      name: "Reports",
      icon: <FileSpreadsheet size={20} />,
      path: "/admin/reports",
    },
  ];

  return (
    <>
      {/* ================= Mobile Header ================= */}

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0F172A] text-white flex items-center justify-between px-4 shadow-md z-50">
        <h2 className="font-bold text-lg">ReactJS Workshop</h2>

        <button onClick={() => setIsOpen(true)}>
          <Menu size={28} />
        </button>
      </div>

      {/* ================= Overlay ================= */}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* ================= Sidebar ================= */}

      <div
        className={`
        fixed top-0 left-0 h-screen w-72 bg-[#0F172A] text-white z-50
        transform transition-transform duration-300 ease-in-out
        ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }
        lg:translate-x-0
      `}
      >
        {/* Header */}

        <div className="flex items-center justify-between px-6 py-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold">
              ReactJS Workshop
            </h2>

            <p className="text-gray-400 text-sm">
              Admin Panel
            </p>
          </div>

          <button
            className="lg:hidden"
            onClick={() => setIsOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        {/* Menu */}

        <div className="mt-6 flex flex-col">

          {menuItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-4 transition-all duration-300
                ${
                  isActive
                    ? "bg-blue-600"
                    : "hover:bg-blue-600"
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>

          ))}

          <button
            onClick={logout}
            className="flex items-center gap-3 px-6 py-4 hover:bg-red-600 mt-5 transition-all"
          >
            <LogOut size={20} />
            Logout
          </button>

        </div>
      </div>
    </>
  );
};

export default Sidebar;