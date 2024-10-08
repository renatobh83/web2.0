import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";

// import { useWebSocket } from './WebSocketContext.js';
import { toast } from "sonner";
import { RealizarLogin } from "../services/login.js";
import { useUserStore } from "../store/user.js";
import { socketIO } from "../utils/socket.js";

interface AuthContextType {
	isAuthenticated: boolean;
	login: (form: any) => void;
	logout: () => void;

}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

const pesquisaTicketsFiltroPadrao = {
	searchParam: "",
	pageNumber: 1,
	status: ["open", "pending"],
	showAll: false,
	count: null,
	queuesIds: [],
	withUnreadMessages: false,
	isNotAssignedUser: false,
	includeNotQueueDefined: true,
	// date: new Date(),
};
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	// const { socket } = useWebSocket()
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(true); // Estado de carregamento

	const setUserState = useUserStore((s) => s.setUserState);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}

		setLoading(false);
	}, []);

	const login = async (form: any) => {
		try {
			const { data } = await RealizarLogin(form);

			localStorage.setItem("token", JSON.stringify(data.token));
			localStorage.setItem("username", data.username);
			localStorage.setItem("profile", data.profile);
			localStorage.setItem("userId", data.userId);
			localStorage.setItem("usuario", JSON.stringify(data));
			localStorage.setItem("queues", JSON.stringify(data.queues));
			localStorage.setItem("queues", JSON.stringify(data.queues));
			localStorage.setItem(
				"filtrosAtendimento",
				JSON.stringify(pesquisaTicketsFiltroPadrao),
			);

			if (data?.configs?.filtrosAtendimento) {
				localStorage.setItem(
					"filtrosAtendimento",
					JSON.stringify(data.configs.filtrosAtendimento),
				);
			}
			setUserState(data);

			// IMPLEMENTAR SOCKET
			const ws = socketIO()
			ws.emit(`${data.tenantId}:setUserActive`)
			ws.disconnect()
			ws.close()

			toast.success("Login realizado com sucesso!");
			if (data.profile === "admin") {
				// window.location.href = "/";
				// rota dash
			} else {
				window.location.href = "/";
				// 'rota atendimento'
			}
		} catch (error) {
			console.log(error);
		}

		// localStorage.setItem('token', token);
		setIsAuthenticated(true);
	};

	const logout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
	};

	if (loading) {
		return <div>Loading...</div>; // Renderiza um estado de carregamento enquanto verifica o token
	}
	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
