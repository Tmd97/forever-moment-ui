import { CUSTOMER_CONFIG } from '@/config/constants';

const Footer = () => {
    return (
        <footer className='border-t dark:border-gray-800 py-8 mt-12 bg-gray-50 dark:bg-gray-950'>
            <div className='max-w-7xl mx-auto px-4 text-center text-gray-500'>
                © {new Date().getFullYear()} {CUSTOMER_CONFIG.name}. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
