import { Inbox } from "lucide-react";

const EmptyState = ({ icon: Icon = Inbox, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-light-blue text-primary-blue flex items-center justify-center mb-4">
        <Icon size={26} strokeWidth={1.8} />
      </div>

      <h3 className="text-base font-semibold text-navy">{title}</h3>

      {description && (
        <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>
      )}

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;