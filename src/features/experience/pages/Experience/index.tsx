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
    reorderExperience,
    associateLocation,
    updateExperienceLocation,
    disassociateLocation,
    toggleAddon,
} from '@/features/experience/store/actions';
import { getSubCategoryData } from '@/features/subCategory/store/actions';
import { getInclusionData } from '@/features/inclusion/store/actions';
import { getCancellationPolicyData } from '@/features/cancellationPolicy/store/actions';
import { getLocationData } from '@/features/location/store/actions';
import { getAddonData } from '@/features/addon/store/actions';
import { getSlotData } from '@/features/slot/store/actions';
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
    locations: state.location?.data || [],
    addons: state.addon?.data || [],
    slots: state.slot?.data || [],
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
    getLocationData,
    toggleCancellationPolicy,
    toggleInclusion,
    reorderExperience,
    associateLocation,
    updateExperienceLocation,
    disassociateLocation,
    getAddonData,
    toggleAddon,
    getSlotData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Experience);
