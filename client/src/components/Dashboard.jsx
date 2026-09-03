import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Ticket,
  Calendar,
  LogOut,
  User,
  Coffee,
  CheckCircle,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
         `${import.meta.env.VITE_API_URL}/api/dashboard/student`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDashboard(res.data);

    } catch (err) {
      console.log(err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/login");
      }

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-2xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  if (!dashboard) {
    return <Navigate to="/login" replace />;
  }

  const student = dashboard.student;
  const stats = dashboard.dashboard;

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* Header */}

      <div className="bg-gradient-to-r from-cyan-600 to-blue-700 text-white p-10">

        <h1 className="text-4xl font-bold">
          Welcome, {student.fullName} 👋
        </h1>

        <p className="mt-2">
          React Rajasthan Student Dashboard
        </p>

      </div>

      <div className="max-w-7xl mx-auto p-8">

        {/* Student Info */}

        <div className="bg-white rounded-2xl shadow p-6 mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Student Information
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            <p>
              <strong>Name :</strong> {student.fullName}
            </p>

            <p>
              <strong>Email :</strong> {student.email}
            </p>

            <p>
              <strong>College :</strong> {student.college}
            </p>

            <p>
              <strong>Branch :</strong> {student.branch}
            </p>

          </div>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">

            <Ticket size={40} className="text-blue-600 mb-2" />

            <h3>Total Tickets</h3>

            <h1 className="text-4xl font-bold">
              {stats.totalTickets}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <CheckCircle
              size={40}
              className="text-green-600 mb-2"
            />

            <h3>Attendance</h3>

            <h1 className="text-4xl font-bold">
              {stats.attendance}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <Coffee
              size={40}
              className="text-orange-500 mb-2"
            />

            <h3>Break Status</h3>

            <h1 className="text-xl font-bold">
              {stats.breakStatus}
            </h1>

          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <Calendar
              size={40}
              className="text-purple-600 mb-2"
            />

            <h3>Current Day</h3>

            <h1 className="text-4xl font-bold">
              {stats.currentDay}
            </h1>

          </div>

        </div>

        {/* Quick Actions */}

        <div className="grid md:grid-cols-3 gap-6 mt-10">

          <button
            onClick={() => navigate("/my-tickets")}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-6"
          >
            🎟 My Tickets
          </button>

          <button
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl p-6"
          >
            👤 My Profile
          </button>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl p-6"
          >
            🚪 Logout
          </button>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;