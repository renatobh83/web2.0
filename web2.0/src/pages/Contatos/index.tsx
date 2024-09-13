import {
	Avatar,
	Button,
	IconButton,
	styled,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TablePagination,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import classNames from "classnames";
import {
	DeleteIcon,
	EditIcon,
	ExpandIcon,
	Import,
	MessageCircle,
	SearchIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { ListarContatos } from "../../services/contatos";
import { useContatosStore } from "../../store/contatos";
import { ContatoModal } from "./ContatoModal";
import { useWhatsappStore } from "../../store/whatsapp";
import { toast } from "sonner";
const CustomTableContainer = styled(TableContainer)(({ theme }) => ({
	// Customize styles with Tailwind CSS classes
	padding: theme.spacing(2),
	width: "100%",
	borderRadius: theme.shape.borderRadius,
	boxShadow: theme.shadows[3],
	"& .MuiTableCell-root": {
		padding: theme.spacing(1),
	},
}));

export const Contatos: React.FC<{
	isChatContact: boolean;
}> = ({ isChatContact = false }) => {
	const [filter, setFilter] = useState("");
	const [modalOpen, setModalOpen] = useState(false);

	const handleEdit = (id: string) => {
		console.log(`Edit contact ${id}`);
	};

	const handleDelete = (id: string) => {
		console.log(`Delete contact ${id}`);
	};

	const handleImport = () => {
		console.log("Import contacts");
	};

	const handleExport = () => {
		console.log("Export contacts");
	};
	const rows = [];
	const [loading, setLoading] = useState(false);
	const [params, setParams] = useState({
		pageNumber: 1,
		searchParam: null,
		hasMore: true,
	});

	const [pagination, setPagination] = useState({ page: 0, rowsPerPage: 5 });
	const loadContacts = useContatosStore((s) => s.loadContacts);
	const contatos = useContatosStore((s) => s.contatos);
	const whatsapp = useWhatsappStore((s) => s.whatsApps);

	const handlePageChange = (event: unknown, newPage: number) => {
		setPagination((prev) => ({ ...prev, page: newPage }));
	};
	const handleRowsPerPageChange = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setPagination({ page: 0, rowsPerPage: parseInt(event.target.value, 10) });
	};
	const listarContatos = useCallback(async () => {
		setLoading(true);
		const { data } = await ListarContatos(params);

		setParams((prev) => {
			return {
				...prev,
				hasMore: data.hasMore,
			};
		});
		loadContacts(data.contacts);
		setLoading(false)
	}, []);

	const handleSaveTicket = async (contact: { id: any }, channel: any) => {
		if (!contact.id) return;
		const itens = [];
		const channelId = null;
		whatsapp.forEach((w: { type: any; name: any; id: any }) => {
			if (w.type === channel) {
				itens.push({ label: w.name, value: w.id });
			}
		});
		toast.info(contact.name);
	};

	const columns = [
		{
			name: "profilePicUrl",
			label: "",
			field: "profilePicUrl",
			style: "w-[50px]",
			align: "center",
			renderCell: (params: { value: string | undefined }) => (
				<div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden">
					{params.value ? (
						<img
							src={params.value}
							alt="Profile"
							className="object-cover w-full h-full"
						/>
					) : (
						<div className="flex items-center justify-center w-full h-full text-gray-500">
							<Avatar />
						</div>
					)}
				</div>
			),
		},
		{
			name: "name",
			label: "Nome",
			field: "name",
			align: "left",
			style: "w-[300px]",
			format: (v: any, r: { number: any; name: any; pushname: any }) =>
				r.number && r.name === r.number && r.pushname ? r.pushname : r.name,
		},
		{
			name: "number",
			label: "WhatsApp",
			field: "number",
			align: "center",
			style: "w-[300px]",
		},
		{
			name: "wallet",
			label: "Carteira",
			field: "wallet",
			align: "center",
			style: "w-[300px]",
		},
		{
			name: "tags",
			label: "Etiquetas",
			field: "tags",
			align: "center",
			style: "w-[300px]",
			renderCell: (params: { value: any }) => (
				<div dangerouslySetInnerHTML={{ __html: params.value }} />
			),
		},
		{
			name: "email",
			label: "Email",
			field: "email",
			style: "w-[500px]",
			align: "left",
		},
		{
			name: "cpf",
			label: "CPF",
			field: "cpf",
			style: "w-[500px]",
			align: "left",
		},
		{
			name: "birthdayDate",
			label: "Aniversário",
			field: "birthdayDate",
			style: "w-[500px]",
			align: "left",
		},
		{
			name: "telegramId",
			label: "Id Telegram",
			field: "telegramId",
			align: "center",
			style: "w-[300px]",
			format: (v: any, r: { telegramId: any; pushname: any }) =>
				r.telegramId ? r.pushname : "",
		},
		{
			name: "acoes",
			label: "Ações",
			field: "acoes",
			align: "center",
			renderCell: (params: { row }) => (
				<div className="flex justify-center space-x-2">
					{params.row.number && cSessionsWpp().length > 0 && (
						<Tooltip title="Edit">
							<IconButton
								onClick={() => handleSaveTicket(params.row, "whatsapp")}
							>
								<MessageCircle />
							</IconButton>
						</Tooltip>
					)}
					<Tooltip title="Edit">
						<IconButton
						// onClick={() => handleEdit(params.row.id)}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete">
						<IconButton
						// onClick={() => handleDelete(params.row.id)}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</div>
			),
		},
	];
	function cSessionsWpp() {
		return whatsapp.filter(
			(w) =>
				["whatsapp"].includes(w.type) &&
				!w.isDeleted &&
				w.status === "CONNECTED",
		);
	}

	useEffect(() => {
		listarContatos();
	}, [listarContatos]);

	return (
		<div className="container p-4">
			<div className="flex justify-between items-center mb-4">
				<Typography variant="h6">Contatos</Typography>
				<div className="flex space-x-2">
					{/* <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Localize"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        InputProps={{
                            startAdornment: <SearchIcon />,
                        }}
                    /> */}
					<Button
						variant="contained"
						color="warning"
						onClick={handleImport}
						startIcon={<Import />}
					>
						Importar
					</Button>
					<Button
						variant="contained"
						color="warning"
						onClick={handleExport}
						startIcon={<ExpandIcon />}
					>
						Exportar
					</Button>
					<Button
						variant="contained"
						color="primary"
						onClick={() => setModalOpen(true)}
					>
						Adicionar
					</Button>
				</div>
			</div>
			<CustomTableContainer>
				<TableContainer
					className="mt-1"
					id={`tabela-contatos-${isChatContact ? "atendimento" : ""}`}
				>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell
									key={col.name}
									align={col.align}
									className={classNames(col.style)}
								>
									{col.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{!loading && contatos
							.filter((row) => row.name.includes(filter))
							.slice(
								pagination.page * pagination.rowsPerPage,
								pagination.page * pagination.rowsPerPage +
								pagination.rowsPerPage,
							)
							.map((row) => (
								<TableRow key={row.id}>
									{columns.map((col) => (
										<TableCell key={col.field}>
											{col.renderCell
												? col.renderCell({ value: row[col.field], row })
												: row[col.field]}
										</TableCell>
									))}
								</TableRow>
							))}
					</TableBody>
				</TableContainer>
			</CustomTableContainer>
			<TablePagination
				component="div"
				count={contatos.length}
				page={pagination.page}
				onPageChange={handlePageChange}
				rowsPerPage={pagination.rowsPerPage}
				onRowsPerPageChange={handleRowsPerPageChange}
			/>
			<ContatoModal />
		</div>
	);
};
