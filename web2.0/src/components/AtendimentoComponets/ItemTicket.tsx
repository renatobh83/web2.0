import React, { useEffect, useState } from 'react';
import { formatDistance, parseJSON } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Avatar, Badge, Button, Icon, List, ListItemButton, Tooltip } from '@mui/material' // Substitua por Quasar se estiver utilizando Quasar para React
import { CircleAlert, CircleCheckBig, CircleGaugeIcon, Delete, PlayIcon, SendIcon, StarIcon } from 'lucide-react';
import classNames from 'classnames';
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket';


export interface Ticket {
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
        <List sx={{ width: '100%', maxWidth: 370, bgcolor: 'background.paper' }} className={ticketClass}>

            {ticket.status === 'pending' || (buscaTicket && ticket.status === 'pending') ? (
                <ListItemButton onClick={() => console.log('Abrir atendimento')}>
                    <Avatar sx={{ width: 24, height: 24 }} >{ticket.unreadMessages && (
                        <Badge
                            badgeContent={ticket.unreadMessages}
                            color="secondary"
                            className="mr-1"
                        />
                    )}</Avatar>
                </ListItemButton>) : (<div>Atendimento ja iniciado</div>)}
        </List >
    );
};

