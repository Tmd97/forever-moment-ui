import { connect } from 'react-redux';
import { getDashboardData } from '@/features/admin/dashboard/store/actions';
import Dashboard from './components/Dashboard';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
  data: state.dashboard.data,
  loading: state.dashboard.loading,
  error: state.dashboard.error,
});

const mapDispatchToProps = {
  getDashboardData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
