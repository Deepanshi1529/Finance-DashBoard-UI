import { useFinance } from '../context/FinanceContext';
import { Shield, Eye, LayoutDashboard, CreditCard, Lightbulb } from 'lucide-react';

export default function Sidebar({ onClose }) {
  const { role, setRole, activeTab, setActiveTab } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    if (onClose) onClose();
  };

  return (
    <>
      <div className="sidebar-brand">
        <div className="brand-icon">💰</div>
        <h1 className="brand-title">FinanceFlow</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <div className="role-switcher">
          <label className="role-label">Role</label>
          <div className="role-toggle">
            <button
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <Shield size={14} />
              Admin
            </button>
            <button
              className={`role-btn ${role === 'viewer' ? 'active' : ''}`}
              onClick={() => setRole('viewer')}
            >
              <Eye size={14} />
              Viewer
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
