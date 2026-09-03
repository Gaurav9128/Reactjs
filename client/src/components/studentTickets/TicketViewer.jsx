import BoardingPass from "./BoardingPass";
import EventPass from "./EventPass";
import TechCard from "./TechCard";
import ConferenceBadge from "./ConferenceBadge";
import VipPass from "./VipPass";

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
      return <VipPass ticket={ticket} />;

    default:
      return (
        <div className="p-20 text-center">
          Invalid Ticket
        </div>
      );

  }

};

export default TicketViewer;