import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/reset-password`,
        formData
      );

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      navigate("/login");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Reset Password
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Registered email"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter OTP"
          className="border p-3 rounded w-full mb-4"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New password"
          className="border p-3 rounded w-full mb-6"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded w-full"
        >
          Reset Password
        </button>

      </form>

    </div>
  );
};

export default ResetPassword;
