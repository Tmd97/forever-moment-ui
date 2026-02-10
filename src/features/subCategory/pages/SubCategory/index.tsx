import { connect } from 'react-redux';
import { getCategoryData } from '@/features/category/store/actions';
import {
    getSubCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory
} from '@/features/subCategory/store/actions';
import SubCategory from './components/SubCategory';
import type { RootState } from '@/store/store';
const mapStateToProps = (state: RootState) => ({
    data: state.subCategory ? state.subCategory.data : null,
    loading: state.subCategory ? state.subCategory.loading : false,
    error: state.subCategory ? state.subCategory.error : null,
    categories: state.category?.data || [],
});

const mapDispatchToProps = {
    getSubCategoryData,
    getCategoryData,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(SubCategory);
