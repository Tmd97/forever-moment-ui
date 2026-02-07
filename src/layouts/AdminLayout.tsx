import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/navigation/Sidebar';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/footer';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className='flex min-h-screen bg-gray-100 dark:bg-gray-900'>
      <Sidebar isOpen={isSidebarOpen} onToggle={toggleSidebar} />
      <div className='flex-1 flex flex-col h-screen overflow-hidden'>
        <Header onToggleSidebar={toggleSidebar} />
        <main className='admin-main-content'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
