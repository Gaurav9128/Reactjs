import { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Calendar,
  Clock,
  LogIn,
  LogOut,
  RotateCcw,
} from "lucide-react";

const RecentScans = () => {
  const [scans, setScans] = useState([]);

  const loadScans = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/recent-scans`
      );

      setScans(res.data.scans || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadScans();

    const interval = setInterval(() => {
      loadScans();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getBadge = (action) => {
    switch (action) {
      case "ENTRY":
        return {
          text: "ENTRY",
          color: "bg-green-100 text-green-700",
          icon: <LogIn size={16} />,
        };

      case "BREAK_OUT":
        return {
          text: "BREAK OUT",
          color: "bg-orange-100 text-orange-700",
          icon: <LogOut size={16} />,
        };

      case "RETURNED":
        return {
          text: "RETURN",
          color: "bg-blue-100 text-blue-700",
          icon: <RotateCcw size={16} />,
        };

      case "TIMEOUT":
        return {
          text: "TIMEOUT",
          color: "bg-red-100 text-red-700",
          icon: <Clock size={16} />,
        };

      default:
        return {
          text: action,
          color: "bg-gray-100 text-gray-700",
          icon: <Clock size={16} />,
        };
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Recent Activity
        </h2>

        <span className="text-sm text-gray-500">
          Auto Refresh : 3 sec
        </span>
      </div>

      {scans.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No Recent Activity
        </div>
      ) : (
        <div className="space-y-4">

          {scans.map((item, index) => {

            const badge = getBadge(item.action);

            return (
              <div
                key={index}
                className="border rounded-2xl p-4 hover:bg-gray-50 transition flex justify-between items-center"
              >
                <div>

                  <div className="flex items-center gap-2">

                    <User
                      size={18}
                      className="text-blue-600"
                    />

                    <h3 className="font-semibold">
                      {item.student?.fullName}
                    </h3>

                  </div>

                  <p className="text-sm text-gray-500 mt-1">
                    {item.student?.college}
                  </p>

                  <div className="flex gap-4 mt-2 text-sm text-gray-500">

                    <div className="flex items-center gap-1">
                      <Calendar size={15} />
                      Day {item.dayNumber}
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock size={15} />
                      {new Date(item.time).toLocaleTimeString()}
                    </div>

                  </div>

                </div>

                <div>
                  <span
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${badge.color}`}
                  >
                    {badge.icon}
                    {badge.text}
                  </span>
                </div>

              </div>
            );

          })}

        </div>
      )}

    </div>
  );
};

export default RecentScans;