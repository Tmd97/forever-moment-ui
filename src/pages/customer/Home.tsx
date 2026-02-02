import { useState } from 'react'
import { Button, Input, Dropdown } from '../../components/common'

const Home = () => {
    const [inputValue, setInputValue] = useState('')
    const [selectedOption, setSelectedOption] = useState('option1')
    const [isLoading, setIsLoading] = useState(false)

    const handleAction = () => {
        setIsLoading(true)
        setTimeout(() => setIsLoading(false), 2000)
    }

    const dropdownOptions = [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
        { label: 'Option 3', value: 'option3' },
    ]

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Component Demo</h1>

                <div className="space-y-4">
                    <Input
                        label="Email Address"
                        placeholder="Enter your email"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        helperText="We'll never share your email."
                    />

                    <Dropdown
                        label="Select an Option"
                        options={dropdownOptions}
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    />

                    <div className="flex gap-4 pt-4">
                        <Button onClick={handleAction} isLoading={isLoading} className="flex-1">
                            Primary Action
                        </Button>
                        <Button variant="outline" onClick={() => alert('Secondary!')} className="flex-1">
                            Secondary
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
