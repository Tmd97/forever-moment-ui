import { connect } from 'react-redux';
import { getExperienceData } from '@/features/experience/store/actions';
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
