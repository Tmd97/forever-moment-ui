interface SettingsProps {
    data: any;
    loading: boolean;
    error: string | null;
    getSettingsData: () => void;
}

const Settings = ({ data, loading, error, getSettingsData }: SettingsProps) => {
    // Silence unused vars for now
    console.log(data, loading, error, getSettingsData);
    return (
        <div className='p-6'>
            <h1 className='text-2xl font-bold mb-4'>System Settings</h1>
            <p className='text-gray-500'>Configuration options will appear here.</p>
        </div>
    );
};

export default Settings;
