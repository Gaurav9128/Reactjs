export const fieldControlClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition";

const Field = ({ label, hint, required, children, className = "" }) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-navy mb-1.5">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>

      {children}

      {hint && <p className="text-xs text-slate-400 mt-1">{hint}</p>}
    </div>
  );
};

export default Field;