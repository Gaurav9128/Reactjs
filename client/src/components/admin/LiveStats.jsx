import { useEffect, useState } from "react";
import axios from "axios";
import {
  Users,
  Building2,
  Coffee,
  RotateCcw,
  AlertTriangle,
  Ban,
} from "lucide-react";

const LiveStats = () => {

  const [stats, setStats] = useState({
    present: 0,
    inside: 0,
    onBreak: 0,
    returned: 0,
    timeout: 0,
    cancelled: 0,
  });

  const loadStats = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/dashboard/live-stats"
      );

      setStats(res.data.stats);

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadStats();

    const interval = setInterval(loadStats, 3000);

    return () => clearInterval(interval);

  }, []);

  const cards = [
    {
      title: "Present",
      value: stats.present,
      icon: <Users size={26} />,
      bg: "bg-green-100",
      text: "text-green-700",
    },
    {
      title: "Inside Hall",
      value: stats.inside,
      icon: <Building2 size={26} />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      title: "On Break",
      value: stats.onBreak,
      icon: <Coffee size={26} />,
      bg: "bg-orange-100",
      text: "text-orange-700",
    },
    {
      title: "Returned",
      value: stats.returned,
      icon: <RotateCcw size={26} />,
      bg: "bg-purple-100",
      text: "text-purple-700",
    },
    {
      title: "Timeout",
      value: stats.timeout,
      icon: <AlertTriangle size={26} />,
      bg: "bg-red-100",
      text: "text-red-700",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: <Ban size={26} />,
      bg: "bg-gray-100",
      text: "text-gray-700",
    },
  ];

  return (
    <div className="grid lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2 gap-5 mb-8">

      {cards.map((card, index) => (

        <div
          key={index}
          className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition"
        >

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg} ${card.text}`}
          >
            {card.icon}
          </div>

          <h3 className="text-gray-500 mt-4 text-sm">
            {card.title}
          </h3>

          <h1 className="text-3xl font-bold mt-2">
            {card.value}
          </h1>

        </div>

      ))}

    </div>
  );
};

export default LiveStats;