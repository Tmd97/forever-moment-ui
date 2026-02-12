import { connect } from 'react-redux';
import { getRolesData, createRole, updateRole, deleteRole, resetStatus } from '../../store/actions';
import Roles from './components/Roles';

const mapStateToProps = (state: any) => ({
    data: state.roles.data,
    loading: state.roles.loading,
    error: state.roles.error,
    status: state.roles.status,
});

const mapDispatchToProps = {
    getRolesData,
    createRole,
    updateRole,
    deleteRole,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
