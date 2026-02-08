import { useNavigate, useLocation } from 'react-router-dom';
import { LoginCover } from './LoginCover';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';

interface LoginProps {
    loading: boolean;
    error: string | null;
    login: (credentials: any) => Promise<any>;
}

const Login = ({ loading, error, login }: LoginProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const from = (location.state as any)?.from?.pathname || '/admin';

    const handleLogin = async (credentials: any) => {
        try {
            await login(credentials);
            navigate(from, { replace: true });
        } catch (err) {
            // Error is handled by Redux state
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-gray-50 dark:bg-gray-900">
            <div className="hidden lg:block w-1/2 relative bg-gray-900">
                <LoginCover />
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:px-12">
                <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                    <LoginHeader />
                    <LoginForm
                        loading={loading}
                        error={error}
                        onSubmit={handleLogin}
                    />
                </div>
            </div>
        </div>
    );
};

export default Login;
