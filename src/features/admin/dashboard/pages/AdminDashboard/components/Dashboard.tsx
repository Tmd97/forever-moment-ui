import { Button } from '@/components/admin/common/Button';
import { StatCard } from './StatCard';

interface DashboardProps {
    data: any;
    loading: boolean;
    error: string | null;
    getDashboardData: () => void;
}

const Dashboard = ({ data, loading, error, getDashboardData }: DashboardProps) => {
    // Silence unused vars for now
    console.log(data, loading, error, getDashboardData);
    // In a real app, use useEffect to fetch data if needed
    // useEffect(() => { getDashboardData(); }, [getDashboardData]);

    return (
        <div className='space-y-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>Dashboard</h1>
                <Button size='sm'>New Report</Button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {[1, 2, 3].map((item) => (
                    <StatCard
                        key={item}
                        title={`Stat Card ${item}`}
                        value="1,234"
                        description="+12% from last month"
                    />
                ))}
            </div>

            <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700 mt-8'>
                <h3 className='text-lg font-semibold mb-4'>Recent Activity</h3>
                <p className='text-gray-500'>No recent activity.</p>
            </div>
        </div>
    );
};

export default Dashboard;
