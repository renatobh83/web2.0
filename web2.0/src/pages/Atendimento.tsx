import {
	ArrowDown,
	BookOpen,
	Contact,
	DoorClosed,
	FilterXIcon,
	Home,
	MessageSquareTextIcon,
	Search,
	User,
	Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { debounce } from "lodash";

import { ConsultarTickets } from "../services/tickets";
import {
	AppBar,
	Badge,
	Box,
	Button,
	Container,
	Divider,
	Drawer,
	List,
	ListItem,
	Menu,
	MenuItem,
	Popover,
	Switch,
	Tab,
	Tabs,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";

import { SelectComponent } from "../components/SelectComponent";
import { useAtendimentoTicketStore } from "../store/atendimentoTicket";
import {
	ItemTicket,
	Ticket,
} from "../components/AtendimentoComponets/ItemTicket";
import { UsuarioModal } from "./Usuario/ModalUsuarios";

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}
const toolbarStyle = {
	minHeight: "50px",
};
function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;
	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`vertical-tabpanel-${index}`}
			aria-labelledby={`vertical-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}
function a11yProps(index: number, name: string) {
	return {
		id: `vertical-tab-${index}`,
		"aria-controls": `vertical-tabpanel-${index}`,
		name: name,
	};
}

const drawerWidth = 380;

export const Atendimento = () => {
	const resetTickets = useAtendimentoTicketStore((s) => s.resetTickets);
	const setHasMore = useAtendimentoTicketStore((s) => s.setHasMore);
	const loadTickets = useAtendimentoTicketStore((s) => s.loadTickets);
	const tickets = useAtendimentoTicketStore((s) => s.tickets);
	const [mensagens, setMensagens] = useState<Ticket[]>([]);

	const [tabTicketsStatus, setTabTicketsStatus] = useState("pending");
	const navigate = useNavigate();
	const [hideDrawer, seHideDrawer] = useState(true);

	const [anchorEl, setAnchorEl] = useState(null);
	const [anchorEl2, setAnchorEl2] = useState(null);
	const profile = localStorage.getItem("profile");
	const username = localStorage.getItem("username");
	const usuario = JSON.parse(localStorage.getItem("usuario"));
	const [grupoAtivo, setGrupoAtivo] = useState("disabled");

	const [contadorUniversal, setContadorUniversal] = useState("enabled");
	const [tabTickets, setTabTickets] = useState(0);
	const [searchTerm, setSearchTerm] = useState("");
	const [abriModalUsuario, setAbriModalUsuario] = useState(false);

	const [switchStates, setSwitchStates] = useState(() => {
		const savedStates = JSON.parse(localStorage.getItem("filtrosAtendimento"));
		return {
			showAll: savedStates.showAll,
			isNotAssignedUser: savedStates.isNotAssignedUser,
			withUnreadMessages: savedStates.withUnreadMessages,
		};
	});
	const [pesquisaTickets, setPesquisaTickets] = useState(() => {
		const savedData = localStorage.getItem("filtrosAtendimento");
		return savedData ? JSON.parse(savedData) : { status: [], outrosCampos: "" };
	});

	const handleClickMenu = (event: any) => {
		if (event.currentTarget.id === "btn-admin") {
			setAnchorEl(event.currentTarget);
			return;
		} else event.currentTarget.id === "filtro-avancado";
		{
			setAnchorEl2(event.currentTarget);
			return;
		}
	};
	const handleCloseMenu = () => {
		setAnchorEl(null);
	};
	const handleCloseFilter = () => {
		setAnchorEl2(null);
	};

	const handleChangeTabs = (event, newValue: number) => {
		setTabTickets(newValue);
	};
	// Atualiza o estado e chama a função com debounce
	const handleChange = async (event: {
		target: { name: any; checked: any };
	}) => {
		const { name, checked } = event.target;
		// Atualizar o estado específico do switch
		setSwitchStates((prevStates) => ({
			...prevStates,
			[name]: checked, // Atualiza apenas o switch correspondente
		}));
		setPesquisaTickets({
			...pesquisaTickets,
			[event.target.name]: event.target.checked,
		});
	};

	const statusTickets = useCallback(
		debounce((novoStatus: string) => {
			setPesquisaTickets((prevPesquisaTickets: { status: any }) => {
				const { status } = prevPesquisaTickets;
				// Criar uma cópia do array de status atual
				let statusAtualizado: string[];

				if (status.includes(novoStatus)) {
					// Remover o status se ele já estiver no array
					statusAtualizado = status.filter((s: string) => s !== novoStatus);
				} else {
					// Adicionar o status se ele não estiver no array
					statusAtualizado = [...status, novoStatus];
				}

				// Retornar o novo estado com o status atualizado
				return {
					...prevPesquisaTickets, // Manter os outros campos do objeto
					status: statusAtualizado, // Atualizar apenas o campo status
				};
			});
		}, 700),
		[],
	);
	// Função que será chamada após o debounce
	const handleSearch = useCallback(
		debounce(async (term: string) => {
			setPesquisaTickets({
				...pesquisaTickets,
				searchParam: term,
			});
		}, 700),
		[],
	); // 10000ms = 10s

	// Atualiza o estado de pesquisa e chama a função debounced
	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		setSearchTerm(value);
		handleSearch(value); // Chama a função debounced
	};

	useEffect(() => {
		localStorage.setItem("filtrosAtendimento", JSON.stringify(pesquisaTickets));
	}, [pesquisaTickets]);

	useEffect(() => {
		useAtendimentoTicketStore.setState({
			redirectToChat: (ticketId: string) => {
				navigate(`/atendimento/${ticketId}`);
			},
		});
	}, []);

	useEffect(() => {
		setMensagens(tickets);
	}, [tickets]);
	const consultarTickets = async (paramsInit = {}) => {
		const params = {
			...pesquisaTickets,
			...paramsInit,
		};
		try {
			if (pesquisaTickets.status.lengh === 0) return;
			const { data } = await ConsultarTickets(params);
			loadTickets(data.tickets);
			setHasMore(data.hasMore);
		} catch (err) {
			console.error(err);
		}
	};
	const BuscarTicketFiltro = useCallback(async () => {
		// resetTickets();
		// setLoading(true);
		await consultarTickets(pesquisaTickets);
		// setLoading(false);
	}, [pesquisaTickets, resetTickets]);

	useEffect(() => {
		BuscarTicketFiltro();
	}, [pesquisaTickets, BuscarTicketFiltro]);

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ display: "flex" }}>
				<Drawer
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						"& .MuiDrawer-paper": {
							width: drawerWidth,
							boxSizing: "border-box",
						},
					}}
					variant={hideDrawer ? "permanent" : "temporary"}
					anchor="left"
				>
					<Box>
						<AppBar position="static">
							<Toolbar className="bg-zinc-100 text-zinc-500">
								<div className="flex flex-1 justify-between ">
									<div>
										<Button
											aria-controls="simple-menu"
											aria-haspopup="true"
											onClick={handleClickMenu}
											variant="contained"
											id="btn-admin"
											className="font-bold rounded-full text-black"
											endIcon={<ArrowDown size="12" />}
											style={{ textTransform: "none" }}
										>
											<div className="max-w-[120px] sm:max-w-[15ch] overflow-hidden text-ellipsis whitespace-nowrap">
												{username}
											</div>
										</Button>
										<Popover
											open={Boolean(anchorEl)}
											anchorEl={anchorEl}
											onClose={handleCloseMenu}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "left",
											}}
										>
											<div className="w-36 max-w-36">
												<ListItem
													className="hover:bg-zinc-200 cursor-pointer font-semibold"
													onClick={() => setAbriModalUsuario(true)}
												>
													Perfil
												</ListItem>
												<Divider />
												<ListItem
													className="hover:bg-zinc-200 cursor-pointer font-semibold"
													// onClick={() => { handleClose(); efetuarLogout(); }}
												>
													Sair
												</ListItem>
											</div>
										</Popover>
									</div>
									<Tooltip title="Home" arrow>
										<button onClick={() => navigate("/")}>
											<Home className="text-black" />
										</button>
									</Tooltip>
								</div>
							</Toolbar>
						</AppBar>
						<Divider />
						<Toolbar style={toolbarStyle}>
							<Tabs
								value={tabTickets}
								onChange={handleChangeTabs}
								aria-label="Vertical tabs example"
								sx={{ margin: "auto" }}
							>
								<Tooltip title="Conversas em Privadas" arrow>
									<Tab
										sx={{ borderRight: 1, borderColor: "divider" }}
										icon={
											<User
												className={`w-6 h-6 ${grupoAtivo === "enabled" ? "text-red-400" : ""}   `}
											/>
										}
										disableRipple
										className="relative"
										{...a11yProps(0, "private")}
									/>
								</Tooltip>

								<Tooltip title="Conversas em Grupo" arrow>
									<Tab
										icon={<Users className="w-6 h-6" />}
										{...a11yProps(1, "group")}
									/>
								</Tooltip>
							</Tabs>
						</Toolbar>
						<div className="flex items-center justify-around">
							{/* biome-ignore lint/a11y/useButtonType: <explanation> */}
							<button
								id="filtro-avancado"
								onClick={handleClickMenu}
								aria-controls="simple-menu2"
							>
								<FilterXIcon size="18" />
							</button>
							<Menu
								id="close-filtro"
								anchorEl={anchorEl2}
								keepMounted
								open={Boolean(anchorEl2)}
								onClose={handleCloseFilter}
								PaperProps={{ style: { minWidth: "350px", maxWidth: "350px" } }}
							>
								<span className="text-md flex justify-center">
									Filtros Avançados
								</span>
								<MenuItem>
									{profile === "admin" && (
										<>
											<div
												className={`flex items-center ml-4 ${switchStates.showAll ? "mb-4" : ""}`}
											>
												<Switch
													name="showAll"
													checked={switchStates.showAll}
													onChange={handleChange}
													color="primary"
												/>
												<label className="ml-2 text-sm text-gray-700">
													Visualizar Tickets
												</label>
											</div>
											{pesquisaTickets.showAll && <Divider />}
										</>
									)}
								</MenuItem>
								{!pesquisaTickets.showAll && (
									<div>
										<Divider />
										<SelectComponent
											cUserQueues={[]}
											pesquisaTickets={pesquisaTickets}
										/>
										<div className="my-4">
											<div className="space-y-2">
												{/* Abertos */}
												<label className="flex items-center space-x-2 p-2 bg-white shadow rounded-lg cursor-pointer">
													<input
														type="checkbox"
														className="form-checkbox text-blue-600"
														checked={pesquisaTickets.status.includes("open")}
														onChange={() => statusTickets("open")}
													/>
													<span>Abertos</span>
												</label>

												{/* Pendentes */}
												<label className="flex items-center space-x-2 p-2 bg-white shadow rounded-lg cursor-pointer">
													<input
														type="checkbox"
														className="form-checkbox text-red-600"
														checked={pesquisaTickets.status.includes("pending")}
														onChange={() => statusTickets("pending")}
													/>
													<span>Pendentes</span>
												</label>

												{/* Resolvidos */}
												<label className="flex items-center space-x-2 p-2 bg-white shadow rounded-lg cursor-pointer">
													<input
														type="checkbox"
														className="form-checkbox text-green-600"
														checked={pesquisaTickets.status.includes("closed")}
														onChange={() => statusTickets("closed")}
													/>
													<span>Resolvidos</span>
												</label>
											</div>
										</div>
										<Divider />

										<div className="flex items-center ml-4">
											<Switch
												checked={switchStates.withUnreadMessages}
												name="withUnreadMessages"
												onChange={handleChange}
												color="primary"
											/>
											<label className="ml-2 text-sm text-gray-700">
												Somente Tickets com mensagens não lidas
											</label>
										</div>
										<div className="flex items-center ml-4">
											<Switch
												checked={switchStates.isNotAssignedUser}
												name="isNotAssignedUser"
												onChange={handleChange}
												color="primary"
											/>
											<label className="ml-2 text-sm text-gray-700">
												Somente Tickets não atribuidos (sem usuário definido)
											</label>
										</div>
									</div>
								)}
								{!pesquisaTickets.showAll && <Divider />}
							</Menu>
							<div
								className="flex gap-1 items-center px-1 p-2  mt-2 rounded-xl border
                    "
							>
								<Search size="18" />
								<input
									type="search"
									name="searchParam"
									id=""
									className="px-2 py-1 outline-none w-36 bg-transparent text-sm "
									value={searchTerm}
									onChange={handleInputChange}
								/>
							</div>
							<div className="cursor-pointer">
								<Contact size="18" />
							</div>
						</div>
						{tabTickets === 0 && (
							<Tabs
								centered
								value={tabTicketsStatus}
								onChange={(event, newValue) => setTabTicketsStatus(newValue)}
							>
								<Tab label="Aberto" value="open" disableRipple />
								<Badge color="error" className="absolute left-0 top-0" />
								<Tab label="Pendente" value="pending" disableRipple />
								<Badge color="error" className="absolute left-0 top-0" />
								<Tab label="Fechado" value="closed" disableRipple />
								<Badge color="error" className="absolute left-0 top-0" />
								{/* {chatBotLane === "enabled" && (
                                    <Tab
                                        icon={<Settings />}
                                        label="Chatbot"
                                        value="chatbot"
                                        className={clsx(darkMode ? "text-white" : "text-black")}
                                        disableRipple
                                    />
                                )}
                                {chatBotLane === "enabled" && (
                                    <Badge
                                        badgeContent={pendingTicketsChatBot}
                                        color="error"
                                        className="absolute left-0 top-0"
                                    />
                                )}
                                {chatBotLane === "enabled" && (
                                    <Tooltip title="Conversas Privadas" className="bg-padrao text-gray-900 font-bold" />
                                )} */}
							</Tabs>
						)}
						{tabTickets === 1 && (
							<Tabs
								centered
								value={tabTicketsStatus}
								onChange={(event, newValue) => setTabTicketsStatus(newValue)}
							>
								<Tab label="Aberto" value="open" disableRipple />
								<Tab label="Pendente" value="pending" disableRipple />
								<Tab label="Fechado" value="closed" disableRipple />
							</Tabs>
						)}
						<TabPanel value={tabTickets} index={0}>
							<List
								disablePadding={true}
								sx={{
									width: "100%",
									maxWidth: 370,
									bgcolor: "background.paper",
									padding: 0,
								}}
							>
								{mensagens
									.filter((mensagem) => mensagem.status === tabTicketsStatus)
									.map((mensagem) => (
										<ItemTicket
											key={mensagem.id}
											ticket={mensagem}
											abrirChatContato={() => {}}
										/>
									))}
							</List>
						</TabPanel>
						<TabPanel value={tabTickets} index={1}>
							{tabTickets === 1 && tabTicketsStatus === "open" && (
								<div>open grupo</div>
							)}
							{tabTickets === 1 && tabTicketsStatus === "pending" && (
								<div>pendentes grupo</div>
							)}
							{tabTickets === 1 && tabTicketsStatus === "closed" && (
								<div>closed grupo</div>
							)}
						</TabPanel>
					</Box>
				</Drawer>
				<Outlet />
			</Box>
			<UsuarioModal
				modalUsuario={abriModalUsuario}
				isProfile={true}
				fecharModal={() => setAbriModalUsuario(false)}
				usuarioEdicao={{
					id: usuario.userId,
					email: usuario.email,
					tenantId: usuario.tenantId,
					username: usuario.username,
					profile: usuario.profile,
				}}
			/>
		</Container>
	);
};
