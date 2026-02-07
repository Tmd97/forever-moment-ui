import { connect } from 'react-redux';
import { getSubCategoryData } from '@/features/subCategory/store/actions';
import SubCategory from './components/SubCategory';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.subCategory ? state.subCategory.data : null, // Handle potential undefined state key until registered
    loading: state.subCategory ? state.subCategory.loading : false,
    error: state.subCategory ? state.subCategory.error : null,
});

const mapDispatchToProps = {
    getSubCategoryData,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
