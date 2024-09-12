import type React from "react";
import { useEffect, useRef, useState } from "react";
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
import { useUsuarioStore } from "../../store/usuarios";
import { toast } from "sonner";
import { CriarUsuario, UpdateUsuarios } from "../../services/user";

export interface Usuario {
	id: string | undefined;
	name?: string | null;
	email?: string;
	password?: string;
	profile: string | null;
	tenantId?: string | null;
	queues?: any;
	userId?: string;
}

export const ModalUsuario: React.FC<{
	isProfile?: boolean;
}> = ({ isProfile = false }) => {

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue, reset
	} = useForm<Usuario>({
		defaultValues: {
			id: "",
			name: "",
			email: "",
			password: "",
			profile: "",
			tenantId: ""
		},
	});

	const usuarioSelecionado = useUsuarioStore(s => s.usuarioSelecionado)
	const editarUsuario = useUsuarioStore(s => s.editarUsuario)
	const criarUsuario = useUsuarioStore(s => s.criarUsuario)
	const modalUsuario = useUsuarioStore(s => s.modalUsuario)
	const toggleModalUsuario = useUsuarioStore(s => s.toggleModalUsuario)

	const [isPwd, setIsPwd] = useState(true);
	const isAdmin = useUserStore((s) => s.isAdmin);

	const optionsProfile = [
		{ value: "user", label: "Usuário" },
		{ value: "super", label: "Supervisor" },
		{ value: "admin", label: "Administrador" },
	];
	useEffect(() => {
		if (!modalUsuario) {
			reset(); // Redefine para os valores padrão
		}
	}, [modalUsuario, reset]);
	useEffect(() => {
		console.log('load')
	}, []);

	useEffect(() => {

		if (usuarioSelecionado?.userId && isProfile) {
			setValue("id", usuarioSelecionado.userId);
			setValue("name", usuarioSelecionado.username || usuarioSelecionado.name);
			setValue("profile", usuarioSelecionado.profile);
			setValue("email", usuarioSelecionado.email);
			setValue("tenantId", usuarioSelecionado.tenantId)
		}
		if (usuarioSelecionado?.id) {
			setValue("id", usuarioSelecionado.userId);
			setValue("name", usuarioSelecionado.username || usuarioSelecionado.name);
			setValue("profile", usuarioSelecionado.profile);
			setValue("email", usuarioSelecionado.email);
			setValue("tenantId", usuarioSelecionado.tenantId)
		}
		// 	setValue("id", usuarioSelecionado.userId);
		// 	setValue("name", usuarioSelecionado.username || usuarioSelecionado.name);
		// 	setValue("profile", usuarioSelecionado.profile);
		// 	setValue("email", usuarioSelecionado.email);
		// 	setValue("tenantId", usuarioSelecionado.tenantId)
		// }
	}, [usuarioSelecionado, setValue]);
	const handleUsuario = async (dataForm: Usuario) => {
		if (usuarioSelecionado) {
			const { email, id, name, tenantId, password, profile } = dataForm
			const params = { email, id, name, tenantId, password, profile }
			const { data } = await UpdateUsuarios(usuarioSelecionado.id, params)
			editarUsuario(data)
			toast.success('Usuario editado com suscesso', {
				position: 'top-right'
			})
			reset()
			toggleModalUsuario()
		} else {
			try {
				const { data } = await CriarUsuario(dataForm)
				criarUsuario(data)
				toast.success('Usuario Criado com suscesso', {
					position: 'top-right'
				})
				reset()
				toggleModalUsuario()
			} catch (error) {
				toast.error(`${error?.data.error}`, {
					position: 'top-right'
				})
			}
		}
	};

	return (
		<Dialog open={modalUsuario} fullWidth maxWidth="sm">
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

						/>
						<TextField
							label="E-mail"
							variant="outlined"
							fullWidth
							{...register("email", { required: true })}
							error={!!errors.email}
							helperText={errors.email ? "E-mail é obrigatório" : ""}
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
							{...register("profile", { required: "Perfil é obrigatório" })}
							error={!!errors.profile}
							value={isProfile ? usuarioSelecionado?.profile : undefined}
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
					<Button variant="contained" color="error" onClick={toggleModalUsuario}>
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
