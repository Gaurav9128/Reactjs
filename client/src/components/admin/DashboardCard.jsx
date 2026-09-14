import {
  Users,
  CalendarCheck,
  CalendarDays,
  FileText,
  TrendingUp,
} from "lucide-react";

const DashboardCard = ({ title, value }) => {
  const cardConfig = {
    Students: {
      icon: Users,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      description: "Registered participants",
    },

    Attendance: {
      icon: CalendarCheck,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      description: "Total check-ins so far",
    },

    "Working Days": {
      icon: CalendarDays,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      description: "Days completed",
    },

    Reports: {
      icon: FileText,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      description: "All reports up to date",
    },
  };

  const config = cardConfig[title] || {
    icon: TrendingUp,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    description: "",
  };

  const Icon = config.icon;

  return (
    <div
      className="
        group relative overflow-hidden
        bg-white
        border border-slate-100
        rounded-2xl
        p-5
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-0.5
        transition-all duration-300
      "
    >
      {/* Decorative background */}
      <div
        className="
          absolute -right-8 -top-8
          w-24 h-24
          rounded-full
          bg-slate-50
          group-hover:scale-125
          transition-transform duration-500
        "
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div
          className={`
            w-16 h-16
            rounded-2xl
            ${config.iconBg}
            ${config.iconColor}
            flex items-center justify-center
            shrink-0
          `}
        >
          <Icon size={29} strokeWidth={2.2} />
        </div>

        {/* Content */}
        <div className="min-w-0 pt-1">
          <p className="text-sm font-medium text-slate-500">
            Total {title}
          </p>

          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-3xl font-bold text-[#101b4b] tracking-tight">
              {value}
            </h3>

            {title === "Students" && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                ↑ 12%
              </span>
            )}

            {title === "Attendance" && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                ↑ 8%
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;