import { connect } from 'react-redux';
import { getVendors } from '@/features/vendor/store/actions';
import VendorPage from './components/Vendor';
import type { RootState } from '@/store/store';

const mapStateToProps = (state: RootState) => ({
    data: state.vendor ? state.vendor.data : null,
    loading: state.vendor ? state.vendor.loading : false,
    error: state.vendor ? state.vendor.error : null,
});

const mapDispatchToProps = {
    getVendors,
};

export default connect(mapStateToProps, mapDispatchToProps)(VendorPage);
