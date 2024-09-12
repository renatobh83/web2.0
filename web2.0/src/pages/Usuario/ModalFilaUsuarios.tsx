import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControlLabel, Divider, Checkbox } from '@mui/material';
import { useUsuarioStore } from '../../store/usuarios';
import { UpdateUsuarios } from '../../services/user';
import { toast } from 'sonner';


export const ModalFilaUsuario: React.FC<{
    filas: any[];
}> = ({ filas }) => {
    const { modalFilaUsuario, toggleModalFilaUsuario, usuarioSelecionado, editarUsuario } = useUsuarioStore();

    const [filasUsuario, setFilasUsuario] = useState([])

    const handleChange = (fila: string) => {
        setFilasUsuario(prev => {
            if (prev.some(f => f.id === fila.id)) {
                // Se o objeto já está na lista, removê-lo
                return prev.filter(f => f.id !== fila.id);
            } else {
                // Caso contrário, adicioná-lo
                return [...prev, fila];
            }
        });
    }

    const handleFilaUsuario = async () => {
        const req = {
            ...usuarioSelecionado,
            queues: [...filasUsuario]
        }
        const { data } = await UpdateUsuarios(req.id, req)
        toast.success(`${data.name} atualizado`, {
            position: "top-right"
        })
        editarUsuario(data)
        toggleModalFilaUsuario()
    }

    useEffect(() => {
        if (usuarioSelecionado) {
            setFilasUsuario(usuarioSelecionado.queues ?? []);
        }
    }, [usuarioSelecionado])
    return (
        <Dialog open={modalFilaUsuario} onClose={toggleModalFilaUsuario}>
            <DialogTitle>Gestão de Filas</DialogTitle>
            <DialogContent>
                <div className={`bg-gray-100 p-4 text-lg font-semibold`}>
                    Nome: {usuarioSelecionado?.name}
                </div>
                <div className={`bg-gray-100 p-4 text-sm font-bold`}>
                    Email: {usuarioSelecionado?.email}
                </div>
                <Divider className={`my-4`} />
                <div>
                    {filas.map(fila => (
                        <FormControlLabel
                            key={fila.id}
                            control={
                                <Checkbox
                                    checked={filasUsuario.some(f => f.id === fila.id)}
                                    disabled={!fila.isActive}
                                    onChange={() => handleChange(fila)}
                                />
                            }
                            label={`${fila.queue} ${!fila.isActive ? '(Inativo)' : ''}`}
                        />
                    ))}
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={toggleModalFilaUsuario}>Fechar</Button>
                <Button onClick={handleFilaUsuario}>Salvar</Button>
            </DialogActions>
        </Dialog>
    );
};


