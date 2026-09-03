import {
  CheckCircle,
  XCircle,
  User,
  Building,
  Ticket,
  Calendar,
  Clock,
} from "lucide-react";

const ScanResult = ({ result }) => {

  if (!result) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-8 flex justify-center items-center">

        <div className="text-center">

          <Ticket
            size={70}
            className="mx-auto text-gray-300"
          />

          <h2 className="text-2xl font-bold text-gray-500 mt-4">
            No Ticket Scanned
          </h2>

          <p className="text-gray-400 mt-2">
            Scan a ticket to view attendance details.
          </p>

        </div>

      </div>
    );
  }

  // -------------------------
  // Error
  // -------------------------

  if (!result.success) {

    return (
      <div className="bg-white rounded-3xl shadow-lg p-8">

        <div className="text-center">

          <XCircle
            size={70}
            className="mx-auto text-red-500"
          />

          <h2 className="text-3xl font-bold text-red-600 mt-5">
            Scan Failed
          </h2>

          <p className="text-gray-600 mt-3 text-lg">
            {result.message}
          </p>

        </div>

      </div>
    );

  }

  // -------------------------
  // Success
  // -------------------------

  const ticket = result.data;

  return (

    <div className="bg-white rounded-3xl shadow-lg p-8">

      <div className="text-center mb-8">

        <CheckCircle
          size={70}
          className="mx-auto text-green-500"
        />

        <h2 className="text-3xl font-bold text-green-600 mt-4">
          Attendance Marked
        </h2>

      </div>

      <div className="space-y-5">

        <div className="flex items-center gap-3">
          <User className="text-blue-600" />
          <span className="font-semibold">
            Student :
          </span>

          <span>
            {ticket.studentId?.fullName}
          </span>

        </div>

        <div className="flex items-center gap-3">
          <Building className="text-purple-600" />

          <span className="font-semibold">
            College :
          </span>

          <span>
            {ticket.studentId?.college}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Ticket className="text-orange-600" />

          <span className="font-semibold">
            Ticket :
          </span>

          <span>
            {ticket.ticketNumber}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Calendar className="text-green-600" />

          <span className="font-semibold">
            Day :
          </span>

          <span>
            Day {ticket.dayNumber}
          </span>

        </div>

        <div className="flex items-center gap-3">

          <Clock className="text-red-600" />

          <span className="font-semibold">
            Time :
          </span>

          <span>
            {ticket.attendanceTime
              ? new Date(ticket.attendanceTime).toLocaleString()
              : "Just Now"}
          </span>

        </div>

        <div className="pt-4">

          <span className="px-5 py-2 rounded-full bg-green-100 text-green-700 font-bold">

            {ticket.status}

          </span>

        </div>

      </div>

    </div>

  );
};

export default ScanResult;