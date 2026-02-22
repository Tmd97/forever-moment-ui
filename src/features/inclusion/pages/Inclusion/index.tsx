import { connect } from 'react-redux';
import { getInclusionData, createInclusion, deleteInclusion, updateInclusion, reorderInclusion, resetStatus } from '@/features/inclusion/store/actions';
import Inclusion from './components/Inclusion';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.inclusion.data,
    loading: state.inclusion.loading,
    error: state.inclusion.error,
    status: state.inclusion.status,
});

const mapDispatchToProps = {
    getInclusionData,
    createInclusion,
    deleteInclusion,
    updateInclusion,
    reorderInclusion,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Inclusion);
