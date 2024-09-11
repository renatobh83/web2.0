import {
	AppBar,
	IconButton,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import { AlignVerticalDistributeCenter, MenuIcon } from "lucide-react";
import { useState } from "react";

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
		<div className="h-screen">
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
			<aside
				className={` ${leftDrawerOpen ? "w-64" : "w-20 hidden"}  sm:flex transition-all  bg-slate-200`}
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
		</div>
	);
};
