import { users } from '../../data/mockData';

const roleLabels = {
  manufacturer: 'Manufacturer',
  transporter: 'Transporter',
  operations: 'Operations',
  admin: 'Admin',
};

export default function UserManagement() {
  return (
    <div>
      <div className="page-header">
        <h2>User Management</h2>
      </div>

      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{users.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏭</div>
          <div className="stat-label">Manufacturers</div>
          <div className="stat-value">{users.filter(u => u.role === 'manufacturer').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🚚</div>
          <div className="stat-label">Transporters</div>
          <div className="stat-value">{users.filter(u => u.role === 'transporter').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚙️</div>
          <div className="stat-label">Operations / Admin</div>
          <div className="stat-value">{users.filter(u => ['operations', 'admin'].includes(u.role)).length}</div>
        </div>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3>All Users</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td><strong>{u.name}</strong></td>
                <td>{u.email}</td>
                <td>{u.company}</td>
                <td>
                  <span className={`badge badge-${u.role === 'manufacturer' ? 'assigned' : u.role === 'transporter' ? 'in_transit' : 'delivered'}`}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td><span className="badge badge-delivered">{u.status || 'Active'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
