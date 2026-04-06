import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

export default function SummaryCards() {
  const { getSummary } = useFinance();
  const summary = getSummary();

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  const totalIncome = summary.totalIncome || 1;
  const totalExpenses = summary.totalExpenses || 1;

  const cards = [
    {
      title: 'Total Balance',
      value: summary.totalBalance,
      icon: Wallet,
      color: summary.totalBalance >= 0 ? '#22c55e' : '#ef4444',
      bg: '#dcfce7',
      progress: Math.min((summary.totalBalance / totalIncome) * 100, 100),
      sublabel: `${((summary.totalBalance / totalIncome) * 100).toFixed(1)}% of income`,
    },
    {
      title: 'Total Income',
      value: summary.totalIncome,
      icon: TrendingUp,
      color: '#22c55e',
      bg: '#dcfce7',
      progress: 100,
      sublabel: 'Total earned',
    },
    {
      title: 'Total Expenses',
      value: summary.totalExpenses,
      icon: TrendingDown,
      color: '#ef4444',
      bg: '#fee2e2',
      progress: Math.min((summary.totalExpenses / totalIncome) * 100, 100),
      sublabel: `${((summary.totalExpenses / totalIncome) * 100).toFixed(1)}% of income`,
    },
    {
      title: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      color: '#3b82f6',
      bg: '#dbeafe',
      progress: parseFloat(summary.savingsRate),
      sublabel: 'Saved this month',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="summary-card">
            <div className="summary-card-header">
              <span className="summary-card-title">{card.title}</span>
              <div className="summary-card-icon" style={{ background: card.bg }}>
                <Icon size={20} color={card.color} />
              </div>
            </div>
            <div className="summary-card-value" style={{ color: card.color }}>
              {card.title === 'Savings Rate' ? card.value : formatCurrency(card.value)}
            </div>
            <div className="summary-card-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${Math.max(card.progress, 0)}%`,
                    backgroundColor: card.color 
                  }} 
                />
              </div>
              <span className="progress-sublabel">{card.sublabel}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
