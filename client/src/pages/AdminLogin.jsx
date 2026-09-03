import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "https://react-js-workshop-bboq.vercel.app";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please enter your email and password.",
      });

      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_URL}/api/admin/login`,
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Login Response:", res.data);

      // Store admin information
      if (res.data.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(res.data.admin)
        );
      }

      // Store JWT token
      if (res.data.token) {
        localStorage.setItem(
          "adminToken",
          res.data.token
        );
      }

      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome to Admin Dashboard!",
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/admin/dashboard");

    } catch (err) {
      console.error("Admin Login Error:", err);

      let errorMessage = "Unable to connect to the server.";

      if (err.response) {
        errorMessage =
          err.response.data?.message ||
          "Invalid email or password.";
      } else if (err.request) {
        errorMessage =
          "Server is not responding. Please try again later.";
      } else {
        errorMessage =
          "Something went wrong. Please try again.";
      }

      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 px-4">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-[400px]"
      >

        {/* Heading */}
        <h2 className="text-3xl font-bold mb-2 text-center">
          Admin Login
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Login to access the admin dashboard
        </p>

        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="email"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoComplete="current-password"
            required
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded-lg text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

    </div>
  );
};

export default AdminLogin;