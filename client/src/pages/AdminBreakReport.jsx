import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";

const AdminBreakReport = () => {
  const [breaks, setBreaks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadBreaks();
  }, []);

  const loadBreaks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/report/break");
      setBreaks(res.data.breaks);
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = breaks.filter((item) =>
    item.studentId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />

      <div className="ml-72 w-full p-8">

        <h1 className="text-3xl font-bold mb-6">
          Break Report
        </h1>

        <input
          type="text"
          placeholder="Search Student..."
          className="border p-3 rounded-lg w-full mb-6"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />

        <table className="w-full bg-white shadow rounded-lg">

          <thead>

            <tr className="bg-orange-500 text-white">

              <th className="p-3">Student</th>
              <th className="p-3">College</th>
              <th className="p-3">Day</th>
              <th className="p-3">Break Out</th>
              <th className="p-3">Return</th>
              <th className="p-3">Minutes</th>
              <th className="p-3">Status</th>

            </tr>

          </thead>

          <tbody>

            {filtered.map((item)=>(

              <tr key={item._id} className="border-b">

                <td className="p-3">
                  {item.studentId?.fullName}
                </td>

                <td className="p-3">
                  {item.studentId?.college}
                </td>

                <td className="p-3">
                  Day {item.dayNumber}
                </td>

                <td className="p-3">
                  {new Date(item.breakOutTime).toLocaleString()}
                </td>

                <td className="p-3">
                  {item.returnTime
                    ? new Date(item.returnTime).toLocaleString()
                    : "-"}
                </td>

                <td className="p-3">
                  {item.totalMinutes}
                </td>

                <td className="p-3">

                  <span
                    className={`px-3 py-1 rounded text-white ${
                      item.status==="RETURNED"
                      ? "bg-green-600"
                      : item.status==="TIMEOUT"
                      ? "bg-red-600"
                      : "bg-yellow-500"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AdminBreakReport;