import React, { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";
import logo from "../assets/logo1.png";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Hidden Admin Access
    const clickCount = useRef(0);
    const timer = useRef(null);
    const singleClickTimer = useRef(null);

    // Dropdown Ref
    const dropdownRef = useRef(null);

    // ==========================
    // Sync User From LocalStorage
    // ==========================
    useEffect(() => {
        const updateUser = () => {
            const loggedInUser = JSON.parse(
                localStorage.getItem("user")
            );

            setUser(loggedInUser);
        };

        updateUser();

        window.addEventListener("storage", updateUser);

        return () => {
            window.removeEventListener("storage", updateUser);
        };
    }, [location.pathname]);

    // ==========================
    // Close Dropdown Outside Click
    // ==========================
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
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

    // ==========================
    // Logout
    // ==========================
    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        window.dispatchEvent(new Event("storage"));

        setUser(null);
        setShowDropdown(false);

        navigate("/login");
    };

    // ==========================
    // Hidden Logo Click
    // ==========================
    const handleLogoClick = () => {
        clickCount.current++;

        if (timer.current) {
            clearTimeout(timer.current);
        }

        timer.current = setTimeout(() => {
            clickCount.current = 0;
        }, 2000);

        // Single Click -> Home
        if (clickCount.current === 1) {
            singleClickTimer.current = setTimeout(() => {
                if (clickCount.current === 1) {
                    navigate("/");
                    clickCount.current = 0;
                }
            }, 300);
        }

        // Five Click -> Admin Login
        if (clickCount.current >= 5) {
            clearTimeout(singleClickTimer.current);
            clearTimeout(timer.current);

            clickCount.current = 0;

            navigate("/admin/login");

            // OR
            // window.location.href="http://localhost:5174/admin/login";
        }
    };

    const navLinks = [
        {
            name: "Speakers",
            path: "/speakers",
        },
        {
            name: "Sponsors",
            path: "/sponsors",
        },
        {
            name: "Venue",
            path: "/venue",
        },
        {
            name: "Organizers",
            path: "/organizers",
        },
        {
            name: "Workshop Schedule",
            path: "/workshop-schedule",
        },
    ];

    return (
        <>
            <header className="w-full bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <div className="flex items-center justify-between h-24">

                        {/* Logo */}
                        <img
                            src={logo}
                            alt="Poornima University"
                            className="h-18 w-auto cursor-pointer"
                            onClick={handleLogoClick}
                        />

                        {/* Desktop Menu */}
                        <nav className="hidden lg:flex items-center gap-14">

                            {navLinks.map((item, index) => (

                                <Link
                                    key={index}
                                    to={item.path}
                                    className="text-gray-800 font-medium text-xl hover:text-blue-500 transition"
                                >
                                    {item.name}
                                </Link>

                            ))}

                        </nav>

                        {/* Desktop Button */}
                        <div
                            className="hidden lg:block relative"
                            ref={dropdownRef}
                        >
                            {user ? (
                                <>
                                    <button
                                        onClick={() =>
                                            setShowDropdown(!showDropdown)
                                        }
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition flex items-center gap-2"
                                    >
                                        Dashboard

                                        <span
                                            className={`transition-transform duration-300 ${showDropdown ? "rotate-180" : ""
                                                }`}
                                        >
                                            ▼
                                        </span>
                                    </button>

                                    {showDropdown && (
                                        <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-2xl border overflow-hidden z-50">

                                            <button
                                                onClick={() => {
                                                    navigate("/dashboard");
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full text-left px-5 py-3 hover:bg-gray-100 transition flex items-center gap-3"
                                            >
                                                🏠 Dashboard
                                            </button>

                                            {/* <button
                                                onClick={() => {
                                                    navigate("/profile");
                                                    setShowDropdown(false);
                                                }}
                                                className="w-full text-left px-5 py-3 hover:bg-gray-100 transition flex items-center gap-3"
                                            >
                                                👤 My Profile
                                            </button> */}

                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                }}
                                                className="w-full text-left px-5 py-3 hover:bg-red-50 text-red-600 transition flex items-center gap-3"
                                            >
                                                🚪 Logout
                                            </button>

                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => navigate("/login")}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden"
                            onClick={() => setOpen(!open)}
                        >
                            {open ? <X size={30} /> : <Menu size={30} />}
                        </button>

                    </div>

                </div>

                {/* Bottom Border */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>

                {/* Mobile Menu */}
                {open && (

                    <div className="lg:hidden bg-white shadow-lg">

                        <div className="flex flex-col p-5 gap-4">

                            {navLinks.map((item, index) => (

                                <Link
                                    key={index}
                                    to={item.path}
                                    className="text-lg font-medium text-gray-700 hover:text-blue-500"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.name}
                                </Link>

                            ))}

                            {user ? (
                                <>
                                    <button
                                        onClick={() => {
                                            navigate("/dashboard");
                                            setOpen(false);
                                        }}
                                        className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg mt-3"
                                    >
                                        🏠 Dashboard
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setOpen(false);
                                        }}
                                        className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg"
                                    >
                                        👤 My Profile
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setOpen(false);
                                        }}
                                        className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg"
                                    >
                                        🚪 Logout
                                    </button>
                                </>
                            ) : (

                                <button
                                    onClick={() => {
                                        navigate("/login");
                                        setOpen(false);
                                    }}
                                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg mt-3"
                                >
                                    Sign In
                                </button>

                            )}

                        </div>

                    </div>

                )}

            </header>
        </>
    );
};

export default Navbar;