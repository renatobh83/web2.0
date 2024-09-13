import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";

import {
	DrawerHeader,
	MiniDrawer,
} from "../components/MainLayoutComponents/Draw";
import { useWhatsappStore } from "../store/whatsapp";
import { useCallback, useEffect } from "react";
import { ListarWhatsapps } from "../services/sessoesWhatsapp";
import { ListarConfiguracoes } from "../services/configuracoes";
import { ConsultarTickets } from "../services/tickets";
import { toast } from "sonner";
import { useNotificationsStore } from "../store/notifications";

export const MainLayout = () => {
	const loadWhatsApps = useWhatsappStore((s) => s.loadWhatsApps);
	const updateNotifications = useNotificationsStore(
		(s) => s.updateNotifications,
	);
	const updateNotificationsP = useNotificationsStore(
		(s) => s.updateNotificationsP,
	);
	const listarWhatsapps = useCallback(async () => {
		const { data } = await ListarWhatsapps();
		loadWhatsApps(data);
	}, [loadWhatsApps]);

	const listarConfiguracoes = useCallback(async () => {
		const { data } = await ListarConfiguracoes();
		localStorage.setItem("configuracoes", JSON.stringify(data));
	}, []);

	const consultarTickets = useCallback(async () => {
		const params = {
			searchParam: "",
			pageNumber: 1,
			status: ["open", "pending"],
			showAll: false,
			count: null,
			queuesIds: [],
			withUnreadMessages: true,
			isNotAssignedUser: false,
			includeNotQueueDefined: true,
			// date: new Date(),
		};
		try {
			const { data } = await ConsultarTickets(params);
			updateNotifications(data);
			setTimeout(() => {
				updateNotifications(data);
			}, 500);
			// this.$store.commit('SET_HAS_MORE', data.hasMore)
		} catch (err) {
			toast.error("Algum problema ao consultar tickets");
			console.error(err);
		}
		const params2 = {
			searchParam: "",
			pageNumber: 1,
			status: ["pending"],
			showAll: false,
			count: null,
			queuesIds: [],
			withUnreadMessages: false,
			isNotAssignedUser: false,
			includeNotQueueDefined: true,
			// date: new Date(),
		};
		try {
			const { data } = await ConsultarTickets(params2);

			// this.$store.commit("UPDATE_NOTIFICATIONS_P", data);
			updateNotificationsP(data);
			setTimeout(() => {
				updateNotificationsP(data);
			}, 500);
			// this.$store.commit('SET_HAS_MORE', data.hasMore)
			// console.log(this.notifications)
		} catch (err) {
			toast.error("Algum problema ao consultar tickets 5");
			console.error(err);
		}
	}, [updateNotificationsP, updateNotifications]);

	useEffect(() => {
		listarWhatsapps();
		listarConfiguracoes();
		consultarTickets();
	}, [listarWhatsapps, listarConfiguracoes, consultarTickets]);

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
