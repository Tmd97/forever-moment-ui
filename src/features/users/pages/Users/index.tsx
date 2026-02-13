import { connect } from 'react-redux';
import { getUsersData, createUser, updateUser, deleteUser, resetStatus } from '../../store/actions';
import Users from './components/Users';

const mapStateToProps = (state: any) => ({
    data: state.user.data,  // Note: state.user based on rootReducer, not state.users
    loading: state.user.loading,
    error: state.user.error,
    status: state.user.status,
});

const mapDispatchToProps = {
    getUsersData,
    createUser,
    updateUser,
    deleteUser,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
