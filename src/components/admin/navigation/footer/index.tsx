import { ADMIN_CONFIG } from '@/config/constants';

const Footer = () => {
    return (
        <footer className='py-4 text-center text-xs text-gray-400 border-t dark:border-gray-700 mt-auto'>
            <p>{ADMIN_CONFIG.name} v{ADMIN_CONFIG.version}</p>
        </footer>
    );
};

export default Footer;
