import { connect } from 'react-redux';
import { getSettingsData } from '@/features/admin/settings/store/actions';
import Settings from './components/Settings';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.settings.data,
    loading: state.settings.loading,
    error: state.settings.error,
});

const mapDispatchToProps = {
    getSettingsData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
