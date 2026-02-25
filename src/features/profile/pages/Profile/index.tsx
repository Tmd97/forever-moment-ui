import { connect } from 'react-redux';
import { getUserProfile, updateUserProfile } from '@/features/profile/store/actions';
import Profile from './components/Profile';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    user: state.auth.user,
    profileData: state.profile.data,
    profileLoading: state.profile.loading,
    profileError: state.profile.error,
    profileStatus: state.profile.status,
});

const mapDispatchToProps = {
    getUserProfile,
    updateUserProfile,
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
