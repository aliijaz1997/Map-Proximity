import { Link } from "react-router-dom";

function UserCountStat({ stats }) {
  return (
    <div className="stats bg-base-100 shadow">
      <div className="stat">
        <div className="stat-title">Total Users</div>
        <div className="stat-value">{stats.totalUsers}</div>
      </div>

      <div className="stat">
        <div className="stat-title">Total Admins</div>
        <div className="stat-value">{stats.totalAdmins}</div>
        <div className="stat-actions">
          <button className="btn btn-xs">
            <Link to="/users">View Admins/Users</Link>
          </button>
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Customers</div>
        <div className="stat-value">{stats.totalCustomers}</div>
        <div className="stat-actions">
          <button className="btn btn-xs">
            <Link to="/customers">View Customers</Link>
          </button>
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Total Drivers</div>
        <div className="stat-value">{stats.totalDrivers}</div>
        <div className="stat-actions">
          <button className="btn btn-xs">
            <Link to="/drivers">View Drivers</Link>
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCountStat;
