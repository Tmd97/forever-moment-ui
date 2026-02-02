import { Button } from '../../components/common'

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <Button size="sm">New Report</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700">
                        <h3 className="text-lg font-semibold mb-2">Stat Card {item}</h3>
                        <p className="text-3xl font-bold text-blue-600">1,234</p>
                        <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 mt-8">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <p className="text-gray-500">No recent activity.</p>
            </div>
        </div>
    )
}

export default Dashboard
