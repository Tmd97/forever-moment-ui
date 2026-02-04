import { Link } from 'react-router-dom';
import { CUSTOMER_CONFIG } from '@/config/constants';

const Header = () => {
    return (
        <header className='border-b dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50'>
            <div className='max-w-7xl mx-auto px-4 h-16 flex items-center justify-between'>
                <Link to='/' className='text-xl font-bold'>
                    {CUSTOMER_CONFIG.name}
                </Link>
                <nav className='flex gap-4'>
                    <Link to='/' className='hover:text-blue-500 transition'>
                        Home
                    </Link>
                    <Link to='/admin' className='hover:text-blue-500 transition'>
                        Admin Login
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;
