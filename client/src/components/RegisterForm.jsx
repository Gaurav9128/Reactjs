import { motion } from "framer-motion";
import logo from "../assets/logo1.png";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {

     const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [college, setCollege] = useState("");
    const [branch, setBranch] = useState("");
    const [year, setYear] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [laptop, setLaptop] = useState("");
    const [loading, setLoading] = useState(false);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [agree, setAgree] = useState(false);

    const handleEmailChange = (e) => {
        const value = e.target.value.trim().toLowerCase();
        setEmail(value);

        if (value === "") {
            setEmailError("");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@poornima\.edu\.in$/;

        if (!emailRegex.test(value)) {
            setEmailError(
                "Only @poornima.edu.in email addresses are allowed."
            );
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (
            !fullName ||
            !mobile ||
            !email ||
            !college ||
            !branch ||
            !year ||
            !password ||
            !confirmPassword ||
            !laptop
        ) {
            alert("Please fill all fields.");
            return;
        }

        if (!agree) {
            alert("Please accept Terms & Conditions.");
            return;
        }

        if (mobile.length !== 10) {
            alert("Mobile Number should be 10 digits.");
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@poornima\.edu\.in$/;

        if (!emailRegex.test(email)) {
            setEmailError("Only @poornima.edu.in email addresses are allowed.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Password & Confirm Password do not match.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:5000/api/register",
                {
                    fullName,
                    mobile,
                    email,
                    college,
                    branch,
                    year,
                    password,
                    laptop,
                }
            );

            Swal.fire({
                icon: "success",
                title: "Registration Successful 🎉",
                text: response.data.message,
                confirmButtonColor: "#06b6d4",
            });

            // Reset Form
            setFullName("");
            setMobile("");
            setEmail("");
            setCollege("");
            setBranch("");
            setYear("");
            setPassword("");
            setConfirmPassword("");
            setLaptop("");
            setAgree(false);

        } catch (err) {

            Swal.fire({
                icon: "error",
                title: "Registration Failed",
                text: err.response?.data?.message || "Something went wrong",
                confirmButtonColor: "#ef4444",
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
                className="w-full max-w-6xl rounded-3xl border border-cyan-400/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
                <div className="grid lg:grid-cols-2">

                    {/* Left Side */}
                    <div
                        className="
    hidden lg:flex
    flex-col
    justify-center
    items-center
    bg-gradient-to-br
    from-white
    via-sky-100
    to-blue-200
    p-10
    relative
    overflow-hidden
  "
                    >

                        <img
                            src={logo}
                            alt="logo"
                            className="w-100 mb-8 z-10"
                        />

                        <h1 className="text-4xl font-bold text-pink-500 text-center z-10">
                            React Rajasthan
                        </h1>

                        <p className="text-black-300 mt-3 text-center z-10">
                            Event Registration Portal
                        </p>

                        <div className="absolute w-72 h-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
                    </div>

                    {/* Right Side */}
                    <div className="p-8 lg:p-10">

                        <h2 className="text-3xl font-bold text-white">
                            Register Now 🚀
                        </h2>

                        <p className="text-gray-400 mt-2 mb-8">
                            Join React Rajasthan Workshop and level up your React skills.
                        </p>

                        <form className="space-y-5" onSubmit={handleSubmit}>

                            {/* Name & Mobile */}

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Full Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Enter your name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Mobile Number
                                    </label>

                                    <input
                                        type="tel"
                                        placeholder="9876543210"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                            </div>

                            {/* Email & College */}

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Email Address
                                    </label>

                                    <input
                                        type="email"
                                        placeholder="example@poornima.edu.in"
                                        value={email}
                                        onChange={handleEmailChange}
                                        className={`w-full bg-white/10 border rounded-xl px-4 py-3 text-white placeholder:text-gray-500 outline-none transition ${emailError
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-white/10 focus:border-cyan-400"
                                            }`}
                                    />

                                    {emailError && (
                                        <p className="text-red-400 text-sm mt-2">
                                            {emailError}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        College Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Your College"
                                        value={college}
                                        onChange={(e) => setCollege(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                            </div>

                            {/* Branch & Year */}

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <label className="text-sm text-gray-500 mb-2 block">
                                        Branch
                                    </label>

                                    <select
                                        value={branch}
                                        onChange={(e) => setBranch(e.target.value)}
                                        className="w-full bg-black/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    >
                                        <option value="">Select Branch</option>
                                        <option value="BCA">BCA</option>
                                        <option value="BTECH">BTECH</option>
                                        <option value="MCA">MCA</option>
                                    </select>

                                    {/* <input
                    type="text"
                    placeholder="CSE / IT / MCA"
                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition"
                  /> */}
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Semester
                                    </label>

                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full bg-black/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    >
                                        <option value="">Select Semester</option>
                                        <option value="1st Semester">1st Semester</option>
                                        <option value="3rd Semester">3rd Semester</option>
                                        <option value="5th Semester">5th Semester</option>
                                    </select>
                                </div>

                            </div>

                            {/* Password */}

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm text-gray-300 mb-2 block">
                                        Confirm Password
                                    </label>

                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 outline-none focus:border-cyan-400 transition"
                                    />
                                </div>

                            </div>

                            {/* Laptop */}

                            <div>
                                <label className="text-sm text-gray-300 mb-2 block">
                                    Do you have a Laptop?
                                </label>

                                <select
                                    value={laptop}
                                    onChange={(e) => setLaptop(e.target.value)}
                                    className="w-full bg-black/10 border border-white/10 rounded-xl px-4 py-3 text-white"
                                >
                                    <option value="">Select</option>
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>

                            {/* Terms */}

                            <label className="flex items-center gap-3 text-gray-300 text-sm">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                    className="accent-cyan-500 w-4 h-4"
                                />
                                I agree to the Terms & Conditions
                            </label>

                            {/* Button */}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl text-white font-semibold text-lg transition duration-300
    ${loading
                                        ? "bg-gray-600 cursor-not-allowed"
                                        : "bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/40"
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex justify-center items-center gap-2">
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            ></circle>

                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8H4z"
                                            ></path>
                                        </svg>

                                        Registering...
                                    </div>
                                ) : (
                                    "Register Now 🚀"
                                )}
                            </button>
                            <p className="text-center text-gray-400 mt-6">
                                Already have an account?{" "}
                                <span
                                    onClick={() => navigate("/login")}
                                    className="text-cyan-400 cursor-pointer hover:underline"
                                >
                                    Login
                                </span>
                            </p>

                        </form>

                    </div>

                </div>
            </motion.div>
        </section>
    );
};

export default RegisterForm;