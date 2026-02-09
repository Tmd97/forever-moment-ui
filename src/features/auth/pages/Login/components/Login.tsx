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
        <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {/* Background blobs removed */}
            </div>
            <div className="hidden lg:block w-1/2 relative">
                <LoginCover />
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:px-12 relative z-10">
                <div className="w-full max-w-md space-y-8 bg-white/90 dark:bg-slate-900/80 p-8 sm:p-10 rounded-2xl shadow-[0_25px_60px_rgba(15,23,42,0.12)] border border-slate-200/70 dark:border-slate-700/60 backdrop-blur">
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
