import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import adminApi from "../utils/adminApi";

const AdminBreakReport = () => {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/report/break");
      setBreaks(res.data.breaks);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = breaks.filter((item) =>
    item.studentId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Break Report
        </h1>

        <input
          type="text"
          placeholder="Search Student..."
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-[850px] w-full">

              <thead>

                <tr className="bg-orange-500 text-white">

                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">College</th>
                  <th className="p-3 text-left">Day</th>
                  <th className="p-3 text-left">Break Out</th>
                  <th className="p-3 text-left">Return</th>
                  <th className="p-3 text-left">Minutes</th>
                  <th className="p-3 text-left">Status</th>

                </tr>

              </thead>

              <tbody>

                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No Breaks Found
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (

                    <tr key={item._id} className="border-b hover:bg-gray-50 transition">

                      <td className="p-3 whitespace-nowrap">
                        {item.studentId?.fullName}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {item.studentId?.college}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        Day {item.dayNumber}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {formatDate(item.breakOutTime)}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {formatDate(item.returnTime)}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        {item.totalMinutes ?? "-"}
                      </td>

                      <td className="p-3 whitespace-nowrap">

                        <span
                          className={`px-3 py-1 rounded text-white ${
                            item.status === "RETURNED"
                              ? "bg-green-600"
                              : item.status === "TIMEOUT"
                              ? "bg-red-600"
                              : "bg-yellow-500"
                          }`}
                        >
                          {item.status}
                        </span>

                      </td>

                    </tr>

                  ))
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AdminBreakReport;