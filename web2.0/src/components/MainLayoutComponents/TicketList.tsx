import React from "react";
import TicketItem from "./TicketItem";

interface NotificationsState {
	tickets: Ticket[];
}

interface Ticket {
	id: number;
	name: string;
	lastMessage: string;
	profilePicUrl: string;
}

interface TicketListProps {
	notifications: NotificationsState;
	abrirAtendimentoExistente: (name: string, ticket: Ticket) => void;
}

const TicketList: React.FC<TicketListProps> = ({
	notifications,
	abrirAtendimentoExistente,
}) => {
	return (
		<div className="p-4">
			{notifications.tickets.map((ticket) => (
				<TicketItem
					key={ticket.id}
					ticket={ticket}
					onClick={abrirAtendimentoExistente}
				/>
			))}
		</div>
	);
};

export default TicketList;
