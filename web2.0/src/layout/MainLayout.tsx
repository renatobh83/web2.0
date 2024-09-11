import { Outlet } from "react-router-dom";
import {
	Box,
	Container,

} from "@mui/material";

import { DrawerHeader, MiniDrawer } from "../components/MainLayoutComponents/Draw";

export const MainLayout = () => {

	return (
		<Container maxWidth={false} disableGutters>
			<MiniDrawer>
				<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
					<DrawerHeader />
					<Outlet />
				</Box>
			</MiniDrawer>
		</Container>
	);
};
