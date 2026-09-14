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
  Ticket,
  ScanLine,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      name: "Students",
      icon: Users,
      path: "/admin/students",
    },
    {
      name: "Attendance",
      icon: CalendarCheck,
      path: "/admin/attendance",
    },
    {
      name: "Attendance Scanner",
      icon: ScanLine,
      path: "/admin/attendance-scanner",
    },
    {
      name: "Workshop",
      icon: BookOpen,
      path: "/admin/workshop",
    },
    {
      name: "Reports",
      icon: FileSpreadsheet,
      path: "/admin/reports",
    },
    {
      name: "Ticket Requests",
      icon: Ticket,
      path: "/admin/ticket-requests",
    },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#0b1b33] text-white flex items-center justify-between px-4 shadow-lg z-50">
        <div>
          <h2 className="font-bold text-lg leading-tight">
            ReactJS Workshop
          </h2>
          <p className="text-xs text-blue-200">
            Admin Panel
          </p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <Menu size={26} />
        </button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64
          bg-[#0b1b33] text-white z-50
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Branding */}
        <div className="px-6 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-md">
              <span className="text-[#1557c0] font-black text-lg">
                PU
              </span>
            </div>

            <div>
              <h1 className="font-bold text-lg tracking-wide">
                POORNIMA
              </h1>

              <p className="text-[10px] tracking-[0.25em] text-blue-200">
                UNIVERSITY
              </p>
            </div>

            <button
              className="ml-auto lg:hidden text-blue-200 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X size={22} />
            </button>
          </div>

          <div className="mt-6">
            <h2 className="font-semibold text-[15px]">
              ReactJS Workshop
            </h2>

            <p className="text-xs text-blue-200 mt-1">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.2em] text-blue-300/70 font-semibold">
            Main Menu
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `
                    group relative flex items-center gap-3
                    px-4 py-3 rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                        : "text-blue-100/80 hover:bg-white/10 hover:text-white"
                    }
                    `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-300" />
                      )}

                      <Icon
                        size={19}
                        strokeWidth={isActive ? 2.5 : 2}
                      />

                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-5">
          <div className="border-t border-white/10 pt-4">
            <button
              onClick={logout}
              className="
                w-full flex items-center gap-3
                px-4 py-3 rounded-xl
                text-sm font-medium
                text-blue-100/80
                hover:bg-red-500/15
                hover:text-red-300
                transition-all duration-200
              "
            >
              <LogOut size={19} />
              Logout
            </button>
          </div>

          <div className="mt-5 text-center">
            <p className="text-[10px] text-blue-300/60">
              Same Campus • Bigger Dreams
            </p>

            <p className="text-[9px] text-blue-300/40 mt-1">
              Workshop Administration
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;