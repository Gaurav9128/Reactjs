import Sidebar from "../admin/Sidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-page-bg overflow-x-hidden">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;