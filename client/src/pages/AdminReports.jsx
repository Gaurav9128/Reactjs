import { Link } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";

const reports = [
  {
    title: "Students Report",
    icon: "👨‍🎓",
    description: "Registered Students List",
    view: "/admin/students",
    export: `${import.meta.env.VITE_API_URL}/api/export/students`,
  },
  {
    title: "Attendance Report",
    icon: "✅",
    description: "Day Wise Attendance",
    view: "/admin/attendance",
    export: `${import.meta.env.VITE_API_URL}/api/export/attendance/all`,
  },
  {
    title: "Break Report",
    icon: "☕",
    description: "Student Break History",
    view: "/admin/break-report",
    export: `${import.meta.env.VITE_API_URL}/api/export/break`,
  },
  {
    title: "Ticket Report",
    icon: "🎫",
    description: "Generated Workshop Tickets",
    view: "/admin/ticket-report",
    export: `${import.meta.env.VITE_API_URL}/api/export/tickets`,
  },
];

const AdminReports = () => {
  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
          Reports
        </h1>

        {/* Reports Grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">

          {reports.map((item, index) => (

            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8 hover:shadow-xl transition duration-300"
            >

              <div className="text-4xl sm:text-5xl mb-4">
                {item.icon}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold">
                {item.title}
              </h2>

              <p className="text-gray-500 mt-2 mb-6 text-sm sm:text-base">
                {item.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">

                <Link
                  to={item.view}
                  className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition"
                >
                  View
                </Link>

                <a
                  href={item.export}
                  className="w-full sm:w-auto text-center bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg transition"
                >
                  Export
                </a>

              </div>

            </div>

          ))}

        </div>

        {/* Complete Report */}

        <div className="mt-10 bg-white rounded-xl shadow-lg p-5 sm:p-6 lg:p-8">

          <h2 className="text-xl sm:text-2xl font-bold mb-5">
            Complete Workshop Report
          </h2>

          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            Download Complete Workshop Excel Report
          </p>

          <a
            href={`${import.meta.env.VITE_API_URL}/api/export/attendance/all`}
            className="inline-block w-full sm:w-auto text-center bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg transition"
          >
            Export Complete Report
          </a>

        </div>

      </div>

    </div>
  );
};

export default AdminReports;