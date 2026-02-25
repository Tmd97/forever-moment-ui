import { connect } from 'react-redux';
import {
    getExperienceData,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    resetStatus,
    toggleCancellationPolicy,
    toggleInclusion,
    reorderExperience
} from '@/features/experience/store/actions';
import { getSubCategoryData } from '@/features/subCategory/store/actions';
import { getInclusionData } from '@/features/inclusion/store/actions';
import { getCancellationPolicyData } from '@/features/cancellationPolicy/store/actions';
import Experience from './components/Experience';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.experience.data,
    selectedExperienceDetail: state.experience.selectedExperienceDetail,
    loading: state.experience.loading,
    error: state.experience.error,
    status: state.experience.status,
    subCategories: state.subCategory?.data || [],
    inclusions: state.inclusion?.data || [],
    cancellationPolicies: state.cancellationPolicy?.data || [],
});

const mapDispatchToProps = {
    getExperienceData,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
    resetStatus,
    getSubCategoryData,
    getInclusionData,
    getCancellationPolicyData,
    toggleCancellationPolicy,
    toggleInclusion,
    reorderExperience,
};

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
