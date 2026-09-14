import { BarChart3 } from "lucide-react";
import { SectionCard, EmptyState } from "../ui";

const DayWiseAttendance = ({ days = [] }) => {
  const maxTotal = Math.max(...days.map((day) => day.total || 0), 1);

  return (
    <SectionCard
      icon={BarChart3}
      title="Day-wise Attendance"
      description="Attendance count for each workshop day"
      className="h-full"
      actions={
        <span className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
          Attendance Count
        </span>
      }
    >
      {/* Legend */}
      <div className="flex items-center justify-end gap-5 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-500">Present</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-slate-500">Absent</span>
        </div>
      </div>

      {days.length > 0 ? (
        <div className="mt-4">
          <div className="h-[260px] flex items-end gap-3 sm:gap-6 px-2">
            {days.map((item) => {
              const totalHeight = (item.total / maxTotal) * 100;

              const presentHeight =
                item.total > 0 ? (item.present / item.total) * 100 : 0;

              const absentHeight =
                item.total > 0 ? (item.absent / item.total) * 100 : 0;

              return (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
                >
                  <div className="mb-2 text-center">
                    <p className="text-xs font-bold text-navy">{item.present}</p>

                    {item.absent > 0 && (
                      <p className="text-[10px] text-slate-400">
                        {item.absent}
                      </p>
                    )}
                  </div>

                  <div
                    className="relative w-full max-w-[55px] bg-slate-100 rounded-t-lg overflow-hidden"
                    style={{ height: `${Math.max(totalHeight, 8)}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-blue-500 rounded-t-lg transition-all duration-700"
                      style={{ height: `${presentHeight}%` }}
                    />

                    {absentHeight > 0 && (
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-slate-300/80"
                        style={{
                          height: `${absentHeight}%`,
                          transform: `translateY(-${presentHeight}%)`,
                        }}
                      />
                    )}
                  </div>

                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Day {item.day}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-100 mt-1" />
        </div>
      ) : (
        <EmptyState
          icon={BarChart3}
          title="No Attendance Data Found"
          description="Day-wise attendance will appear here once sessions begin."
        />
      )}
    </SectionCard>
  );
};

export default DayWiseAttendance;