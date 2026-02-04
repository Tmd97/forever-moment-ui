import { connect } from 'react-redux';
import { getHomeData } from '@/features/customer/home/store/actions';
import Home from './components/Home';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
  data: state.home.data,
  loading: state.home.loading,
  error: state.home.error,
});

const mapDispatchToProps = {
  getHomeData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
