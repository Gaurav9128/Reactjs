import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (query = "") => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/students/search?query=${query}`
        
      );

      setStudents(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {/* Heading */}

        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Student Management
          </h1>

          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Search and manage workshop students
          </p>
        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            loadStudents(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Table */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Mobile
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    College
                  </th>

                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.fullName}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.email}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.mobile}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.college}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`/admin/students/${student._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No Students Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;