import React from 'react';
import { LucideIcon, WifiAlert, Crop, WifiStrength1Alert, WifiArrowUpDown, CropIcon, Wifi, WifiLow, WifiHighIcon, MessageCircle } from 'lucide-react';
import { CircularProgress, ListItem, ListItemAvatar, ListItemText, Avatar, Typography } from '@mui/material';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Item {
    status: string;
    type: string;
    number?: string;
    tokenAPI?: string;
    profilePic?: string;
    phone?: {
        pushname?: string;
        name?: string;
        phone?: string;
    };
    updatedAt: string;
}

interface ItemStatusChannelProps {
    item: Item;
}
const text = {
    color: "red"
};
export const ItemStatusChannel: React.FC<ItemStatusChannelProps> = ({ item }) => {
    const formatarData = (data: string, formato: string) => {
        return format(new Date(data), formato, { locale: ptBR });
    };

    return (
        <ListItem className="flex items-start">
            <ListItemAvatar>
                {item.status === 'qrcode' && (
                    <CropIcon name="Crop" size={40} className="text-blue-500" />
                )}
                {item.status === 'DISCONNECTED' && (
                    <Wifi name="WifiAlert" size={40} className="text-red-500" />
                )}
                {item.status === 'CONNECTED' && (
                    <Wifi size={40} className="text-green-500" />
                )}
                {['PAIRING', 'TIMEOUT'].includes(item.status) && (
                    <WifiHighIcon name="WifiStrength1Alert" size={40} className="text-red-500" />
                )}
                {item.status === 'OPENING' && (
                    <Wifi className="text-green-700" size={48} />
                )}
            </ListItemAvatar>

            <ListItemText primary={
                <Typography variant="caption" display="block" gutterBottom>
                    {item.status === 'qrcode' && (
                        <>
                            <span className="font-medium">Esperando leitura do QR Code</span>
                            <div>Clique no botão 'QR CODE' e leia o QR Code com o seu celular para iniciar a sessão</div>
                        </>
                    )}

                    {item.status === 'DISCONNECTED' && (
                        <>
                            <span className="font-medium">Falha ao iniciar comunicação para este canal.</span>
                            {['whatsapp', 'baileys'].includes(item.type) && (
                                <div>Certifique-se de que seu celular esteja conectado à internet e tente novamente, ou solicite um novo QR Code</div>
                            )}
                            {item.type === 'waba' && <div>Tente conectar novamente. Caso o erro permaneça, confirme se os tokens estão corretos.</div>}
                            {item.type === 'telegram' && <div>Tente conectar novamente. Caso o erro permaneça, confirme se o token está correto.</div>}
                            {item.type === 'instagram' && <div>Tente conectar novamente. Caso o erro permaneça, confirme se as credenciais estão corretas.</div>}
                        </>
                    )}

                    {item.status === 'CONNECTED' && item.type === 'waba' && (
                        <span className="font-medium blur-effect">Conexão estabelecida: {item.tokenAPI}</span>
                    )}

                    {(item.status === 'CONNECTED' && ['whatsapp', 'baileys'].includes(item.type)) && (
                        <span className="font-medium blur-effect">
                            Conexão estabelecida: {item.number ? item.number : 'Carregando dados...'}
                        </span>
                    )}

                    {item.status === 'CONNECTED' && ['whatsapp', 'baileys', 'waba'].includes(item.type) && (
                        <div className="flex items-center">
                            {item.profilePic !== 'disabled' ? (
                                <img src={item.profilePic} alt="Perfil" className="w-8 h-8 rounded-full object-cover mr-2" />
                            ) : (
                                <MessageCircle name="Whatsapp" size={20} className="rounded-full mr-2" />
                            )}
                            <span className="font-medium">
                                {item.phone?.pushname || item.phone?.name || item.phone?.phone}
                            </span>
                        </div>
                    )}

                    {['PAIRING', 'TIMEOUT'].includes(item.status) && (
                        <>
                            <span className="font-medium">A conexão com o celular foi perdida</span>
                            <div>
                                Certifique-se de que seu celular esteja conectado à internet e o WhatsApp esteja aberto, ou clique no botão 'Desconectar' para obter um novo QR Code
                            </div>
                        </>
                    )}

                    {item.status === 'OPENING' && (
                        <>
                            <span className="font-medium">Estabelecendo conexão.</span>
                            <div>Isso poderá demorar um pouco...</div>
                        </>
                    )}

                    <div className="text-gray-500 text-sm">Última Atualização: {formatarData(item.updatedAt, 'dd/MM/yyyy HH:mm')}</div>
                </Typography>
            }>
            </ListItemText>
        </ListItem>
    );
};


