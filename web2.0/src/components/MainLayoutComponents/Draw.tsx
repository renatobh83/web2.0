import * as React from "react";
import { Fragment, useState } from "react";
import {
	styled,
	useTheme,
	type Theme,
	type CSSObject,
} from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
	type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import {
	PopoverButton,
	PopoverPanel,
	Transition,
	Popover,
} from "@headlessui/react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
	BellIcon,
	ChevronLeft,
	ChevronRight,
	LogOutIcon,
	Menu,
	User,
	UserCircleIcon,
} from "lucide-react";
import { Avatar, Tooltip } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { MenuComponent } from "./MenuComponent";
import { useNotificationsStore } from "../../store/notifications";
import TicketList from "./TicketList";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
	width: drawerWidth,
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.enteringScreen,
	}),
	overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
	transition: theme.transitions.create("width", {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	overflowX: "hidden",
	width: `calc(${theme.spacing(7)} + 1px)`,
	[theme.breakpoints.up("sm")]: {
		width: `calc(${theme.spacing(8)} + 1px)`,
	},
});

export const DrawerHeader = styled("div")(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	justifyContent: "flex-end",
	padding: theme.spacing(0, 1),
	// necessary for content to be below app bar
	...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}

const AppBar = styled(MuiAppBar, {
	shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
	zIndex: theme.zIndex.drawer + 1,
	transition: theme.transitions.create(["width", "margin"], {
		easing: theme.transitions.easing.sharp,
		duration: theme.transitions.duration.leavingScreen,
	}),
	variants: [
		{
			props: ({ open }) => open,
			style: {
				marginLeft: drawerWidth,
				width: `calc(100% - ${drawerWidth}px)`,
				transition: theme.transitions.create(["width", "margin"], {
					easing: theme.transitions.easing.sharp,
					duration: theme.transitions.duration.enteringScreen,
				}),
			},
		},
	],
}));

