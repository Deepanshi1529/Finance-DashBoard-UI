import { useMemo, memo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function SpendingChartInner() {
  const { getSpendingByCategory, theme } = useFinance();
  const data = getSpendingByCategory();
  const isDark = theme === 'dark';

  const textColor = isDark ? '#cbd5e1' : '#1e293b';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  const tooltipStyle = useMemo(() => ({
    background: tooltipBg,
    border: `1px solid ${tooltipBorder}`,
    borderRadius: 10,
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
    fontSize: 14,
    fontWeight: 500,
    padding: '10px 14px',
    color: textColor,
  }), [tooltipBg, tooltipBorder, textColor]);

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Spending by Category</h3>
        <div className="empty-state">No expense data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spending by Category</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: isDark ? '#64748b' : '#94a3b8', strokeWidth: 1 }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
              contentStyle={tooltipStyle}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default memo(SpendingChartInner);
