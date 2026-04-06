import { useState } from 'react';
import { FinanceProvider, useFinance } from './context/FinanceContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import BalanceChart from './components/BalanceChart';
import SpendingChart from './components/SpendingChart';
import MonthlyChart from './components/MonthlyChart';
import TransactionView from './components/TransactionView';
import TransactionModal from './components/TransactionModal';
import Insights from './components/Insights';
import { Menu, X } from 'lucide-react';
import './App.css';

function DashboardView() {
  return (
    <div className="dashboard-view">
      <SummaryCards />
      <div className="charts-row">
        <BalanceChart />
        <SpendingChart />
      </div>
      <MonthlyChart />
    </div>
  );
}

function TransactionsView() {
  return <TransactionView />;
}

function InsightsView() {
  return <Insights />;
}

function AppContent() {
  const { activeTab, showAddModal, editingTransaction } = useFinance();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <button className="mobile-menu-btn" onClick={() => setSidebarOpen(true)}>
        <Menu size={22} />
      </button>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
          <X size={20} />
        </button>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </aside>

      <main className="main-content">
        <Header />
        <div className="content-area">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'transactions' && <TransactionsView />}
          {activeTab === 'insights' && <InsightsView />}
        </div>
      </main>
      {(showAddModal || editingTransaction) && <TransactionModal />}
    </div>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
