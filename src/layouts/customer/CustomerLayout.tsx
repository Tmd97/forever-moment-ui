import { Outlet } from 'react-router-dom';
import Header from '@/components/customer/navigation/Header';
import Footer from '@/components/customer/navigation/footer';

const CustomerLayout = () => {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex flex-col'>
      <Header />
      <main className='flex-1'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
