import { useState, useEffect, useRef } from "react";
import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import logo from "../assets/logo1.png";

/* =========================================================
   INLINE SVG ICONS
   No additional icon package required.
========================================================= */

const Icon = ({ name, size = 20, strokeWidth = 1.8 }) => {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons = {
    home: (
      <>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </>
    ),

    speakers: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.5-3.4 2.4-5.5 5.5-5.5s5 2.1 5.5 5.5" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8" />
        <path d="M17 14.5c2.1.7 3.4 2.4 3.7 5.5" />
      </>
    ),

    sponsors: (
      <>
        <path d="M8 3h8l1 5H7l1-5Z" />
        <path d="M7 8h10l-1 4a4 4 0 0 1-3 2.8V21h-2v-6.2A4 4 0 0 1 8 12L7 8Z" />
        <path d="M5 21h14" />
      </>
    ),

    venue: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),

    organizers: (
      <>
        <circle cx="9" cy="8" r="3" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M3.5 20c.5-3.4 2.4-5.5 5.5-5.5s5 2.1 5.5 5.5" />
        <path d="M14 15c2.9.2 4.9 2 5.5 5" />
      </>
    ),

    calendar: (
      <>
        <rect x="3" y="4.5" width="18" height="17" rx="2" />
        <path d="M8 2v5M16 2v5M3 10h18" />
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M4.5 21c.6-4 3.1-6.5 7.5-6.5s6.9 2.5 7.5 6.5" />
      </>
    ),

    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    logout: (
      <>
        <path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5" />
        <path d="M14 16l4-4-4-4" />
        <path d="M18 12H8" />
      </>
    ),

    chevron: (
      <path d="m7 10 5 5 5-5" />
    ),

    menu: (
      <>
        <path d="M4 6h16" />
        <path d="M4 12h16" />
        <path d="M4 18h16" />
      </>
    ),

    close: (
      <>
        <path d="M6 6l12 12" />
        <path d="M18 6 6 18" />
      </>
    ),
  };

  return <svg {...common}>{icons[name]}</svg>;
};

