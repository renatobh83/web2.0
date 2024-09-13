import React from "react";

export interface Ticket {
	id: number;
	name: string;
	lastMessage: string;
	profilePicUrl: string;
	userId?: number;
	isGroup?: boolean;
	status?: string;
	autoReplyId?: number;
	queueId?: number;
	contact?: any;
}

interface TicketItemProps {
	ticket: Ticket;
	onClick: (name: string, ticket: Ticket) => void;
}

const TicketItem: React.FC<TicketItemProps> = ({ ticket, onClick }) => {
	return (
		<div
			className="flex border-b border-gray-300 mb-2 cursor-pointer"
			onClick={() => onClick(ticket.name, ticket)}
		>
			<div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-full overflow-hidden">
				<img
					src={ticket.profilePicUrl}
					alt={ticket.name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="ml-4 flex-1">
				<div className="text-center font-bold text-xs mb-1">{ticket.name}</div>
				<div className="max-w-[15em] text-sm block overflow-hidden whitespace-pre-wrap max-h-[1.5rem]">
					<strong>Mensagem:</strong> {ticket.lastMessage}
				</div>
			</div>
		</div>
	);
};

export default TicketItem;
