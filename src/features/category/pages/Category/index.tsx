import { connect } from 'react-redux';
import { getCategoryData, createCategory, deleteCategory, updateCategory } from '@/features/category/store/actions';
import Category from './components/Category';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.category.data,
    loading: state.category.loading,
    error: state.category.error,
});

const mapDispatchToProps = {
    getCategoryData,
    createCategory,
    deleteCategory,
    updateCategory,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
