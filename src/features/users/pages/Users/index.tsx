import { connect } from 'react-redux';
import { getUsersData } from '../../store/actions';
import Users from './components/Users';

const mapStateToProps = (state: any) => ({
    data: state.users.data,
    loading: state.users.loading,
    error: state.users.error,
});

const mapDispatchToProps = {
    getUsersData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
