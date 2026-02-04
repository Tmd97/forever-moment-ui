import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/admin/navigation/Sidebar';
import Header from '@/components/admin/navigation/Header';
import Footer from '@/components/admin/navigation/footer';

const AdminLayout = () => {
  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <Sidebar />
      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <Header />
        <main className='flex-1 p-8 overflow-y-auto'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
