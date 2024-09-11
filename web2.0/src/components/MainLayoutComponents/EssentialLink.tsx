import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';


interface EssentialLinkProps {
    title: string;
    caption?: string;
    color?: string;
    routeName?: string;
    icon?: any;
    state: boolean
}

export const EssentialLink: React.FC<EssentialLinkProps> = ({
    title,
    caption = '',
    color = '',
    routeName = 'dashboard',
    icon = '',
    state
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const cRouterName = location.pathname.split('/').pop();

    const handleClick = () => {
        if (routeName !== cRouterName) {
            navigate(`/${routeName}`);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={classNames(
                'hover:bg-blue-100 cursor-pointer flex items-center',
                {
                    'bg-blue-50 text-gray-800 font-bold border-l-3 border-r-3 border-blue-500 rounded-r-md':
                        routeName === cRouterName,
                    'text-red-600 font-bold': color === 'negative',
                }
            )}
        >
            {icon && (
                <div className="mr-4">
                    {icon}
                </div>
            )}
            <div>
                {!state && (
                    <>
                        <div className="text-lg">{title}</div>
                        {caption && <div className="text-sm text-gray-500">{caption}</div>}
                    </>
                )}
            </div>
        </div>
    );
};
