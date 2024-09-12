import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { Login } from "./pages/Login";
import { useAuth } from "./context/AuthContext";
import { MainLayout } from "./layout/MainLayout";
import { Dasboard } from "./pages/Dasboard";
import { Atendimento } from "./pages/Atendimento";
import { Chat } from "./pages/Chat";
import { Usuarios } from "./pages/Usuario";
import { Contatos } from "./pages/Contatos";

const AppRoutes = () => {
	const { isAuthenticated } = useAuth();

	return (
		<>
			<Routes>
				<Route path="/login" element={<Login />} />
				{isAuthenticated ? (
					<>
						<Route path="/" element={<MainLayout />}>
							<Route index element={<Dasboard />} />
							<Route path="/usuarios" element={<Usuarios />} />
							<Route path="/contatos" element={<Contatos isChatContact={false} />} />
						</Route>
						<Route path="/atendimento" element={<Atendimento />}>
							<Route path=":ticketId" element={<Chat />} />
						</Route>
					</>
				) : (
					<Route path="*" element={<Navigate to="/login" />} />
				)}
			</Routes>
			<Toaster />
		</>
	);
};
export function App() {
	return <AppRoutes />;
}
