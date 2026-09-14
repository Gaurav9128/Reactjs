const PageHeader = ({ title, description, icon: Icon, actions }) => {
  return (
    <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="hidden sm:flex w-11 h-11 rounded-xl bg-light-blue text-primary-blue items-center justify-center shrink-0">
            <Icon size={22} strokeWidth={2.2} />
          </div>
        )}

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      {actions && (
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;