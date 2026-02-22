import { connect } from 'react-redux';
import { getSlotData, createSlot, deleteSlot, updateSlot, resetStatus } from '@/features/slot/store/actions';
import Slot from './components/Slot';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.slot.data,
    loading: state.slot.loading,
    error: state.slot.error,
    status: state.slot.status,
});

const mapDispatchToProps = {
    getSlotData,
    createSlot,
    deleteSlot,
    updateSlot,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(Slot);
