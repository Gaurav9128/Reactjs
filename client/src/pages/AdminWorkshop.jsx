import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  BookOpen,
  CalendarClock,
  Clock,
  Save,
  Settings2,
} from "lucide-react";
import adminApi from "../utils/adminApi";
import {
  AdminLayout,
  PageHeader,
  SectionCard,
  StatusBadge,
  Field,
  fieldControlClass,
  Button,
  Skeleton,
} from "../components/ui";

const AdminWorkshop = () => {
  const [isCreated, setIsCreated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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

  const fetchWorkshop = async () => {
    try {
      const res = await adminApi.get("/api/workshop");
      const data = res.data.workshop;

      if (!data) {
        return { created: false };
      }

      return {
        created: true,
        data: {
          title: data.title || "",
          description: data.description || "",
          venue: data.venue || "",
          organizer: data.organizer || "",
          startDate: data.startDate ? data.startDate.substring(0, 10) : "",
          workingDays: data.workingDays || 5,
          attendanceStartTime: data.attendanceStartTime || "08:30",
          attendanceEndTime: data.attendanceEndTime || "10:00",
          allowedBreakMinutes: data.allowedBreakMinutes || 15,
          status: data.status || "UPCOMING",
        },
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const loadWorkshop = async () => {
    const result = await fetchWorkshop();

    if (result) {
      setIsCreated(result.created);
      if (result.created) {
        setWorkshop(result.data);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchWorkshop().then((result) => {
      if (result) {
        setIsCreated(result.created);

        if (result.created) {
          setWorkshop(result.data);
        }
      }

      setLoading(false);
    });
  }, []);

  const handleChange = (e) => {
    setWorkshop({
      ...workshop,
      [e.target.name]: e.target.value,
    });
  };

  const saveWorkshop = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      let res;

      if (isCreated) {
        res = await adminApi.put("/api/workshop", workshop);
      } else {
        res = await adminApi.post("/api/workshop/create", workshop);
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
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        icon={BookOpen}
        title="Workshop Management"
        description="Configure the workshop schedule and attendance settings"
        actions={
          !loading &&
          isCreated && <StatusBadge status={workshop.status} />
        }
      />

      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-11 w-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form onSubmit={saveWorkshop}>
          {/* Workshop Details */}
          <SectionCard
            icon={BookOpen}
            title="Workshop Details"
            description="Basic information about the workshop"
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Workshop Title" required>
                <input
                  type="text"
                  name="title"
                  value={workshop.title}
                  onChange={handleChange}
                  className={fieldControlClass}
                  required
                />
              </Field>

              <Field label="Organizer">
                <input
                  type="text"
                  name="organizer"
                  value={workshop.organizer}
                  onChange={handleChange}
                  className={fieldControlClass}
                />
              </Field>

              <Field label="Description" className="md:col-span-2">
                <textarea
                  rows="4"
                  name="description"
                  value={workshop.description}
                  onChange={handleChange}
                  className={`${fieldControlClass} resize-none`}
                />
              </Field>

              <Field label="Venue">
                <input
                  type="text"
                  name="venue"
                  value={workshop.venue}
                  onChange={handleChange}
                  className={fieldControlClass}
                />
              </Field>

              <Field label="Start Date" required>
                <input
                  type="date"
                  name="startDate"
                  value={workshop.startDate}
                  onChange={handleChange}
                  className={fieldControlClass}
                  required
                />
              </Field>
            </div>
          </SectionCard>

          {/* Schedule */}
          <SectionCard
            icon={CalendarClock}
            title="Schedule"
            description="Workshop duration and current status"
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Working Days">
                <input
                  type="number"
                  name="workingDays"
                  value={workshop.workingDays}
                  onChange={handleChange}
                  className={fieldControlClass}
                  min="1"
                />
              </Field>

              <Field label="Status">
                <select
                  name="status"
                  value={workshop.status}
                  onChange={handleChange}
                  className={fieldControlClass}
                >
                  <option value="UPCOMING">UPCOMING</option>
                  <option value="ONGOING">ONGOING</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </Field>
            </div>
          </SectionCard>

          {/* Attendance Settings */}
          <SectionCard
            icon={Settings2}
            title="Attendance Settings"
            description="Attendance window and break allowances"
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-5">
              <Field label="Attendance Start Time" hint="Daily check-in opens">
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="time"
                    name="attendanceStartTime"
                    value={workshop.attendanceStartTime}
                    onChange={handleChange}
                    className={fieldControlClass}
                  />
                </div>
              </Field>

              <Field label="Attendance End Time" hint="Daily check-in closes">
                <div className="flex items-center gap-2.5">
                  <Clock size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="time"
                    name="attendanceEndTime"
                    value={workshop.attendanceEndTime}
                    onChange={handleChange}
                    className={fieldControlClass}
                  />
                </div>
              </Field>

              <Field label="Allowed Break Minutes">
                <input
                  type="number"
                  name="allowedBreakMinutes"
                  value={workshop.allowedBreakMinutes}
                  onChange={handleChange}
                  className={fieldControlClass}
                  min="0"
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex justify-end">
            <Button
              type="submit"
              icon={Save}
              loading={saving}
              size="lg"
            >
              {isCreated ? "Update Workshop" : "Create Workshop"}
            </Button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
};

export default AdminWorkshop;