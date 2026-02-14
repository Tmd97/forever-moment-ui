import { connect } from 'react-redux';
import { getUsersData, createUser, updateUser, deleteUser, resetStatus } from '../../store/actions';
import { getRolesData } from '@/features/roles/store/actions';
import Users from './components/Users';

const mapStateToProps = (state: any) => ({
    data: state.user.data,
    loading: state.user.loading,
    error: state.user.error,
    status: state.user.status,
    roles: state.roles?.data || [],
});

const mapDispatchToProps = {
    getUsersData,
    getRolesData,
    createUser,
    updateUser,
    deleteUser,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
