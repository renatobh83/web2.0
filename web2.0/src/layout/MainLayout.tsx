import {
	AppBar,
	Box,
	Container,
	Drawer,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { AlignVerticalDistributeCenter, MenuIcon } from "lucide-react";
import { useState } from "react";
import { MiniDrawer } from "../components/Draw";

export const MainLayout = () => {
	const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
	const [miniState, setMiniState] = useState(true);

	const menutransition = (e: { nativeEvent: { type: string } }) => {
		if (e.nativeEvent.type === "mouseover") {
			setLeftDrawerOpen(true);
			setMiniState(false);
		} else if (e.nativeEvent.type === "mouseout") {
			setLeftDrawerOpen(false);
			setMiniState(true);
		} else {
			setLeftDrawerOpen(!leftDrawerOpen);
			setMiniState(!miniState);
		}
	};
	return (
		<Container maxWidth={false} disableGutters>
			<AppBar position="static" color="transparent">
				<Toolbar>
					<Tooltip title="Menu" arrow>
						<IconButton
							onClick={menutransition}
							size="large"
							edge="start"
							color="inherit"
							aria-label="menu"
							sx={{ mr: 2 }}
						>
							<MenuIcon />
						</IconButton>
					</Tooltip>
					<div className="flex-1 flex justify-end">
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar"
							aria-haspopup="true"
							// onClick={handleMenu}
							color="inherit"
						>
							<AlignVerticalDistributeCenter />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
			<MiniDrawer>
				<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
					{/* <DrawerHeader /> */}
					<Typography sx={{ marginBottom: 2 }}>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
						eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
						dolor purus non enim praesent elementum facilisis leo vel. Risus at
						ultrices mi tempus imperdiet. Semper risus in hendrerit gravida
						rutrum quisque non tellus. Convallis convallis tellus id interdum
						velit laoreet id donec ultrices. Odio morbi quis commodo odio aenean
						sed adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
						integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
						eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
						quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
						vivamus at augue. At augue eget arcu dictum varius duis at
						consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
						donec massa sapien faucibus et molestie ac.
					</Typography>
					<Typography sx={{ marginBottom: 2 }}>
						Consequat mauris nunc congue nisi vitae suscipit. Fringilla est
						ullamcorper eget nulla facilisi etiam dignissim diam. Pulvinar
						elementum integer enim neque volutpat ac tincidunt. Ornare
						suspendisse sed nisi lacus sed viverra tellus. Purus sit amet
						volutpat consequat mauris. Elementum eu facilisis sed odio morbi.
						Euismod lacinia at quis risus sed vulputate odio. Morbi tincidunt
						ornare massa eget egestas purus viverra accumsan in. In hendrerit
						gravida rutrum quisque non tellus orci ac. Pellentesque nec nam
						aliquam sem et tortor. Habitant morbi tristique senectus et.
						Adipiscing elit duis tristique sollicitudin nibh sit. Ornare aenean
						euismod elementum nisi quis eleifend. Commodo viverra maecenas
						accumsan lacus vel facilisis. Nulla posuere sollicitudin aliquam
						ultrices sagittis orci a.
					</Typography>
				</Box>
			</MiniDrawer>

			<aside
			// className={` ${leftDrawerOpen ? "w-64" : "w-20 hidden"}  sm:flex transition-all  bg-slate-200`}
			>
				{/* biome-ignore lint/a11y/useKeyWithMouseEvents: <explanation> */}
				<div
					onMouseOver={(e) => menutransition(e)}
					onMouseOut={(e) => menutransition(e)}
					className="h-full p-4"
				>
					{/* <MenuComponent userProfile="admin" state={miniState} /> */}
				</div>
			</aside>
		</Container>
	);
};
