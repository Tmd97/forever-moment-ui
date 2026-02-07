import { connect } from 'react-redux';
import { getRolesData } from '../../store/actions';
import Roles from './components/Roles';

const mapStateToProps = (state: any) => ({
    data: state.roles.data,
    loading: state.roles.loading,
    error: state.roles.error,
});

const mapDispatchToProps = {
    getRolesData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Roles);
