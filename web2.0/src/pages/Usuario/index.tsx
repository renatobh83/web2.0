import React, { useCallback, useEffect, useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	IconButton,
	Tooltip,
	Button,
} from "@mui/material";
import { Edit, Delete, Rows4Icon, CircleX } from "lucide-react";
import { DeleteUsuario, ListarUsuarios } from "../../services/user";
import { ModalUsuario, Usuario } from "./ModalUsuarios";
import { useUsuarioStore } from "../../store/usuarios";
import { ModalFilaUsuario } from "./ModalFilaUsuarios";
import { ListarFilas } from "../../services/filas";
import { toast } from "sonner";

export const Usuarios: React.FC = () => {
	const {
		usuarios,
		editarUsuario,
		deletarUsuario,
		toggleModalUsuario,
		setUsuarioSelecionado,
		loadUsuarios,
		toggleModalFilaUsuario,
	} = useUsuarioStore();
	const [filter, setFilter] = useState("");
	const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 5 });
	const [loading, setLoading] = useState(false);
	const [filas, setFilas] = useState([]);
	const [params, setParams] = useState({
		pageNumber: 1,
		searchParam: null,
		hasMore: true,
	});

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFilter(e.target.value);
	};

	const handlePageChange = (event: unknown, newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};

	const handleRowsPerPageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPagination({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
	};

	const filteredUsuarios = usuarios.filter((user) =>
		user.name.toLowerCase().includes(filter.toLowerCase()),
	);
	const listarUsuarios = useCallback(async () => {
		setLoading(true);
		const { data } = await ListarUsuarios(params);
		loadUsuarios(data.users);
		setParams((prev) => {
			return {
				...prev,
				hasMore: data.hasMore,
			};
		});
		setLoading(false);
	}, []);
	const listarFilas = useCallback(async () => {
		const { data } = await ListarFilas();
		setFilas(data);
	}, []);
	useEffect(() => {
		listarFilas();
		listarUsuarios();
	}, []);

	const gerirFilasUsuario = (usuario: Usuario) => {
		setUsuarioSelecionado(usuario);
		toggleModalFilaUsuario();
	};
	const handlEditarUsuario = (usuario: Usuario) => {
		setUsuarioSelecionado(usuario);
		toggleModalUsuario();
	};
	const handleDeleteUsuario = (usuario: Usuario) => {
		toast.info(
			`Atenção!! Deseja realmente deletar o usuario "${usuario.name}"?`,
			{
				position: "top-right",
				cancel: {
					label: "Cancel",
					onClick: () => console.log("Cancel!"),
				},
				action: {
					label: "Confirma",
					onClick: () => {
						DeleteUsuario(usuario.id).then(() => {
							toast.success("Usuario apagado", {
								position: "top-right",
							});
							listarUsuarios();
						});
					},
				},
			},
		);
	};

	if (loading) {
		return <div>Carregando...</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex justify-between items-center">
				<TextField
					label="Localize"
					variant="filled"
					size="small"
					className="w-72"
					value={filter}
					onChange={handleFilterChange}
				/>
				<Button
					variant="contained"
					color="primary"
					onClick={() => {
						setUsuarioSelecionado(null), toggleModalUsuario();
					}}
				>
					Adicionar
				</Button>
			</div>
			<TableContainer className="mt-4">
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Nome</TableCell>
							<TableCell>Ações</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsuarios
							.slice(
								pagination.page * pagination.rowsPerPage,
								pagination.page * pagination.rowsPerPage +
									pagination.rowsPerPage,
							)
							.map((usuario) => (
								<TableRow key={usuario.id}>
									<TableCell>{usuario.id}</TableCell>
									<TableCell>{usuario.name}</TableCell>
									<TableCell>
										<div className="flex space-x-2 justify-center">
											<Tooltip title="Gestão de Filas do usuário">
												<IconButton onClick={() => gerirFilasUsuario(usuario)}>
													<Rows4Icon />
												</IconButton>
											</Tooltip>
											<Tooltip title="Editar usuário">
												<IconButton onClick={() => handlEditarUsuario(usuario)}>
													<Edit />
												</IconButton>
											</Tooltip>
											<Tooltip title="Apagar usuário">
												<IconButton
													onClick={() => handleDeleteUsuario(usuario)}
												>
													<CircleX color="red" />
												</IconButton>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={filteredUsuarios.length}
				page={pagination.page}
				onPageChange={handlePageChange}
				rowsPerPage={pagination.rowsPerPage}
				onRowsPerPageChange={handleRowsPerPageChange}
			/>

			{/* Modal para editar/criar usuário */}
			<ModalUsuario />
			{/* Modal para gerir filas */}
			<ModalFilaUsuario filas={filas} />
		</div>
	);
};
