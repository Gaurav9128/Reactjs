import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        formData
      );

      localStorage.setItem("admin", JSON.stringify(res.data.admin));
      localStorage.setItem("adminToken", res.data.token);

      Swal.fire({
        icon: "success",
        title: "Login Successful",
      });

      navigate("/admin/dashboard");

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Login Failed",
      });

    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-3 rounded w-full mb-6"
          onChange={handleChange}
        />

        <button
          className="bg-blue-600 text-white p-3 rounded w-full"
        >
          Login
        </button>

      </form>

    </div>
  );
};

export default AdminLogin;