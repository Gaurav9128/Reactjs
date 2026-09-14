const SectionCard = ({
  title,
  description,
  icon: Icon,
  actions,
  children,
  className = "",
  bodyClassName = "",
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 ${className}`}
    >
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-start gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-xl bg-light-blue text-primary-blue flex items-center justify-center shrink-0">
                <Icon size={20} strokeWidth={2.2} />
              </div>
            )}

            <div>
              {title && <h2 className="text-lg font-bold text-navy">{title}</h2>}

              {description && (
                <p className="text-xs text-slate-400 mt-0.5">{description}</p>
              )}
            </div>
          </div>

          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}

      <div className={bodyClassName}>{children}</div>
    </div>
  );
};

export default SectionCard;