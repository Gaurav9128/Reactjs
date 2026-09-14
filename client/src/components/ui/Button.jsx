import { Loader2 } from "lucide-react";

const sizeClasses = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-4 py-2.5 text-sm gap-2",
  lg: "px-5 py-3 text-sm gap-2",
};

const variantClasses = {
  primary:
    "bg-primary-blue text-white hover:bg-blue-700 focus-visible:ring-blue-300 shadow-sm shadow-blue-200",
  secondary:
    "bg-white text-navy border border-slate-200 hover:bg-slate-50 hover:border-slate-300 focus-visible:ring-slate-300",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300 shadow-sm shadow-rose-200",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-300 shadow-sm shadow-emerald-200",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-300",
};

const Button = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  children,
  className = "",
  disabled,
  ...rest
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center rounded-lg
        font-semibold transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
        ${variantClasses[variant]} ${sizeClasses[size]} ${className}
      `}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2.2} />
      )}
      {children}
    </button>
  );
};

export default Button;