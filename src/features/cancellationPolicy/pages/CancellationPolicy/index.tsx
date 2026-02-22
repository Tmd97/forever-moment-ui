import { connect } from 'react-redux';
import { getCancellationPolicyData, createCancellationPolicy, deleteCancellationPolicy, updateCancellationPolicy, reorderCancellationPolicy, resetStatus } from '@/features/cancellationPolicy/store/actions';
import CancellationPolicy from './components/CancellationPolicy';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.cancellationPolicy.data,
    loading: state.cancellationPolicy.loading,
    error: state.cancellationPolicy.error,
    status: state.cancellationPolicy.status,
});

const mapDispatchToProps = {
    getCancellationPolicyData,
    createCancellationPolicy,
    deleteCancellationPolicy,
    updateCancellationPolicy,
    reorderCancellationPolicy,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(CancellationPolicy);
