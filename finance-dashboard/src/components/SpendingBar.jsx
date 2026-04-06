import { useFinance } from '../context/FinanceContext';
import { useMemo } from 'react';

export default function SpendingBar() {
  const { getSpendingByCategory } = useFinance();
  const spending = getSpendingByCategory();

  const total = useMemo(() => spending.reduce((sum, item) => sum + item.value, 0), [spending]);

  const expenseCategories = spending.filter(s => s.categoryType === 'expense');

  return (
    <div className="spending-bar-card">
      <div className="spending-bar-header">
        <span className="spending-bar-title">Spending by category</span>
        <span className="spending-bar-total">₹{total.toLocaleString('en-IN')} total</span>
      </div>
      {expenseCategories.length > 0 ? (
        <div className="spending-bar-legend">
          {expenseCategories.map((cat) => (
            <div key={cat.name} className="spending-legend-item">
              <span className="spending-legend-dot" style={{ backgroundColor: cat.color }} />
              <span className="spending-legend-name">{cat.name}</span>
              <span className="spending-legend-amount">₹{cat.value.toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-expenses">No expenses yet</div>
      )}
    </div>
  );
}