import { useFinance } from '../context/FinanceContext';
import { TrendingUp, TrendingDown, Target, DollarSign, BarChart3 } from 'lucide-react';

export default function Insights() {
  const { getInsights } = useFinance();
  const insights = getInsights();

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  return (
    <div className="insights-section">
      <h3 className="section-title">
        <BarChart3 size={20} />
        Financial Insights
      </h3>
      <div className="insights-grid">
        {insights.highestCategory && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: insights.highestCategory.color + '20' }}>
              <Target size={20} color={insights.highestCategory.color} />
            </div>
            <div className="insight-content">
              <h4>Top Spending Category</h4>
              <p className="insight-value">{insights.highestCategory.name}</p>
              <p className="insight-detail">
                {formatCurrency(insights.highestCategory.value)} ({insights.highestCategoryPercent}% of total expenses)
              </p>
            </div>
          </div>
        )}

        {insights.monthOverMonth && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: insights.monthOverMonth.direction === 'up' ? '#fee2e2' : '#dcfce7' }}>
              {insights.monthOverMonth.direction === 'up' ? (
                <TrendingUp size={20} color="#ef4444" />
              ) : (
                <TrendingDown size={20} color="#22c55e" />
              )}
            </div>
            <div className="insight-content">
              <h4>Month-over-Month Change</h4>
              <p className={`insight-value ${insights.monthOverMonth.direction}`}>
                {insights.monthOverMonth.direction === 'up' ? '+' : ''}{insights.monthOverMonth.percentChange}%
              </p>
              <p className="insight-detail">
                {insights.monthOverMonth.direction === 'up' ? 'Increased' : 'Decreased'} by {formatCurrency(Math.abs(insights.monthOverMonth.change))} from last month
              </p>
            </div>
          </div>
        )}

        <div className="insight-card">
          <div className="insight-icon" style={{ background: '#dbeafe' }}>
            <DollarSign size={20} color="#3b82f6" />
          </div>
          <div className="insight-content">
            <h4>Average Monthly Spending</h4>
            <p className="insight-value">{formatCurrency(insights.avgMonthlyExpense)}</p>
            <p className="insight-detail">Based on {insights.totalTransactions} transactions</p>
          </div>
        </div>

        {insights.topIncomeSource && (
          <div className="insight-card">
            <div className="insight-icon" style={{ background: '#dcfce7' }}>
              <TrendingUp size={20} color="#22c55e" />
            </div>
            <div className="insight-content">
              <h4>Primary Income Source</h4>
              <p className="insight-value">{insights.topIncomeSource.name}</p>
              <p className="insight-detail">{formatCurrency(insights.topIncomeSource.amount)} total</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
