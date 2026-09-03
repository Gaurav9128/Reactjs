
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// Backend URL from Vite environment variable
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle admin login
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!formData.email.trim() || !formData.password) {
      Swal.fire({
        icon: "warning",
        title: "Required Fields",
        text: "Please enter your email and password.",
      });

      return;
    }

    // Check environment variable
    if (!backendUrl) {
      console.error("VITE_BACKEND_URL is not configured.");

      Swal.fire({
        icon: "error",
        title: "Configuration Error",
        text: "Backend URL is not configured. Please contact the administrator.",
      });

      return;
    }

    try {
      setLoading(true);

      // Remove trailing slash from backend URL
      const baseURL = backendUrl.replace(/\/$/, "");

      // Admin login API
      const loginURL = `${baseURL}/api/admin/login`;

      console.log("Admin Login API:", loginURL);

      const response = await axios.post(
        loginURL,
        {
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      console.log("Login Response:", response.data);

      // Store admin details
      if (response.data?.admin) {
        localStorage.setItem(
          "admin",
          JSON.stringify(response.data.admin)
        );
      }

      // Store JWT token
      if (response.data?.token) {
        localStorage.setItem(
          "adminToken",
          response.data.token
        );
      }

      // Success message
      await Swal.fire({
        icon: "success",
        title: "Login Successful",
        text: "Welcome to Admin Dashboard!",
        showConfirmButton: false,
        timer: 1500,
      });

      // Redirect to admin dashboard
      navigate("/admin/dashboard");

    } catch (error) {
      console.error("Admin Login Error:", error);

      let errorMessage = "Unable to connect to the server.";

      // Backend returned a response
      if (error.response) {
        console.error(
          "Server Response:",
          error.response.data
        );

        console.error(
          "Status Code:",
          error.response.status
        );

        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Invalid email or password.";
      }

      // Request sent but server did not respond
      else if (error.request) {
        console.error(
          "No response received from server."
        );

        errorMessage =
          "Server is not responding. Please try again later.";
      }

      // Request setup error
      else {
        console.error(
          "Request Error:",
          error.message
        );

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
