import { BarChart3 } from "lucide-react";

const DayWiseAttendance = ({ days = [] }) => {
  const maxTotal = Math.max(
    ...days.map((day) => day.total || 0),
    1
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BarChart3 size={21} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-[#101b4b]">
              Day-wise Attendance
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              Attendance count for each workshop day
            </p>
          </div>
        </div>

        <button
          type="button"
          className="
            self-start
            px-4 py-2
            border border-slate-200
            rounded-lg
            text-xs font-medium
            text-slate-600
            hover:bg-slate-50
            transition
          "
        >
          Attendance Count
        </button>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-5 mt-6 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          <span className="text-slate-500">Present</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-slate-500">Absent</span>
        </div>
      </div>

      {/* Chart */}
      {days.length > 0 ? (
        <div className="mt-4">
          <div className="h-[260px] flex items-end gap-3 sm:gap-6 px-2">
            {days.map((item) => {
              const totalHeight =
                (item.total / maxTotal) * 100;

              const presentHeight =
                item.total > 0
                  ? (item.present / item.total) * 100
                  : 0;

              const absentHeight =
                item.total > 0
                  ? (item.absent / item.total) * 100
                  : 0;

              return (
                <div
                  key={item.day}
                  className="flex-1 h-full flex flex-col justify-end items-center min-w-0"
                >
                  {/* Values */}
                  <div className="mb-2 text-center">
                    <p className="text-xs font-bold text-[#101b4b]">
                      {item.present}
                    </p>

                    {item.absent > 0 && (
                      <p className="text-[10px] text-slate-400">
                        {item.absent}
                      </p>
                    )}
                  </div>

                  {/* Bar */}
                  <div
                    className="
                      relative w-full max-w-[55px]
                      bg-slate-100
                      rounded-t-lg
                      overflow-hidden
                    "
                    style={{
                      height: `${Math.max(totalHeight, 8)}%`,
                    }}
                  >
                    {/* Present */}
                    <div
                      className="
                        absolute bottom-0 left-0 right-0
                        bg-blue-500
                        rounded-t-lg
                        transition-all duration-700
                      "
                      style={{
                        height: `${presentHeight}%`,
                      }}
                    />

                    {/* Absent */}
                    {absentHeight > 0 && (
                      <div
                        className="
                          absolute bottom-0 left-0 right-0
                          bg-slate-300/80
                        "
                        style={{
                          height: `${absentHeight}%`,
                          transform: `translateY(-${presentHeight}%)`,
                        }}
                      />
                    )}
                  </div>

                  {/* Day */}
                  <p className="mt-3 text-xs font-medium text-slate-500">
                    Day {item.day}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Bottom line */}
          <div className="border-t border-slate-100 mt-1" />
        </div>
      ) : (
        <div className="h-[260px] flex items-center justify-center text-sm text-slate-400">
          No Attendance Data Found
        </div>
      )}
    </div>
  );
};

export default DayWiseAttendance;