const Drawer = styled(MuiDrawer, {
	shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
	width: drawerWidth,
	flexShrink: 0,
	whiteSpace: "nowrap",
	boxSizing: "border-box",
	variants: [
		{
			props: ({ open }) => open,
			style: {
				...openedMixin(theme),
				"& .MuiDrawer-paper": openedMixin(theme),
			},
		},
		{
			props: ({ open }) => !open,
			style: {
				...closedMixin(theme),
				"& .MuiDrawer-paper": closedMixin(theme),
			},
		},
	],
}));
export const MiniDrawer: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [usuario, setUsuario] = useState(
		JSON.parse(localStorage.getItem("usuario") || "null"),
	);
	const profile = localStorage.getItem("profile") || null;

	const notifications = useNotificationsStore((s) => s.notifications);
	const notificationsP = useNotificationsStore((s) => s.notificationsP);
	const [miniState, setMiniState] = useState(true);
	const username = localStorage.getItem("username");
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
		setMiniState(false);
	};

	const handleDrawerClose = () => {
		setOpen(false);
		setMiniState(true);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar className="bg-zinc-100 text-zinc-600">
					<IconButton
						color="inherit"
						aria-label="open drawer"
						onClick={handleDrawerOpen}
						edge="start"
						sx={[
							{
								marginRight: 5,
							},
							open && { display: "none" },
						]}
					>
						<Menu />
					</IconButton>
					<div className="flex flex-1 items-center justify-end space-x-4 mr-1">
						<Tooltip title="Notificações" arrow placement="left">
							<Popover className="relative">
								<PopoverButton className="relative p-2 text-gray-500 rounded-full hover:bg-gray-200">
									<BellIcon className="h-6 w-6" />
									{Number.parseInt(notifications.count) +
										Number.parseInt(notificationsP.count) >
										0 && (
											<>
												<span className="absolute top-0 right-0 block h-1 w-1 rounded-full  ring-white bg-red-400" />
												<span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs font-bold px-2 py-1 rounded-full">
													{Number.parseInt(notifications.count) +
														Number.parseInt(notificationsP.count)}
												</span>
											</>
										)}
								</PopoverButton>
								<Transition
									as={Fragment}
									enter="transition ease-out duration-200"
									enterFrom="opacity-0 translate-y-1"
									enterTo="opacity-100 translate-y-0"
									leave="transition ease-in duration-150"
									leaveFrom="opacity-100 translate-y-0"
									leaveTo="opacity-0 translate-y-1"
								>
									<PopoverPanel className="absolute mt-3 z-10 min-w-[300px] right-0 bg-white shadow-lg rounded-md">
										<div>
											{Number.parseInt(notifications.count) +
												Number.parseInt(notificationsP.count) ===
												0 ? (
												<div className="p-4 text-sm text-gray-500 mr-10">
													Nada de novo por aqui!
												</div>
											) : (
												<div className="space-y-2">
													<div className="flex items-center cursor-pointer p-2 border-b border-gray-200">
														<div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-400 text-white ">
															{notificationsP?.count}
														</div>
														<span className="ml-4 text-sm font-bold tracking-tighter">
															Clientes pendentes na fila
														</span>
													</div>

													<div className="container mx-auto">
														<div className="p-4 gap-2 flex flex-col cursor-pointer">
															{notificationsP.tickets.map(ticket => (
																<div key={ticket.id} className="border-b-2 m-1 flex gap-2">
																	<div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
																		<img
																			src={ticket.profilePicUrl}
																			alt={ticket.name}
																			className="w-full h-full object-cover"
																		/>
																	</div>
																	<div className="flex-1 ">
																		<div className="text-sm font-bold min-h-0 ">
																			{ticket.name}
																		</div>
																		<div className="max-w-[20em] pt-0 overflow-hidden text-xs max-h-[3rem]">
																			<b className="text-xs mr-1">Mensagem:</b>
																			{ticket.lastMessage}
																		</div>
																	</div>
																</div>
															))}
														</div>
														{/* <TicketList max-w-[15em] block overflow-hidden whitespace-pre-wrap max-h-[1.5rem]
															notifications={notificationsP}
															abrirAtendimentoExistente={() => { }}
														/> */}
													</div>
												</div>
											)}
										</div>
									</PopoverPanel>
								</Transition>
							</Popover>
						</Tooltip>
						{/* TODO : remover ? do usuario quando estiver logado */}
						<Tooltip
							title={
								usuario?.status === "offline"
									? "Usuário Offiline"
									: "Usuário Online"
							}
						>
							<Avatar
								sx={{
									width: 26,
									height: 26,
									bgcolor:
										usuario?.status === "offline" ? red[400] : green[400],
								}}
							/>
						</Tooltip>
						<Popover className="relative">
							<PopoverButton className="flex items-center p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600">
								<UserCircleIcon className="h-6 w-6" />
								<span className="ml-2">{username}</span>
							</PopoverButton>
							<Transition
								as={Fragment}
								enter="transition ease-out duration-200"
								enterFrom="opacity-0 translate-y-1"
								enterTo="opacity-100 translate-y-0"
								leave="transition ease-in duration-150"
								leaveFrom="opacity-100 translate-y-0"
								leaveTo="opacity-0 translate-y-1"
							>
								<PopoverPanel className="absolute right-0 z-10 mt-3 w-48 bg-white shadow-lg rounded-md">
									<ul className="px-2">
										<li className="p-2 text-gray-800">
											<div className="font-medium text-[.752rem]">
												Olá! <b>{username}Renato</b>
											</div>
										</li>

										{/* Componente de status do usuário */}
										<li className="py-2 cursor-pointer ">
											{/* <UserStatus usuario={usuario} onUpdate={handleUpdateUser} /> */}
										</li>

										{/* Opção de Perfil */}
										<li className="p-2 cursor-pointer hover:bg-gray-100">
											<div className="px-4 flex gap-4">
												<User size="20" />
												<span className="text-base font-medium tracking-tighter">
													{" "}
													Perfil
												</span>
											</div>
										</li>

										{/* Opção de Sair */}
										<li
											className="p-2 cursor-pointer hover:bg-gray-100"
										//onClick={handleLogout}
										>
											<div className="px-4 flex gap-4">
												<LogOutIcon size="20" />
												<span className="text-base font-medium tracking-tighter">
													Sair
												</span>
											</div>
										</li>

										<li className="my-2">
											<hr className="border-gray-300" />
										</li>

										{/* Componente de versão do sistema */}
										<li className="p-1">{/* <SystemVersion /> */}</li>
									</ul>
								</PopoverPanel>
							</Transition>
						</Popover>
					</div>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				open={open}
				onMouseOver={handleDrawerOpen}
				onMouseOut={handleDrawerClose}
			>
				<DrawerHeader>
					<IconButton onClick={handleDrawerClose}>
						{theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<MenuComponent userProfile={profile} state={miniState} />
			</Drawer>
			{children}
		</Box>
	);
};
