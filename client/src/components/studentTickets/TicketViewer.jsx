import BoardingPass from "./BoardingPass.jsx";
import EventPass from "./EventPass.jsx";
import TechCard from "./TechCard.jsx";
import ConferenceBadge from "./ConferenceBadge.jsx";
import VIPPass from "./VIPPass.jsx";

const TicketViewer = ({ ticket }) => {
  switch (Number(ticket.dayNumber)) {
    case 1:
      return <BoardingPass ticket={ticket} />;

    case 2:
      return <EventPass ticket={ticket} />;

    case 3:
      return <TechCard ticket={ticket} />;

    case 4:
      return <ConferenceBadge ticket={ticket} />;

    case 5:
      return <VIPPass ticket={ticket} />;

    default:
      return (
        <div className="p-20 text-center">
          Invalid Ticket
        </div>
      );
  }
};

export default TicketViewer;