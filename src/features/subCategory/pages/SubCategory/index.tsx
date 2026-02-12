import { connect } from 'react-redux';
import { getCategoryData } from '@/features/category/store/actions';
import {
    getSubCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    resetStatus
} from '@/features/subCategory/store/actions';
import SubCategory from './components/SubCategory';
import type { RootState } from '@/store/store';
const mapStateToProps = (state: RootState) => ({
    data: state.subCategory ? state.subCategory.data : null,
    loading: state.subCategory ? state.subCategory.loading : false,
    error: state.subCategory ? state.subCategory.error : null,
    status: state.subCategory ? (state.subCategory as any).status : 'IDLE',
    categories: state.category?.data || [],
});

const mapDispatchToProps = {
    getSubCategoryData,
    getCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
    resetStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
