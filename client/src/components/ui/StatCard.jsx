const StatCard = ({
  icon: Icon,
  label,
  value,
  supporting,
  trend,
  iconBg = "bg-blue-50",
  iconColor = "text-primary-blue",
}) => {
  return (
    <div className="group relative overflow-hidden bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-slate-50 group-hover:scale-125 transition-transform duration-500" />

      <div className="relative flex items-start gap-4">
        <div
          className={`
            w-12 h-12 rounded-xl ${iconBg} ${iconColor}
            flex items-center justify-center shrink-0
          `}
        >
          <Icon size={22} strokeWidth={2.2} />
        </div>

        <div className="min-w-0 pt-0.5">
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <div className="flex items-center gap-2 mt-0.5">
            <h3 className="text-3xl font-bold text-navy tracking-tight">
              {value}
            </h3>

            {trend}
          </div>

          {supporting && (
            <p className="text-xs text-slate-400 mt-1">{supporting}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;