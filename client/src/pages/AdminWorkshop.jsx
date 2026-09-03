import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "../components/admin/Sidebar";

const AdminWorkshop = () => {
  const [isCreated, setIsCreated] = useState(false);

  const [workshop, setWorkshop] = useState({
    title: "",
    description: "",
    venue: "",
    organizer: "",
    startDate: "",
    workingDays: 5,
    attendanceStartTime: "08:30",
    attendanceEndTime: "10:00",
    allowedBreakMinutes: 15,
    status: "UPCOMING",
  });

  useEffect(() => {
    loadWorkshop();
  }, []);

  // ==========================
  // Load Workshop
  // ==========================

  const loadWorkshop = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/workshop`
        
      );

      const data = res.data.workshop;

      if (!data) {
        setIsCreated(false);
        return;
      }

      setIsCreated(true);

      setWorkshop({
        title: data.title || "",
        description: data.description || "",
        venue: data.venue || "",
        organizer: data.organizer || "",
        startDate: data.startDate
          ? data.startDate.substring(0, 10)
          : "",
        workingDays: data.workingDays || 5,
        attendanceStartTime:
          data.attendanceStartTime || "08:30",
        attendanceEndTime:
          data.attendanceEndTime || "10:00",
        allowedBreakMinutes:
          data.allowedBreakMinutes || 15,
        status: data.status || "UPCOMING",
      });

    } catch (err) {
      console.log(err);
    }
  };

  // ==========================
  // Handle Input Change
  // ==========================

  const handleChange = (e) => {
    setWorkshop({
      ...workshop,
      [e.target.name]: e.target.value,
    });
  };

  // ==========================
  // Create / Update Workshop
  // ==========================

  const saveWorkshop = async (e) => {
    e.preventDefault();

    try {

      let res;

      if (isCreated) {

        res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/workshop`,
          workshop
        );

      } else {

        res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/workshop/create`,
          workshop
        );

        setIsCreated(true);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      loadWorkshop();

    } catch (err) {

      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong",
      });

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
          Workshop Management
        </h1>

        <form
          onSubmit={saveWorkshop}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>

              <label className="font-semibold block mb-2">
                Workshop Title
              </label>

              <input
                type="text"
                name="title"
                value={workshop.title}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Organizer
              </label>

              <input
                type="text"
                name="organizer"
                value={workshop.organizer}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="font-semibold block mb-2">
                Description
              </label>

              <textarea
                rows="4"
                name="description"
                value={workshop.description}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 resize-none"
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Venue
              </label>

              <input
                type="text"
                name="venue"
                value={workshop.venue}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Start Date
              </label>

              <input
                type="date"
                name="startDate"
                value={workshop.startDate}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              />

            </div>

                        <div>

              <label className="font-semibold block mb-2">
                Working Days
              </label>

              <input
                type="number"
                name="workingDays"
                value={workshop.workingDays}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Allowed Break Minutes
              </label>

              <input
                type="number"
                name="allowedBreakMinutes"
                value={workshop.allowedBreakMinutes}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Attendance Start Time
              </label>

              <input
                type="time"
                name="attendanceStartTime"
                value={workshop.attendanceStartTime}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div>

              <label className="font-semibold block mb-2">
                Attendance End Time
              </label>

              <input
                type="time"
                name="attendanceEndTime"
                value={workshop.attendanceEndTime}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              />

            </div>

            <div className="md:col-span-2">

              <label className="font-semibold block mb-2">
                Status
              </label>

              <select
                name="status"
                value={workshop.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
              >

                <option value="UPCOMING">
                  UPCOMING
                </option>

                <option value="ONGOING">
                  ONGOING
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

              </select>

            </div>

          </div>

          <button
            type="submit"
            className={`mt-8 w-full sm:w-auto px-8 py-3 rounded-lg text-white font-semibold transition ${
              isCreated
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isCreated
              ? "Update Workshop"
              : "Create Workshop"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default AdminWorkshop;