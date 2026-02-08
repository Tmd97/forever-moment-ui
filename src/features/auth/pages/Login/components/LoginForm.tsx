import { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';


interface LoginFormProps {
    loading: boolean;
    error: string | null;
    onSubmit: (data: { email: string; password: string }) => void;
}

export const LoginForm = ({ loading, error, onSubmit }: LoginFormProps) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ email, password });
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    label="Email"
                    icon={Mail}
                    autoComplete="email"
                    required
                    disabled={loading}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    label="Password"
                    icon={Lock}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                />
            </div>

            {error && (
                <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-4 animate-in fade-in slide-in-from-top-1">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                Login failed
                            </h3>
                            <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div>
                <Button
                    type="submit"
                    variant="brand"
                    isLoading={loading}
                    loadingText="Signing in..."
                    className="w-full"
                >
                    Sign in
                </Button>
            </div>
        </form>
    );
};
