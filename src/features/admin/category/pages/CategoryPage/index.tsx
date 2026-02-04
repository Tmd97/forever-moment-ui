import { connect } from 'react-redux';
import { getCategoryData } from '@/features/admin/category/store/actions';
import Category from './components/Category';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.category.data,
    loading: state.category.loading,
    error: state.category.error,
});

const mapDispatchToProps = {
    getCategoryData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Category);
