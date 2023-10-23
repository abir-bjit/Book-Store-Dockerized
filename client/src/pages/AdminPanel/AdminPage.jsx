import './AdminPage.style.scss';
import AdminHeader from '../../components/adminPanel/AdminHeader';

const AdminPage = () => {
  return (
    <div className="admin-page">
      <h2>Admin Dashboard</h2>
      <AdminHeader/>
    </div>
  );
}

export default AdminPage;
