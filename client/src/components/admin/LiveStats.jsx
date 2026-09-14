import { useEffect, useState } from "react";
import {
  UserCheck,
  Building2,
  Coffee,
  RotateCcw,
  AlertTriangle,
  Ban,
} from "lucide-react";
import adminApi from "../../utils/adminApi";
import { StatCard } from "../ui";

const LiveStats = () => {
  const [stats, setStats] = useState({
    present: 0,
    inside: 0,
    onBreak: 0,
    returned: 0,
    timeout: 0,
    cancelled: 0,
  });

  useEffect(() => {
    let active = true;

    const fetchStats = () =>
      adminApi
        .get("/api/dashboard/live-stats")
        .then((res) => {
          if (active) setStats(res.data.stats);
        })
        .catch((err) => console.log(err));

    fetchStats();

    const interval = setInterval(fetchStats, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  const cards = [
    {
      label: "Present",
      value: stats.present,
      icon: UserCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inside Hall",
      value: stats.inside,
      icon: Building2,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      label: "On Break",
      value: stats.onBreak,
      icon: Coffee,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      label: "Returned",
      value: stats.returned,
      icon: RotateCcw,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      label: "Timeout",
      value: stats.timeout,
      icon: AlertTriangle,
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
    {
      label: "Cancelled",
      value: stats.cancelled,
      icon: Ban,
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
    },
  ];

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 lg:gap-5 mb-6">
      {cards.map((card) => (
        <StatCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          iconBg={card.iconBg}
          iconColor={card.iconColor}
        />
      ))}
    </section>
  );
};

export default LiveStats;