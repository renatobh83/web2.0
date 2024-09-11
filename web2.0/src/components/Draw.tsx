import * as React from "react";
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
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

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

const DrawerHeader = styled("div")(({ theme }) => ({
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
	const theme = useTheme();
	const [open, setOpen] = React.useState(false);

	const handleDrawerOpen = () => {
		setOpen(true);
	};

	const handleDrawerClose = () => {
		setOpen(false);
	};

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar position="fixed" open={open}>
				<Toolbar>
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
					<Typography variant="h6" noWrap component="div">
						Mini variant drawer
					</Typography>
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
				<List>
					{["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
						<ListItem key={text} disablePadding sx={{ display: "block" }}>
							<ListItemButton
								sx={[
									{
										minHeight: 48,
										px: 2.5,
									},
									open
										? {
												justifyContent: "initial",
											}
										: {
												justifyContent: "center",
											},
								]}
							>
								<ListItemIcon
									sx={[
										{
											minWidth: 0,
											justifyContent: "center",
										},
										open
											? {
													mr: 3,
												}
											: {
													mr: "auto",
												},
									]}
								>
									{/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
								</ListItemIcon>
								<ListItemText
									primary={text}
									sx={[
										open
											? {
													opacity: 1,
												}
											: {
													opacity: 0,
												},
									]}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
				<Divider />
				<List>
					{["All mail", "Trash", "Spam"].map((text, index) => (
						<ListItem key={text} disablePadding sx={{ display: "block" }}>
							<ListItemButton
								sx={[
									{
										minHeight: 48,
										px: 2.5,
									},
									open
										? {
												justifyContent: "initial",
											}
										: {
												justifyContent: "center",
											},
								]}
							>
								<ListItemIcon
									sx={[
										{
											minWidth: 0,
											justifyContent: "center",
										},
										open
											? {
													mr: 3,
												}
											: {
													mr: "auto",
												},
									]}
								>
									{/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
								</ListItemIcon>
								<ListItemText
									primary={text}
									sx={[
										open
											? {
													opacity: 1,
												}
											: {
													opacity: 0,
												},
									]}
								/>
							</ListItemButton>
						</ListItem>
					))}
				</List>
			</Drawer>
			{children}
		</Box>
	);
};
