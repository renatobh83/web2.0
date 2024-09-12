import type React from "react";
import { useEffect, useState } from "react";
import {
	Dialog,
	Card,
	CardContent,
	CardActions,
	Button,
	IconButton,
	TextField,
	Select,
	MenuItem,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { useUserStore } from "../../store/user";

interface Usuario {
	id: string | null;
	name: string | null;
	email?: string;
	password?: string;
	profile: string | null;
	tenantId?: string | null;
}

export const UsuarioModal: React.FC<{
	modalUsuario: boolean;
	fecharModal: () => void;
	isProfile?: boolean;
	usuarioEdicao?: Usuario;
}> = ({ modalUsuario, fecharModal, isProfile = false, usuarioEdicao }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Usuario>();

	const [isPwd, setIsPwd] = useState(true);
	const isAdmin = useUserStore((s) => s.isAdmin);
	const [usuario, setUsuario] = useState<Usuario>({
		id: "",
		name: "",
		email: "",
		password: "",
		profile: "",
	});

	const optionsProfile = [
		{ value: "user", label: "Usuário" },
		{ value: "super", label: "Supervisor" },
		{ value: "admin", label: "Administrador" },
	];

	useEffect(() => {
		if (usuarioEdicao?.id) {
			setUsuario(() => {
				return {
					...usuarioEdicao,
					id: usuarioEdicao?.id,
					name: usuarioEdicao?.username,
					profile: usuarioEdicao?.profile,
				};
			});
		}
	}, [usuarioEdicao]);
	const handleUsuario = (data: Usuario) => {
		console.log("Salvar usuário:", data, isAdmin);
		if (usuario.id) {
			const { email, id, name, tenantId, password, profile } = usuario;

			const params = { email, id, name, tenantId, password, profile };
			console.log(params);
		}
	};

	return (
		<Dialog open={modalUsuario} onClose={fecharModal} fullWidth maxWidth="sm">
			<Card className="w-full">
				<CardContent className="space-y-4">
					<div className="text-xl font-semibold">
						{isProfile ? "Editar Cadastro" : "Cadastrar Usuário"}
					</div>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							label="Nome"
							variant="outlined"
							fullWidth
							{...register("name", { required: true })}
							error={!!errors.name}
							helperText={errors.name ? "Nome é obrigatório" : ""}
							value={usuario.name}
							onChange={(e) => setUsuario({ ...usuario, name: e.target.value })}
						/>
						<TextField
							label="E-mail"
							variant="outlined"
							fullWidth
							{...register("email", { required: true })}
							error={!!errors.email}
							helperText={errors.email ? "E-mail é obrigatório" : ""}
							value={usuario.email}
							onChange={(e) =>
								setUsuario({ ...usuario, email: e.target.value })
							}
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<TextField
							label="Senha"
							variant="outlined"
							fullWidth
							type={isPwd ? "password" : "text"}
							{...register("password", { required: true })}
							error={!!errors.password}
							helperText={errors.password ? "Senha é obrigatória" : ""}
							value={usuario.password}
							onChange={(e) =>
								setUsuario({ ...usuario, password: e.target.value })
							}
							InputProps={{
								endAdornment: (
									<IconButton onClick={() => setIsPwd(!isPwd)}>
										{isPwd ? <EyeOff /> : <Eye />}
									</IconButton>
								),
							}}
						/>
						<Select
							label="Perfil"
							value={usuario.profile}
							onChange={(e) =>
								setUsuario({ ...usuario, profile: e.target.value as string })
							}
							fullWidth
							disabled={isProfile}
							variant="outlined"
						>
							{optionsProfile.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</Select>
					</div>
				</CardContent>
				<CardActions className="justify-end">
					<Button variant="contained" color="error" onClick={fecharModal}>
						Sair
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSubmit(handleUsuario)}
					>
						Salvar
					</Button>
				</CardActions>
			</Card>
		</Dialog>
	);
};
