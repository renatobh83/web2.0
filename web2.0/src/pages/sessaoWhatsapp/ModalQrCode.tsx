import type React from 'react';
import { useEffect } from 'react';
import { Dialog, Card, IconButton, Button } from '@mui/material';
import { X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import clsx from 'clsx'; // Para manipulação de classes
import { useTheme } from '@mui/material/styles'; // Para verificar o tema ativo (dark mode)

interface ModalQrCodeProps {
    abrirModalQR: boolean;
    channel: {
        id: string | null;
        qrcode: string;
        wppPass?: string;
        status?: string;
    };
    onClose: () => void;
    onGenerateNewQrCode: (channel: any) => void;
}

export const ModalQrCode: React.FC<ModalQrCodeProps> = ({ abrirModalQR, channel, onClose, onGenerateNewQrCode }) => {
    const theme = useTheme(); // Para verificar o modo escuro

    useEffect(() => {
        if (channel.status === 'CONNECTED') {
            onClose();
        }
    }, [channel.status, onClose]);

    const handleGenerateNewQrCode = () => {
        onGenerateNewQrCode(channel);
        onClose();
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    };

    return (
        <Dialog open={abrirModalQR} fullWidth maxWidth="sm" PaperProps={{ style: { backgroundColor: 'white' } }}>
            <Card className="p-6 bg-white">
                <div className="flex items-center justify-between text-primary text-xl font-semibold">
                    Leia o QrCode para iniciar a sessão
                    <IconButton onClick={onClose} color="error">
                        <X />
                    </IconButton>
                </div>
                <div
                    className={clsx('text-center my-6', {
                        'bg-white': theme.palette.mode === 'dark',
                    })}
                >
                    {channel.qrcode ? (
                        <QRCodeSVG value={channel.qrcode} size={300} level="H" />
                    ) : (
                        <p>Aguardando o Qr Code...</p>
                    )}
                    {channel.wppPass && <p>Código de Pareamento: {channel.wppPass}</p>}
                </div>
                <div className="mt-4">
                    <p className="text-center">
                        Caso tenha problema com a leitura, solicite um novo Qr Code
                    </p>
                    <div className="flex justify-center mt-4">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<X />}
                            onClick={handleGenerateNewQrCode}
                        >
                            Novo QR Code
                        </Button>
                    </div>
                </div>
            </Card>
        </Dialog>
    );
};


