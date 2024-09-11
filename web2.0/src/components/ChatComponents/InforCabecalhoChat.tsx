import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Avatar,
    Button,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Select,
    FormControl,
    CircularProgress,
    Tooltip,
    ListItemText,
} from '@mui/material';
import { MessageSquareText, ReplyIcon, FolderSyncIcon, MessageSquareHeartIcon } from 'lucide-react';
import { useTicketService } from '../../utils/mixinAtualizarStatusTicket';

import { AtualizarTicket } from '../../services/tickets.js';
import { ListarUsuarios } from '../../services/user.js'

import { ListarFilas } from '../../services/filas.js';
import { toast } from 'sonner';
import { useAtendimentoTicketStore } from '../../store/atendimentoTicket.js';

interface Ticket {
    id: number;
    contact?: { profilePicUrl: string; name: string };
    user?: { name: string };
    status?: string;
    queueId?: number;
    userId?: number;
}

interface User {
    id: number;
    name: string;
    queues: { id: number }[];
}

interface Queue {
    id: number;
    queue: string;
}

interface HeaderProps {
    ticketFocado: Ticket;
    abriModal: (value: boolean) => void
}

export const InfoCabecalhoMensagens: React.FC<HeaderProps> = ({ ticketFocado, abriModal }) => {

    const { atualizarStatusTicket, loading, dialogData } = useTicketService();


    const setTicketFocado = useAtendimentoTicketStore(s => s.setTicketFocado)
    const [dialogOpen, setDialogOpen] = useState(false);
    const [_, setDialogContent] = useState<{ status: string; ticket: Ticket } | null>(null);
    const [confirmAction, setConfirmAction] = useState<(() => Promise<void>) | null>(null);


    const [modalTransferirTicket, setModalTransferirTicket] = useState(false);
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [filas, setFilas] = useState<Queue[]>([]);
    const [filaSelecionada, setFilaSelecionada] = useState<number | null>(null);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const userId = Number(localStorage.getItem('userId'));

    useEffect(() => {
        if (modalTransferirTicket) {
            listarFilas();
            listarUsuarios();
        }
    }, [modalTransferirTicket]);

    const listarUsuarios = async () => {
        try {
            const { data } = await ListarUsuarios();
            setUsuarios(data.users);
        } catch (error) {
            console.error(error);
        }
    };

    const listarFilas = async () => {
        try {
            const { data } = await ListarFilas();
            setFilas(data);
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        const initialize = async () => {
            await listarFilas()
        }
        initialize()
    }, [])
    const confirmarTransferenciaTicket = async () => {
        if (!filaSelecionada || (usuarioSelecionado === ticketFocado.userId && ticketFocado.userId !== null)) {
            toast.error('Ticket já pertece ao usuário selecionado.')
            return;
        }
        if (ticketFocado.userId === userId && userId === usuarioSelecionado) {
            toast.error('Ticket já pertece ao seu usuário')
            return
        }
        if (ticketFocado.queueId === filaSelecionada && ticketFocado.userId === usuarioSelecionado) {
            toast.error('Ticket já pertece a esta fila e usuário')
            return
        }
        try {

            await AtualizarTicket(ticketFocado.id, {
                userId: usuarioSelecionado,
                queueId: filaSelecionada,
                status: usuarioSelecionado == null ? 'pending' : 'open',
                isTransference: 1,
            });
            toast.success('Ticket transferido.')
            setModalTransferirTicket(false);
            setTicketFocado({})

        } catch (error) {
            console.error('Erro ao transferir o ticket:', error);
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUpdateStatus = (ticket, status: 'open' | 'pending' | 'closed') => {
        const { handleConfirm } = atualizarStatusTicket(ticket, status);

        setDialogOpen(true); // Abre o diálogo
        setDialogContent({ status, ticket }); // Define os dados do diálogo
        setConfirmAction(() => handleConfirm); // Armazena a ação de confirmação

    };


    return (
        <div>
            {/* Header */}
            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar className='min-h-16 h-16 border-none'>
                    {/* Menu button for mobile */}
                    {/* <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick} >
            <MenuIcon className='hidden md:flex'/>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Opção 1</MenuItem>
            <MenuItem onClick={handleMenuClose}>Opção 2</MenuItem>
          </Menu> */}

                    {/* Ticket info */}
                    <div className="flex items-center">
                        <Avatar alt={ticketFocado.contact?.name} src={ticketFocado.contact?.profilePicUrl} />
                        <div className="ml-4">
                            <div className="font-bold text-zinc-800 ">{ticketFocado.contact?.name || 'Carregando...'}</div>
                            {/* <div className='text-xs text-zinc-400'>{ticketFocado.user?.name ? `Atribuído a: ${ticketFocado.user}` : 'Carregando usuário...'}</div> */}
                            <div className='text-xs font-thin text-zinc-600'>Ticket: {ticketFocado.id}</div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="ml-auto flex items-center space-x-2">
                        <Tooltip title="Agendar mensagem">
                            <IconButton color="primary" disabled={ticketFocado.status === 'closed'}
                                onClick={() => abriModal(true)} >
                                <MessageSquareText />
                            </IconButton>
                        </Tooltip>

                        <Button
                            aria-controls="simple-menu"
                            aria-haspopup="true"
                            onClick={handleMenuClick}
                            variant="contained"
                            id="btn-admin"
                            className="font-bold rounded-full text-black"
                            style={{ textTransform: 'none' }}
                        >
                            Resolver
                        </Button>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            {ticketFocado.status !== 'closed' && (
                                <MenuItem
                                    onClick={() => handleUpdateStatus(ticketFocado, "closed")}
                                >
                                    <IconButton size="small" color="warning">
                                        <MessageSquareHeartIcon />
                                    </IconButton>
                                    <ListItemText primary="Fechar" />
                                </MenuItem>
                            )}
                            {ticketFocado.status === 'closed' && (
                                <MenuItem
                                    onClick={() => handleUpdateStatus(ticketFocado, "open")}
                                >
                                    <IconButton size="small" color="warning">
                                        <ReplyIcon />
                                    </IconButton>
                                    <ListItemText primary="Reabrir Ticket" />
                                </MenuItem>
                            )}

                            {ticketFocado.status === 'open' && (
                                <MenuItem
                                    onClick={() => handleUpdateStatus(ticketFocado, 'pending')}
                                    dense>
                                    <IconButton size="small" color="error">
                                        <ReplyIcon />
                                    </IconButton>
                                    <ListItemText
                                        primary="Fila"
                                        secondary="Retornar aos pendentes"
                                    />
                                </MenuItem>
                            )}

                            {ticketFocado.status !== 'closed' && (
                                <MenuItem
                                    onClick={() => setModalTransferirTicket(true)}
                                    dense>
                                    <IconButton size="small" color="primary">
                                        <FolderSyncIcon />
                                    </IconButton>
                                    <ListItemText primary="Transferir" />
                                </MenuItem>
                            )}

                        </Menu>


                    </div>
                </Toolbar>
            </AppBar>

            {/* Modal de Transferência */}
            <Dialog open={modalTransferirTicket} onClose={() => setModalTransferirTicket(false)}>
                <DialogTitle>Transferir Ticket</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <Select
                            native
                            value={filaSelecionada || ''}
                            onChange={(e) => setFilaSelecionada(Number(e.target.value))}
                        >
                            <option value="" disabled>
                                Selecione a fila
                            </option>
                            {filas.map((fila) => (
                                <option key={fila.id} value={fila.id}>
                                    {fila.queue}
                                </option>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth margin="normal">

                        <Select
                            native
                            value={usuarioSelecionado || ''}
                            onChange={(e) => setUsuarioSelecionado(Number(e.target.value))}
                            disabled={!filaSelecionada}
                        >
                            <option value="" disabled>
                                Selecione o usuário
                            </option>
                            {usuarios
                                .filter((user) =>
                                    user.queues.some((queue) => queue.id === filaSelecionada)
                                )
                                .map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalTransferirTicket(false)} color="secondary">
                        Cancelar
                    </Button>
                    <Button onClick={confirmarTransferenciaTicket} color="primary">
                        Transferir
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>{dialogData?.status === 'closed' ? 'Encerrar o atendimento?' : 'Retornar a Pendente'}</DialogTitle>
                <DialogContent>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <div>
                            Cliente: {dialogData?.ticket.contact?.name} || Ticket: {dialogData?.ticket.id}
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Não
                    </Button>
                    <Button onClick={async () => {
                        if (confirmAction) {
                            await confirmAction(); // Executa a função de confirmação
                        }
                        setDialogOpen(false); // Fecha o diálogo após a confirmação
                    }} color="primary" disabled={loading}>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};