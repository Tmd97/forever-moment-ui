import { connect } from 'react-redux';
import { getExperienceData } from '@/features/admin/experience/store/actions';
import Experience from './components/Experience';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.experience.data,
    loading: state.experience.loading,
    error: state.experience.error,
});

const mapDispatchToProps = {
    getExperienceData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
