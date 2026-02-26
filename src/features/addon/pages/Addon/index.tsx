import { connect } from 'react-redux';
import {
    getAddonData,
    createAddon,
    updateAddon,
    deleteAddon,
    resetStatus,
} from '@/features/addon/store/actions';
import Addon from './components/Addon';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.addon.data,
    selectedAddonDetail: state.addon.selectedAddonDetail,
    loading: state.addon.loading,
    error: state.addon.error,
    status: state.addon.status,
});

const mapDispatchToProps = {
    getAddonData,
    createAddon,
    updateAddon,
    deleteAddon,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Addon);
