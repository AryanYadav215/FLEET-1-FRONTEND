import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navConfig = {
  manufacturer: [
    { to: '/manufacturer/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/manufacturer/create-shipment', icon: '📦', label: 'Create Shipment' },
    { to: '/manufacturer/shipments', icon: '📋', label: 'My Shipments' },
  ],
  transporter: [
    { to: '/transporter/dashboard', icon: '🚚', label: 'Dashboard' },
  ],
  operations: [
    { to: '/operations/dashboard', icon: '🎯', label: 'Operations Dashboard' },
  ],
  admin: [
    { to: '/admin/users', icon: '👥', label: 'User Management' },
    { to: '/admin/transporters', icon: '🚛', label: 'Transporter Network' },
    { to: '/operations/dashboard', icon: '🎯', label: 'Operations View' },
  ],
};

const roleLabels = {
  manufacturer: 'Manufacturer',
  transporter: 'Transporter',
  operations: 'Operations',
  admin: 'Administrator',
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const links = navConfig[user.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <h2>LogiERP</h2>
          <span>{roleLabels[user.role]} Panel</span>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-section">Navigation</div>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => isActive ? 'active' : ''}
            >
              <span className="nav-icon">{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm btn-block">
            Logout
          </button>
        </div>
      </aside>
      <div className="main-wrapper">
        <header className="header">
          <div className="header-title">Logistics Aggregator ERP</div>
          <div className="header-user">
            <span>{user.name}</span>
            <span style={{ fontSize: '12px', background: 'var(--color-primary-light)', color: 'var(--color-primary)', padding: '3px 8px', borderRadius: '12px' }}>
              {roleLabels[user.role]}
            </span>
          </div>
        </header>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
