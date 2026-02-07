import { connect } from 'react-redux';
import { login } from '@/features/auth/store/actions';
import Login from './components/Login';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    loading: state.auth.loading,
    error: state.auth.error,
});

const mapDispatchToProps = {
    login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

