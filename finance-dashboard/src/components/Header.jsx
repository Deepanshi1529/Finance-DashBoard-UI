import { useFinance } from '../context/FinanceContext';
import { Plus, Moon, Sun } from 'lucide-react';

export default function Header() {
  const { activeTab, role, setShowAddModal, theme, toggleTheme } = useFinance();

  const titles = {
    dashboard: 'Dashboard Overview',
    transactions: 'Transactions',
    insights: 'Financial Insights',
  };

  return (
    <header className="main-header">
      <div>
        <h2 className="page-title">{titles[activeTab]}</h2>
        <p className="page-subtitle">
          {activeTab === 'dashboard' && 'Your financial summary at a glance'}
          {activeTab === 'transactions' && 'Manage and explore your transactions'}
          {activeTab === 'insights' && 'Smart insights from your spending data'}
        </p>
      </div>
      <div className="header-actions">
        <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        {role === 'admin' && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Transaction
          </button>
        )}
      </div>
    </header>
  );
}
