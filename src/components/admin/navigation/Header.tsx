

const Header = () => {
    return (
        <header className='h-16 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-8 sticky top-0 z-10'>
            <h2 className='text-lg font-semibold text-gray-800 dark:text-gray-200'>Admin Workspace</h2>
            <div className='flex items-center gap-4'>
                <button className='p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'>
                    <span className='sr-only'>Notifications</span>
                    🔔
                </button>
                <div className='h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
                    A
                </div>
            </div>
        </header>
    );
};

export default Header;
