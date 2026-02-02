import { Outlet, Link } from 'react-router-dom'

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl z-10">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h2>
                </div>
                <nav className="p-4 space-y-2">
                    <Link to="/admin" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        Dashboard
                    </Link>
                    <Link to="/" className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                        View Site
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <Outlet />
            </main>
        </div>
    )
}

export default AdminLayout
