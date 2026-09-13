const TicketHeader = ({
  title,
  subtitle,
  ticket,
  bgColor,
}) => {
  return (
    <div
      className={`${bgColor} text-white rounded-t-3xl px-4 py-5 sm:px-8 sm:py-6 flex justify-between items-center gap-3 min-w-0`}
    >
      <div className="min-w-0">
        <h1 className="text-3xl font-bold">
          React Rajasthan
        </h1>

        <p className="text-sm opacity-90 mt-1">
          {subtitle}
        </p>
      </div>

      <div className="text-right shrink-0">
        <h2 className="text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-2">
          Day {ticket.dayNumber}
        </p>

        <p className="text-sm opacity-90">
          {ticket.ticketNumber}
        </p>
      </div>
    </div>
  );
};

export default TicketHeader;