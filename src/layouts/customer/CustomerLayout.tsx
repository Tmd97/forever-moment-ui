import { Outlet, Link } from 'react-router-dom'

const CustomerLayout = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            {/* Header */}
            <header className="border-b dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="text-xl font-bold">Forever Moment</Link>
                    <nav className="flex gap-4">
                        <Link to="/" className="hover:text-blue-500 transition">Home</Link>
                        <Link to="/admin" className="hover:text-blue-500 transition">Admin Login</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t dark:border-gray-800 py-8 mt-12 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    © {new Date().getFullYear()} Forever Moment. All rights reserved.
                </div>
            </footer>
        </div>
    )
}

export default CustomerLayout
