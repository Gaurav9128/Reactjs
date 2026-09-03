import { motion } from "framer-motion";
import logo from "../assets/logo1.png";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // ==========================
    // Clear Form Every Time
    // ==========================
    useEffect(() => {
        setEmail("");
        setPassword("");
        setShowPassword(false);
    }, []);

    // ==========================
    // If Already Logged In
    // ==========================
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/dashboard", {
                replace: true,
            });
        }
    }, [navigate]);

    // ==========================
    // Prevent Browser Back
    // ==========================
    useEffect(() => {
        window.history.pushState(null, "", window.location.href);

        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            Swal.fire({
                icon: "warning",
                title: "All fields are required",
            });
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem("token", response.data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            window.dispatchEvent(new Event("storage"));

            await Swal.fire({
                icon: "success",
                title: "Login Successful 🎉",
                text: response.data.message,
                timer: 1500,
                showConfirmButton: false,
            });

            // Clear Form
            setEmail("");
            setPassword("");

            navigate("/dashboard", {
                replace: true,
            });

        } catch (err) {

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text:
                    err.response?.data?.message ||
                    "Something went wrong",
            });

        } finally {

            setLoading(false);

        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-6 py-12 bg-[#050816]">

            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-5xl rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
            >

                <div className="grid lg:grid-cols-2">

                    {/* Left Side */}
                    <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-white via-sky-100 to-blue-200 p-10">

                        <img
                            src={logo}
                            alt="logo"
                            className="w-72 mb-8"
                        />

                        <h1 className="text-4xl font-bold text-pink-500">
                            React Rajasthan
                        </h1>

                        <p className="mt-3 text-gray-700">
                            Event Login Portal
                        </p>

                    </div>

                    {/* Right Side */}
                    <div className="p-10">

                        <h2 className="text-3xl font-bold text-white">
                            Welcome Back 👋
                        </h2>

                        <p className="text-gray-400 mt-2 mb-8">
                            Login to continue
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* Email */}
                            <div>

                                <label className="text-gray-300 block mb-2">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    placeholder="example@poornima.edu.in"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    autoComplete="off"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                                />

                            </div>

                            {/* Password */}
                            <div>

                                <label className="text-gray-300 block mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Enter Password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        autoComplete="new-password"
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-400 outline-none"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                        className="absolute right-4 top-4 text-gray-400"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>

                                </div>

                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl text-white font-semibold transition ${
                                    loading
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02]"
                                }`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center gap-2">

                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >

                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            />

                                        </svg>

                                        Logging in...

                                    </div>
                                ) : (
                                    "Login"
                                )}
                            </button>

                            <p className="text-center text-gray-400 mt-6">
                                Don't have an account?{" "}
                                <span
                                    onClick={() =>
                                        navigate("/register")
                                    }
                                    className="text-cyan-400 cursor-pointer hover:underline font-semibold"
                                >
                                    Register Now
                                </span>
                            </p>

                            <p className="text-center text-gray-500 text-sm mt-2">
                                First time using this portal? Please register before logging in.
                            </p>

                        </form>

                    </div>

                </div>

            </motion.div>

        </section>
    );
};

export default Login;