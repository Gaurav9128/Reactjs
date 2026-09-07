import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AdminRegister = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "SUB_ADMIN",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/register`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "You can now login with your credentials.",
      });

      navigate("/admin/login");

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Registration Failed",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Registration
        </h2>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
          required
        />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="border p-3 rounded w-full mb-6"
        >
          <option value="SUB_ADMIN">SUB_ADMIN</option>
          <option value="SUPER_ADMIN">SUPER_ADMIN</option>
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded w-full"
        >
          Register
        </button>

      </form>

    </div>
  );
};

export default AdminRegister;