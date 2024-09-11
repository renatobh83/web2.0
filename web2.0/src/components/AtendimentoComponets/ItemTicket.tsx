import React, { ReactNode, useEffect, useState } from 'react';
import { formatDistance, parseJSON } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, Badge, List, ListItem } from '@mui/material'
import { PlayIcon } from 'lucide-react';
import classNames from 'classnames';
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket';


export interface Ticket {
    lastMessage: ReactNode;
    id: number;
    name: string;
    contact: { name: string };
    lastMessageAt: string;
    updatedAt: string;
    unreadMessages: number;
    profilePicUrl?: string;
    whatsapp?: { name: string };
    channel: string;
    status: 'open' | 'pending' | 'closed';
    answered: boolean;
    isGroup: boolean;
    username: string;
    queue?: string;
    queueId?: number;
}

interface Props {
    ticket: Ticket;
    buscaTicket?: boolean;
    filas?: { id: number; queue: string }[];
    abrirChatContato: (ticket: Ticket) => void;
}

export const ItemTicket: React.FC<Props> = ({
    ticket,
    buscaTicket,
    filas = [],
    abrirChatContato

}) => {
    const ticketFocado = useAtendimentoTicketStore(s => s.ticketFocado)
    // const { iniciarAtendimento } = useTicketService();
    const [recalcularHora, setRecalcularHora] = useState(1);

    const borderColor = {
        open: 'border-blue-500',
        pending: 'border-red-500',
        closed: 'border-green-500',
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setRecalcularHora((prev) => prev + 1);
        }, 20000);
        return () => clearInterval(interval);
    }, []);

    const obterNomeFila = (ticket: Ticket) => {
        const fila = filas.find((f) => f.id === ticket.queueId);
        return fila ? fila.queue : '';
    };

    const dataInWords = (timestamp: string, updated: string) => {
        const data = timestamp ? new Date(Number(timestamp)) : parseJSON(updated);
        return formatDistance(data, new Date(), { locale: ptBR });
    };

    const ticketClass = classNames({
        'ticket-active-item': ticket.id === ticketFocado.id,
        'ticketNotAnswered': !ticket.answered && !ticket.isGroup && ticket.status === 'open',
    });



    return (
        <ListItem disablePadding={true} sx={{ paddingBottom: 2 }}>
            {ticket.status === 'pending' || (buscaTicket && ticket.status === 'pending') ? (
                <button>
                    <Avatar sx={{ width: 50, height: 50 }} >
                        {ticket.unreadMessages && (
                            <Badge
                                badgeContent={ticket.unreadMessages}
                                color="secondary"
                                className="mr-1"
                            />
                        )}
                        <PlayIcon />
                    </Avatar>
                </button>

            ) : (
                <Avatar sx={{ width: 50, height: 50 }} src={ticket.profilePicUrl}>
                    {ticket.unreadMessages && (
                        <Badge
                            badgeContent={ticket.unreadMessages}
                            color="secondary"
                            className="mr-1"
                        />
                    )}
                </Avatar>)}
            <div className="pl-2 flex-1">
                <div className="flex justify-between items-center">
                    <span className="font-bold truncate ">{ticket.name || ticket.contact.name}</span>
                    <span className="text-xs text-gray-500">
                        {dataInWords(ticket.lastMessageAt, ticket.updatedAt)}
                    </span>
                </div>
                <div className="max-w-[15em] text-sm block overflow-hidden whitespace-pre-wrap max-h-[1.5rem]">{ticket.lastMessage}</div>
                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center space-x-1">
                        <span className={`text-xs font-bold ${ticket.whatsapp ? 'text-blue-600' : ''}`}>
                            {ticket.whatsapp && ticket.whatsapp.name}
                        </span>
                        {/* <Icon className="w-5 h-5">{`img:${ticket.channel}-logo.png`}</Icon> */}
                    </div>
                    <span className="text-xs font-bold">#{ticket.id}</span>
                </div>
                <div className="text-xs text-gray-600">
                    Usuário: {ticket.username}
                </div>
                <div className="text-xs text-gray-600">
                    Fila: {ticket.queue || obterNomeFila(ticket)}
                </div>
            </div>
        </ListItem>

    );
};

