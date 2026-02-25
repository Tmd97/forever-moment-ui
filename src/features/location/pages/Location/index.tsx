import { connect } from 'react-redux';
import { getLocationData, createLocation, deleteLocation, updateLocation, reorderLocation, resetStatus } from '@/features/location/store/actions';
import Location from './components/Location';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.location.data,
    loading: state.location.loading,
    error: state.location.error,
    status: state.location.status,
});

const mapDispatchToProps = {
    getLocationData,
    createLocation,
    deleteLocation,
    updateLocation,
    reorderLocation,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
