import { useEffect, useState } from "react";
import adminApi from "../../utils/adminApi";

const DayWiseAttendance = () => {
  const [days, setDays] = useState([]);

  const loadDayWise = async () => {
    try {
      const res = await adminApi.get(
        "/api/admin/dashboard/day-wise"
      );

      setDays(res.data.days || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadDayWise();
  }, []);

  const rateBadge = (rate) => {
    let bg;
    let text;

    if (rate >= 75) {
      bg = "bg-green-100";
      text = "text-green-700";
    } else if (rate >= 50) {
      bg = "bg-yellow-100";
      text = "text-yellow-700";
    } else {
      bg = "bg-red-100";
      text = "text-red-700";
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${bg} ${text}`}
      >
        {rate}%
      </span>
    );
  };

  return (
    <div className="mt-10 bg-white rounded-xl shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-5">
        Day-wise Attendance
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-[650px] w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left px-4 py-3 whitespace-nowrap">
                Day
              </th>

              <th className="text-left px-4 py-3 whitespace-nowrap">
                Present
              </th>

              <th className="text-left px-4 py-3 whitespace-nowrap">
                Absent
              </th>

              <th className="text-left px-4 py-3 whitespace-nowrap">
                Total
              </th>

              <th className="text-left px-4 py-3 whitespace-nowrap">
                Rate (%)
              </th>
            </tr>
          </thead>

          <tbody>
            {days.length > 0 ? (
              days.map((item) => (
                <tr
                  key={item.day}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    Day {item.day}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.present}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.absent}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {item.total}
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {rateBadge(item.rate)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-10 text-gray-500"
                >
                  No Attendance Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DayWiseAttendance;