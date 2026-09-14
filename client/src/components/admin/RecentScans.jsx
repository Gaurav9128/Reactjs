import { useEffect, useState } from "react";
import { Activity, Calendar, Clock } from "lucide-react";
import adminApi from "../../utils/adminApi";
import { SectionCard, Avatar, StatusBadge, EmptyState } from "../ui";

const RecentScans = () => {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    let active = true;

    const fetchScans = () =>
      adminApi
        .get("/api/recent-scans")
        .then((res) => {
          if (active) setScans(res.data.scans || []);
        })
        .catch((err) => console.log(err));

    fetchScans();

    const interval = setInterval(fetchScans, 3000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <SectionCard
      icon={Activity}
      title="Recent Activity"
      description="Latest ticket scans"
      actions={
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live · 3 sec refresh
        </span>
      }
    >
      {scans.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No Recent Activity"
          description="Recent ticket scans will appear here."
        />
      ) : (
        <div className="space-y-3">
          {scans.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4 border border-slate-100 rounded-xl p-3.5 hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={item.student?.fullName} size={36} />

                <div className="min-w-0">
                  <h3 className="font-semibold text-navy text-sm truncate">
                    {item.student?.fullName}
                  </h3>

                  <p className="text-xs text-slate-400 truncate">
                    {item.student?.college}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400">
                  <Calendar size={14} />
                  Day {item.dayNumber}
                </div>

                <div className="hidden md:flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={14} />
                  {new Date(item.time).toLocaleTimeString()}
                </div>

                <StatusBadge
                  status={item.action}
                  tone={item.action === "RETURNED" ? "blue" : undefined}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
};

export default RecentScans;