const toneStyles = {
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-rose-50 text-rose-700",
  orange: "bg-amber-50 text-amber-700",
  blue: "bg-blue-50 text-blue-700",
  gray: "bg-slate-100 text-slate-600",
  purple: "bg-purple-50 text-purple-700",
};

const dotStyles = {
  green: "bg-emerald-500",
  red: "bg-rose-500",
  orange: "bg-amber-500",
  blue: "bg-blue-500",
  gray: "bg-slate-400",
  purple: "bg-purple-500",
};

const statusToneMap = {
  PRESENT: "green",
  ABSENT: "red",
  COMPLETED: "green",
  PENDING: "orange",
  REJECTED: "red",
  ENABLED: "blue",
  ACTIVE: "green",
  INACTIVE: "gray",
  OUT: "orange",
  RETURNED: "blue",
  ENTRY: "green",
  BREAK_OUT: "orange",
  TIMEOUT: "red",
  CANCELLED: "red",
  APPROVED: "green",
};

const StatusBadge = ({ status, showDot = true, tone: toneOverride, className = "" }) => {
  const normalized = String(status || "").toUpperCase();
  const tone = toneOverride || statusToneMap[normalized] || "gray";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        rounded-full px-3 py-1 text-xs font-semibold capitalize
        ${toneStyles[tone]} ${className}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[tone]}`} />
      )}
      {status}
    </span>
  );
};

export default StatusBadge;