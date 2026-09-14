import { CheckCircle, XCircle, User, Building, Ticket, Calendar, Clock } from "lucide-react";
import { SectionCard, EmptyState, StatusBadge } from "../ui";

const ScanResult = ({ result }) => {
  if (!result) {
    return (
      <SectionCard className="flex items-center justify-center" bodyClassName="flex justify-center items-center min-h-[280px]">
        <EmptyState
          icon={Ticket}
          title="No Ticket Scanned"
          description="Scan a ticket to view attendance details."
        />
      </SectionCard>
    );
  }

  if (!result.success) {
    return (
      <SectionCard className="flex items-center justify-center" bodyClassName="flex flex-col items-center justify-center min-h-[280px]">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <XCircle size={26} strokeWidth={2} />
        </div>

        <h2 className="text-xl font-bold text-rose-600">Scan Failed</h2>

        <p className="text-sm text-slate-500 mt-1 max-w-xs text-center">
          {result.message}
        </p>
      </SectionCard>
    );
  }

  const ticket = result.data;

  return (
    <SectionCard>
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
          <CheckCircle size={26} strokeWidth={2} />
        </div>

        <h2 className="text-xl font-bold text-emerald-600">
          Attendance Marked
        </h2>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 text-sm">
          <User size={18} className="text-blue-600 shrink-0" />
          <span className="text-slate-500 w-20 shrink-0">Student</span>
          <span className="font-medium text-navy truncate">{ticket.studentId?.fullName}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Building size={18} className="text-purple-600 shrink-0" />
          <span className="text-slate-500 w-20 shrink-0">College</span>
          <span className="font-medium text-navy truncate">{ticket.studentId?.college}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Ticket size={18} className="text-amber-600 shrink-0" />
          <span className="text-slate-500 w-20 shrink-0">Ticket</span>
          <span className="font-medium text-navy">{ticket.ticketNumber}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Calendar size={18} className="text-emerald-600 shrink-0" />
          <span className="text-slate-500 w-20 shrink-0">Day</span>
          <span className="font-medium text-navy">Day {ticket.dayNumber}</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Clock size={18} className="text-rose-600 shrink-0" />
          <span className="text-slate-500 w-20 shrink-0">Time</span>
          <span className="font-medium text-navy">
            {ticket.attendanceTime
              ? new Date(ticket.attendanceTime).toLocaleString()
              : "Just Now"}
          </span>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex justify-center">
        <StatusBadge status={ticket.status} />
      </div>
    </SectionCard>
  );
};

export default ScanResult;