/* =========================================================
   NAVBAR
========================================================= */

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  /* =======================================================
     HIDDEN ADMIN ACCESS
  ======================================================= */

  const clickCount = useRef(0);
  const timer = useRef(null);
  const singleClickTimer = useRef(null);

  /* =======================================================
     DROPDOWN REF
  ======================================================= */

  const dropdownRef = useRef(null);
  const headerRef = useRef(null);

  /* =======================================================
     SYNC USER FROM LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem("user");

        const loggedInUser = storedUser
          ? JSON.parse(storedUser)
          : null;

        setUser(loggedInUser);
      } catch (error) {
        console.error("Failed to read user:", error);
        setUser(null);
      }
    };

    updateUser();

    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, [location.pathname]);

  /* =======================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setShowDropdown(false);
      }

      if (
        headerRef.current &&
        !headerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =======================================================
     CLOSE MENUS ON ESCAPE
  ======================================================= */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowDropdown(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /* =======================================================
     CLOSE MOBILE MENU ON ROUTE CHANGE
  ======================================================= */

  useEffect(() => {
    requestAnimationFrame(() => {
      setOpen(false);
      setShowDropdown(false);
    });
  }, [location.pathname]);

  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("storage"));

    setUser(null);
    setShowDropdown(false);
    setOpen(false);

    navigate("/login");
  };

  /* =======================================================
     HIDDEN LOGO CLICK
     
     Single click -> Home
     Five clicks -> Admin Login
  ======================================================= */

  const handleLogoClick = () => {
    clickCount.current++;

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      clickCount.current = 0;
    }, 2000);

    /* Single click -> Home */

    if (clickCount.current === 1) {
      singleClickTimer.current = setTimeout(() => {
        if (clickCount.current === 1) {
          navigate("/");
          clickCount.current = 0;
        }
      }, 300);
    }

    /* Five clicks -> Admin Login */

    if (clickCount.current >= 5) {
      clearTimeout(singleClickTimer.current);
      clearTimeout(timer.current);

      clickCount.current = 0;

      navigate("/admin/login");
    }
  };

  /* =======================================================
     NAVIGATION LINKS
  ======================================================= */

  const navLinks = [
    {
      name: "Home",
      path: "/",
      icon: "home",
    },
    {
      name: "Speakers",
      path: "/speakers",
      icon: "speakers",
    },
    {
      name: "Sponsors",
      path: "/sponsors",
      icon: "sponsors",
    },
    {
      name: "Venue",
      path: "/venue",
      icon: "venue",
    },
    {
      name: "Organizers",
      path: "/organizers",
      icon: "organizers",
    },
    {
      name: "Workshop Schedule",
      path: "/workshop-schedule",
      icon: "calendar",
    },
  ];

  /* =======================================================
     ACTIVE ROUTE
  ======================================================= */

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  /* =======================================================
     USER INITIALS
  ======================================================= */

  const getInitials = () => {
    if (!user?.fullName) {
      return "U";
    }

    const parts = user.fullName
      .trim()
      .split(" ")
      .filter(Boolean);

    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }

    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  /* =======================================================
     USER NAME
  ======================================================= */

  const userName = user?.fullName || "Student";

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md"
    >

      {/* ===================================================
          DESKTOP / MAIN NAVBAR
      =================================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-[78px] items-center justify-between gap-5">

          {/* =================================================
              LOGO
          ================================================= */}

          <div className="flex shrink-0 items-center">

            <button
              type="button"
              onClick={handleLogoClick}
              className="group flex items-center outline-none"
              aria-label="Poornima University"
            >
              <img
                src={logo}
                alt="Poornima University"
                className="h-[55px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.01] sm:h-[61px]"
              />
            </button>

          </div>

          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden items-center gap-1 lg:flex">

            {navLinks.map((item) => {
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group relative flex items-center gap-2 rounded-lg px-3 py-3 text-[14px] font-semibold transition-all duration-200 xl:px-3.5 ${
                    active
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-blue-600"
                  }`}
                >

                  <Icon
                    name={item.icon}
                    size={19}
                    strokeWidth={active ? 2.1 : 1.8}
                  />

                  <span className="whitespace-nowrap">
                    {item.name}
                  </span>

                  {/* Active indicator */}

                  <span
                    className={`absolute bottom-0 left-3 right-3 h-[2.5px] rounded-full bg-blue-600 transition-all duration-200 ${
                      active
                        ? "scale-x-100 opacity-100"
                        : "scale-x-0 opacity-0"
                    }`}
                  />

                </Link>
              );
            })}

          </nav>

          {/* =================================================
              DESKTOP USER AREA
          ================================================= */}

          <div
            className="relative hidden shrink-0 lg:block"
            ref={dropdownRef}
          >

            {user ? (
              <>

                <button
                  type="button"
                  onClick={() =>
                    setShowDropdown(!showDropdown)
                  }
                  aria-haspopup="menu"
                  aria-expanded={showDropdown}
                  aria-label="Account menu"
                  className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition-colors duration-200 hover:bg-slate-50"
                >

                  {/* Avatar */}

                  {user.profilePicture ? (
                    <img
                      src={user.profilePicture}
                      alt={userName}
                      className="h-10 w-10 rounded-full border-2 border-white object-cover shadow-sm ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-sm">
                      {getInitials()}
                    </div>
                  )}

                  {/* User information */}

                  <div className="hidden text-left xl:block">
                    <p className="max-w-[130px] truncate text-sm font-bold leading-5 text-[#0b1935]">
                      {userName}
                    </p>

                    <p className="text-xs font-medium text-slate-500">
                      Student
                    </p>
                  </div>

                  {/* Chevron */}

                  <span
                    className={`text-slate-500 transition-transform duration-200 ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  >
                    <Icon
                      name="chevron"
                      size={18}
                    />
                  </span>

                </button>

                {/* =================================================
                    DROPDOWN
                ================================================= */}

                {showDropdown && (
                  <div className="absolute right-0 top-[58px] w-60 overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-[0_15px_45px_rgba(15,23,42,0.14)]">

                    {/* User Header */}

                    <div className="mb-1 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">

                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={userName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                          {getInitials()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-[#0b1935]">
                          {userName}
                        </p>

                        <p className="text-xs text-slate-500">
                          Student
                        </p>
                      </div>

                    </div>

                    {/* Dashboard */}

                    <button
                      type="button"
                      onClick={() => {
                        navigate("/dashboard");
                        setShowDropdown(false);
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Icon
                        name="dashboard"
                        size={18}
                      />

                      Dashboard
                    </button>

                    {/* Logout */}

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-500 transition hover:bg-red-50"
                    >
                      <Icon
                        name="logout"
                        size={18}
                      />

                      Logout
                    </button>

                  </div>
                )}

              </>
            ) : (

              /* =================================================
                 SIGN IN
              ================================================= */

              <button
                type="button"
                onClick={() => navigate("/login")}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md"
              >
                Sign In
              </button>

            )}

          </div>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 lg:hidden"
            aria-label={
              open ? "Close navigation" : "Open navigation"
            }
            aria-expanded={open}
          >
            <Icon
              name={open ? "close" : "menu"}
              size={25}
              strokeWidth={1.8}
            />
          </button>

        </div>
      </div>

      {/* =====================================================
          SUBTLE BOTTOM ACCENT
      ===================================================== */}

      <div className="h-[2px] bg-blue-600" />

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {open && (
        <div className="border-b border-slate-100 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] lg:hidden">

          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            {/* =================================================
                MOBILE NAV LINKS
            ================================================= */}

            <nav className="space-y-1">

              {navLinks.map((item) => {
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition ${
                      active
                        ? "bg-blue-50 text-blue-600"
                        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
                    }`}
                  >
                    <Icon
                      name={item.icon}
                      size={20}
                    />

                    {item.name}
                  </Link>
                );
              })}

            </nav>

            {/* =================================================
                MOBILE ACCOUNT AREA
            ================================================= */}

            <div className="mt-4 border-t border-slate-100 pt-4">

              {user ? (
                <>

                  {/* User */}

                  <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                    {user.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={userName}
                        className="h-11 w-11 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                        {getInitials()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#0b1935]">
                        {userName}
                      </p>

                      <p className="text-xs font-medium text-slate-500">
                        Student
                      </p>
                    </div>

                  </div>

                  {/* Dashboard */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/dashboard");
                      setOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl bg-blue-50 px-4 py-3.5 text-sm font-bold text-blue-600 transition hover:bg-blue-100"
                  >
                    <Icon
                      name="dashboard"
                      size={19}
                    />

                    Dashboard
                  </button>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-xl bg-red-50 px-4 py-3.5 text-sm font-bold text-red-500 transition hover:bg-red-100"
                  >
                    <Icon
                      name="logout"
                      size={19}
                    />

                    Logout
                  </button>

                </>
              ) : (

                /* Sign In */

                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                    setOpen(false);
                  }}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                >
                  Sign In
                </button>

              )}

            </div>

          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;