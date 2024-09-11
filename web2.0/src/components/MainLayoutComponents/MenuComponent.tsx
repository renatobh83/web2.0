import React from 'react';

import {
    BookmarkCheckIcon, Bot, CalendarClock, Cog, FileChartColumnIncreasingIcon,
    HomeIcon, LayoutPanelLeftIcon,
    MessageSquareDashed, NotebookTabs, ReplyAll, Rss, Split, Tag, Users2, Webhook
} from 'lucide-react';

import { EssentialLink } from './EssentialLink';

interface MenuDataItem {
    title: boolean;
    // Adicione outras propriedades do item do menu se necessário
}

interface Props {
    userProfile: string | null;
    exibirMenuBeta?: (item: MenuDataItem) => boolean;
    state: boolean
}

export const MenuComponent: React.FC<Props> = ({ userProfile, exibirMenuBeta, state }) => {

    const menuData = [
        {
            title: 'Dashboard',
            caption: '',
            icon: <HomeIcon />,
            routeName: ''
        },

        {
            title: 'Atendimentos',
            caption: 'Lista de atendimentos',
            icon: <MessageSquareDashed />,
            routeName: 'atendimento'
        },
        {
            title: 'Contatos',
            caption: 'Lista de contatos',
            icon: <NotebookTabs />,
            routeName: 'contatos'
        }
    ]

    const menuDataAdmin = [
        {
            title: 'Canais',
            caption: 'Canais de Comunicação',
            icon: <Rss />,
            routeName: 'sessoes'
        },
        {
            title: 'Painel Atendimentos',
            caption: 'Visão geral dos atendimentos',
            icon: <LayoutPanelLeftIcon />,
            routeName: 'painel-atendimentos'
        },
        {
            title: 'Relatórios',
            caption: 'Relatórios gerais',
            icon: <FileChartColumnIncreasingIcon />,
            routeName: 'relatorios'
        },
        {
            title: 'Usuarios',
            caption: 'Admin de usuários',
            icon: <Users2 />,
            routeName: 'usuarios'
        },
        {
            title: 'Filas',
            caption: 'Cadastro de Filas',
            icon: <Split />,
            routeName: 'filas'
        },
        {
            title: 'Mensagens Rápidas',
            caption: 'Mensagens pré-definidas',
            icon: <ReplyAll />,
            routeName: 'mensagens-rapidas'
        },
        {
            title: 'Chatbot',
            caption: 'Robô de atendimento',
            icon: <Bot />,
            routeName: 'chat-flow'
        },
        {
            title: 'Etiquetas',
            caption: 'Cadastro de etiquetas',
            icon: <Tag />,
            routeName: 'etiquetas'
        },
        {
            title: 'Horário de Atendimento',
            caption: 'Horário de funcionamento',
            icon: <CalendarClock />,
            routeName: 'horarioAtendimento'
        },
        {
            title: 'Configurações',
            caption: 'Configurações gerais',
            icon: <Cog />,
            routeName: 'configuracoes'
        },
        {
            title: 'Campanha',
            caption: 'Campanhas de envio',
            icon: <BookmarkCheckIcon />,
            routeName: 'campanhas'
        },
        {
            title: 'API',
            caption: 'Integração sistemas externos',
            icon: <Webhook />,
            routeName: 'api-service'
        }
    ]
    return (
        <div className=" overflow-auto">
            <div className="p-2">
                <div className="space-y-2">
                    {menuData.map(item => (
                        <EssentialLink key={item.title} {...item} state={state} />
                    ))}
                    {userProfile === 'admin' && (
                        <>
                            <hr className="my-4 border-gray-300" />
                            <div className="mb-8" />
                            {menuDataAdmin.map(item => (
                                // exibirMenuBeta(item) ? (
                                <EssentialLink key={item.title} {...item} state={state} />
                                // ) : null
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};