import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminHeader from '../components/common/AdminHeader';

const AdminRouter = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className='flex min-h-screen bg-slate-100'>
      <AdminHeader isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <main 
        className="flex-1 p-8 transition-all duration-300 ease-in-out"
        style={{ marginLeft: isSidebarCollapsed ? '5rem' : '16rem' }} // w-20 is 5rem, w-64 is 16rem
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AdminRouter;
