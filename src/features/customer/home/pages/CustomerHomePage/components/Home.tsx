import { useState, useEffect } from 'react';
import { Button } from '@/components/customer/common/Button';
import { Input } from '@/components/customer/common/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/customer/common/Select';
import { Label } from '@/components/customer/common/Label';

interface HomeProps {
    data: any;
    loading: boolean;
    error: string | null;
    getHomeData: () => void;
}

const Home = ({ data, loading, error, getHomeData }: HomeProps) => {
    // Silence unused vars for now
    console.log(data, loading, error, getHomeData);
    // Keep local UI state
    const [inputValue, setInputValue] = useState('');
    const [selectedOption, setSelectedOption] = useState('option1');
    const [isLoading, setIsLoading] = useState(false);

    const handleAction = () => {
        setIsLoading(true);
        // Simulator async action
        setTimeout(() => {
            setIsLoading(false);
            getHomeData(); // Example usage of prop
        }, 2000);
    };

    const dropdownOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ];

    // Fetch data on mount
    useEffect(() => {
        getHomeData();
    }, [getHomeData]);

    if (error) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <p className='text-red-500'>Error: {error}</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4'>
            <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6'>
                <h1 className='text-2xl font-bold text-gray-900 dark:text-white text-center'>
                    {data?.message || 'Component Demo'}
                </h1>

                <div className='space-y-4'>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            placeholder='Enter your email'
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                        />
                        <p className="text-sm text-gray-500">We'll never share your email.</p>
                    </div>

                    <div className="space-y-2">
                        <Label>Select an Option</Label>
                        <Select value={selectedOption} onValueChange={setSelectedOption}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {dropdownOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className='flex gap-4 pt-4'>
                        <Button onClick={handleAction} isLoading={isLoading} className='flex-1'>
                            Primary Action
                        </Button>
                        <Button variant='outline' onClick={() => alert('Secondary!')} className='flex-1'>
                            Secondary
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
