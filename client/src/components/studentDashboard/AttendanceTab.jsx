import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Icon from "./Icon.jsx";

const AttendanceTab = () => {
  const navigate = useNavigate();

  const [attendance, setAttendance] = useState([]);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [attendanceError, setAttendanceError] = useState("");

  /* =========================================================
     LOAD ATTENDANCE
  ========================================================= */

  const loadAttendance = async () => {
    setAttendanceLoading(true);
    setAttendanceError("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/attendance/history`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAttendance(res.data.attendance || []);
      setAttendanceError("");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      setAttendanceError(
        err.response?.data?.message ||
          "Failed to load attendance. Please try again."
      );
    } finally {
      setAttendanceLoading(false);
    }
  };

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    requestAnimationFrame(() => loadAttendance());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     STATUS BADGES
  ========================================================= */

  const getAttendanceBadge = (status) => {
    if (status === "PRESENT") {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-700">
          <Icon name="check" size={16} />
          Present
        </span>
      );
    }

    if (status === "ABSENT") {
      return (
        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
          <Icon name="x" size={16} />
          Absent
        </span>
      );
    }

    return (
      <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600">
        {status}
      </span>
    );
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Icon name="chart" size={22} />
          </div>

          <h2 className="text-2xl font-extrabold text-[#0b1935]">
            Attendance History
          </h2>
        </div>

        {attendance.length > 0 && (
          <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
            {attendance.length} Records
          </span>
        )}
      </div>

      {attendanceError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <h3 className="text-lg font-extrabold text-red-700">
            Unable to load attendance
          </h3>
          <p className="mt-2 text-sm font-medium text-red-600">
            {attendanceError}
          </p>
        </div>
      ) : attendanceLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="text-sm font-semibold text-slate-500">
              Loading attendance...
            </p>
          </div>
        </div>
      ) : attendance.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Icon name="calendar" size={30} />
          </div>

          <h3 className="mt-5 text-lg font-extrabold text-slate-700">
            No attendance records found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Attendance records will appear here after marking.
          </p>
        </div>
      ) : (
        <div className="relative">
          {/* TIMELINE LINE */}

          <div className="absolute bottom-7 left-[57px] top-7 hidden w-[2px] bg-slate-200 sm:block" />

          <div className="space-y-4">
            {attendance.map((item) => {
              const isPresent = item.status === "PRESENT";

              return (
                <div
                  key={item._id}
                  className="relative grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition hover:shadow-md sm:grid-cols-[82px_18px_1fr_120px] sm:items-center"
                >
                  {/* DAY */}

                  <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
                    <p className="text-xs font-semibold text-slate-400">Day</p>

                    <p className="mt-0.5 text-2xl font-black text-[#0b1935]">
                      {item.dayNumber}
                    </p>
                  </div>

                  {/* DOT */}

                  <div className="hidden justify-center sm:flex">
                    <div
                      className={`z-10 h-4 w-4 rounded-full border-4 border-white shadow ${
                        isPresent ? "bg-emerald-500" : "bg-red-500"
                      }`}
                    />
                  </div>

                  {/* DETAILS */}

                  <div className="flex flex-col gap-3">
                    <div>{getAttendanceBadge(item.status)}</div>

                    <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Icon name="calendar" size={16} />

                        <span>
                          {item.attendanceTime
                            ? new Date(item.attendanceTime).toLocaleDateString()
                            : "-"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Icon name="clock" size={16} />

                        <span>
                          {item.attendanceTime
                            ? new Date(item.attendanceTime).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RESULT */}

                  <div
                    className={`rounded-xl px-4 py-4 text-center ${
                      isPresent ? "bg-emerald-50" : "bg-red-50"
                    }`}
                  >
                    <div
                      className={`mx-auto mb-1 flex h-9 w-9 items-center justify-center rounded-full ${
                        isPresent
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-red-100 text-red-500"
                      }`}
                    >
                      <Icon name={isPresent ? "check" : "x"} size={20} />
                    </div>

                    <p
                      className={`text-xs font-bold ${
                        isPresent ? "text-emerald-700" : "text-red-600"
                      }`}
                    >
                      {isPresent ? "On time" : "Not Marked"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceTab;
