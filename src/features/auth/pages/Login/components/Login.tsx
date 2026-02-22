import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from './LoginForm';
import '../../css/styles.scss';

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
        <div className="loginPageWrapper">
            {/* LEFT PANEL */}
            <div className="leftPanel">
                <div className="goldCircle"></div>
                <div className="gridLines"></div>

                {/* Dashboard preview card */}
                <div className="previewCard">
                    <div className="cardHeader">
                        <div className="dot dotRed"></div>
                        <div className="dot dotYellow"></div>
                        <div className="dot dotGreen"></div>
                        <span className="cardTitle">EventOS Dashboard</span>
                    </div>
                    <div className="cardBody">
                        <div className="statRow">
                            <div className="statBox">
                                <div className="statVal">124<span>+</span></div>
                                <div className="statLbl">Active Events</div>
                            </div>
                            <div className="statBox">
                                <div className="statVal">38<span>k</span></div>
                                <div className="statLbl">Attendees</div>
                            </div>
                            <div className="statBox">
                                <div className="statVal">99<span>%</span></div>
                                <div className="statLbl">Uptime</div>
                            </div>
                        </div>
                        <div className="timelineRow">
                            <div className="timelineItem">
                                <div className="tlDot" style={{ background: '#c9a84c' }}></div>
                                <div className="tlBarWrap"><div className="tlBar" style={{ width: '82%', background: 'linear-gradient(90deg, var(--gold) 0%, transparent 100%)' }}></div></div>
                                <div className="tlName">Summit NYC</div>
                            </div>
                            <div className="timelineItem">
                                <div className="tlDot" style={{ background: '#5b8dee' }}></div>
                                <div className="tlBarWrap"><div className="tlBar" style={{ width: '61%', background: 'linear-gradient(90deg, #5b8dee, transparent)' }}></div></div>
                                <div className="tlName">Tech Expo LA</div>
                            </div>
                            <div className="timelineItem">
                                <div className="tlDot" style={{ background: '#4ecb8d' }}></div>
                                <div className="tlBarWrap"><div className="tlBar" style={{ width: '45%', background: 'linear-gradient(90deg, #4ecb8d, transparent)' }}></div></div>
                                <div className="tlName">Annual Gala</div>
                            </div>
                            <div className="timelineItem">
                                <div className="tlDot" style={{ background: '#e86060' }}></div>
                                <div className="tlBarWrap"><div className="tlBar" style={{ width: '28%', background: 'linear-gradient(90deg, #e86060, transparent)' }}></div></div>
                                <div className="tlName">Brand Forum</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Left text content */}
                <div className="leftContent">
                    <div className="tagPill">Enterprise Platform</div>
                    <h1 className="leftTitle">The command center<br />for <em>every event.</em></h1>
                    <p className="leftDesc">Orchestrate vendors, staff, and schedules from a single workspace. Real-time visibility. Zero chaos.</p>
                    <div className="statsRow">
                        <div className="statItem">
                            <div className="statNum">120<sup>+</sup></div>
                            <div className="statCaption">Active events</div>
                        </div>
                        <div className="statDivider"></div>
                        <div className="statItem">
                            <div className="statNum">24<sup>/7</sup></div>
                            <div className="statCaption">Ops support</div>
                        </div>
                        <div className="statDivider"></div>
                        <div className="statItem">
                            <div className="statNum">99<sup>%</sup></div>
                            <div className="statCaption">Uptime SLA</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL contains LoginForm inside formCard */}
            <div className="rightPanel">
                <div className="formCard">
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
