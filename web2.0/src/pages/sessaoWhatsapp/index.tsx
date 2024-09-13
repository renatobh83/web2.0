import { Avatar, Box, Button, Card, CardActions, CardContent, Container, Divider, Tooltip } from "@mui/material";
import { FolderSync, MessageCircle, PencilIcon, Plus, Trash } from "lucide-react";
import type React from "react";
import { useWhatsappStore } from "../../store/whatsapp";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { ListarFilas } from "../../services/filas";
import { ListarUsuarios } from "../../services/user";
import { ItemStatusChannel } from "./ItemStatusChannel";
import { ModalQrCode } from "./ModalQrCode";
import { DeleteWhatsappSession, ListarWhatsapps, RequestNewQrCode, StartWhatsappSession } from "../../services/sessoesWhatsapp";
import { ModalWhatsapp } from "./ModalWhatsApp";

export const IndexSessoesWhatsapp: React.FC = () => {
    const userProfile = localStorage.getItem('profile') ?? "user"
    const isAdmin = localStorage.getItem('profile')

    const [loading, setLoading] = useState(false)
    const [filas, setFilas] = useState([])
    const [lisatUsuario, setListaUsuario] = useState([])
    const [whatsappSelecionado, setwhatsappSelecionado] = useState({})
    const [abrirModalQR, setAbrirModalQR] = useState(false)
    const whatsApps = useWhatsappStore(s => s.whatsApps)
    const updateWhatsApps = useWhatsappStore(s => s.updateWhatsApps)
    const loadWhatsApps = useWhatsappStore((s) => s.loadWhatsApps);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const handleStartWhatsAppSession = useCallback(async (whatsAppId) => {
        try {
            await StartWhatsappSession(whatsAppId)
            const data = whatsApps.find(w => w.id === whatsAppId)
            if (data.type === 'waba' || data.type === 'telegram') {
                window.location.reload();
            }
        } catch (error) {
            console.error(error)
        }
    }, [])
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    const handleRequestNewQrCode = useCallback(async (channel) => {

        if (channel.type === 'telegram' && !channel.tokenTelegram) {
            toast.error('Necessário informar o token para Telegram')
        }
        setLoading(true)
        try {
            await RequestNewQrCode({ id: channel.id })
            setTimeout(() => {
                handleOpenQrModal(channel)
            }, 2000)
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }, [])
    const handleDisconectWhatsSession = (whatsAppId) => {
        setLoading(true)
        DeleteWhatsappSession(whatsAppId).then(() => {
            const whatsapp = whatsApps.find(w => w.id === whatsAppId)
            updateWhatsApps({
                ...whatsapp,
                status: 'DISCONNECTED'
            })
        }).finally(() => {
            setLoading(false)
        })

    }

    const listarFila = useCallback(async () => {
        const { data } = await ListarFilas()
        setFilas(data.filter((item) => item.isActive))

    }, [])
    const listarUsuario = useCallback(async () => {
        const { data } = await ListarUsuarios()
        setListaUsuario(data.users)
    }, [])
    const cDadosWhatsappSelecionado = () => {
        const { id } = whatsappSelecionado
        return whatsApps.find(w => w.id === id)
    }
    const handleOpenQrModal = (channel) => {
        setwhatsappSelecionado(channel)
        setAbrirModalQR(true)

    }
    const listarWhatsapps = useCallback(async () => {
        const { data } = await ListarWhatsapps();
        loadWhatsApps(data);
    }, [loadWhatsApps]);

    const onCloseModalQr = () => {
        setAbrirModalQR(false)
    }
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        listarFila()
        listarUsuario()
        listarWhatsapps()
    }, [])
    return (
        <>
            {userProfile === 'admin' && (

                <Container disableGutters maxWidth={false} className="gap-6 flex flex-col ">
                    <Card>
                        <CardContent>
                            <div className="flex h-12 items-center justify-around">
                                <div className="text-xl font-bold">
                                    Canais de comuicacao
                                </div>
                                <Tooltip title="Adicionar Canal">
                                    <button type="button" className="hover:bg-zinc-400 h-8 w-8 flex items-center justify-center rounded-full bg-zinc-200">
                                        <Plus />
                                    </button>
                                </Tooltip>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex gap-5 ">
                        {whatsApps.map((item) => (
                            <Card key={item.id} sx={{ maxWidth: 350, backgroundColor: "#ccc4", padding: 2 }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', placeItems: 'center', gap: 3 }} >
                                        <Avatar src={item.type} />
                                        <div className="flex-1">
                                            <div className="flex flex-col text-xs">
                                                <span>Nome: <b>{item.name}</b></span>
                                                <span>{item.type}</span>
                                            </div>

                                        </div>
                                        {isAdmin && (
                                            <button type="button">
                                                <PencilIcon size={16} />
                                            </button>
                                        )}
                                    </Box>
                                </CardContent>
                                <Divider />
                                <CardContent >
                                    <ItemStatusChannel item={item} />
                                </CardContent>
                                <Divider />
                                <CardContent className="flex gap-3">
                                    <div>
                                        <select>s</select>
                                    </div>
                                    <div>
                                        <select>s</select>
                                    </div>
                                </CardContent>
                                <Divider />
                                {item.type !== 'messenger' && (
                                    <CardActions className="flex justify-center">


                                        {(item.type === 'whatsapp' || item.type === 'baileys') && item.status === 'qrcode' && (
                                            <Button size="small" variant="outlined" sx={{
                                                ":hover": {
                                                    backgroundColor: '#dddd'
                                                }
                                            }} onClick={() => handleOpenQrModal(item)}>
                                                QR Code
                                            </Button>
                                        )}
                                        {item.status === 'DISCONNECTED' && (
                                            <>
                                                <div>
                                                    <Button size="small" fullWidth={true} variant="outlined" sx={{
                                                        ":hover": {
                                                            backgroundColor: '#dddd'
                                                        }
                                                    }}
                                                        onClick={() => handleStartWhatsAppSession(item.id)}
                                                    >
                                                        Conectar
                                                    </Button>
                                                    {item.status === 'qrCode' && item.type === 'whatsapp' && (
                                                        <Button size="small" fullWidth={true} variant="outlined" sx={{
                                                            ":hover": {
                                                                backgroundColor: '#dddd'
                                                            }
                                                        }}>
                                                            Novo QR Code
                                                        </Button>
                                                    )}

                                                </div>
                                                {/* <div>
                                                    {(item.type === 'whatsapp' || item.type === 'baileys') || item.status === 'qrcode' &&
                                                        <Button size="small" fullWidth={true} variant="outlined" sx={{
                                                            ":hover": {
                                                                backgroundColor: '#dddd'
                                                            }
                                                        }}>
                                                            Conectar
                                                        </Button>
                                                    }

                                                </div> */}
                                            </>
                                        )}
                                        {item.status === 'OPENING' && (
                                            <div className="flex items-center p-2">
                                                <b>Conectando</b>
                                            </div>
                                        )}
                                        {['OPENING', 'CONNECTED', 'PAIRING', 'TIMEOUT'].includes(item.status) && (
                                            <Button size="small" fullWidth={true} variant="outlined" sx={{
                                                ":hover": {
                                                    backgroundColor: '#dddd'
                                                }
                                            }} onClick={() => handleDisconectWhatsSession(item.id)}
                                            > Desconectar
                                            </Button>
                                        )}
                                    </CardActions>
                                )}
                                <CardContent className="flex justify-end gap-3">
                                    {item.type === 'whatsapp' && (
                                        <Tooltip title="  Sincronizar mensagens">
                                            <button type="button">

                                                <FolderSync />
                                            </button>
                                        </Tooltip>
                                    )}
                                    <Button size="small" sx={{
                                        ":hover": {
                                            backgroundColor: '#dddd'
                                        }
                                    }}><Trash size={16} color="#fd0036" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                </Container >

            )}
            {
                abrirModalQR && (
                    <ModalQrCode
                        abrirModalQR={abrirModalQR}
                        channel={cDadosWhatsappSelecionado()}
                        onClose={onCloseModalQr}
                        onGenerateNewQrCode={handleRequestNewQrCode} />
                )
            }
            <ModalWhatsapp />
        </>
    )
}
