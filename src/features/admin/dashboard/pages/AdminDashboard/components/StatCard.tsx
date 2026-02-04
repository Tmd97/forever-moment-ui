interface StatCardProps {
    title: string;
    value: string;
    description?: string;
}

export const StatCard = ({ title, value, description }: StatCardProps) => {
    return (
        <div className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border dark:border-gray-700'>
            <h3 className='text-lg font-semibold mb-2'>{title}</h3>
            <p className='text-3xl font-bold text-blue-600'>{value}</p>
            {description && <p className='text-sm text-gray-500 mt-2'>{description}</p>}
        </div>
    );
};
