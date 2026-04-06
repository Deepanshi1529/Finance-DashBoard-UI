import { useFinance } from '../context/FinanceContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function MonthlyChart() {
  const { getMonthlyComparison, theme } = useFinance();
  const data = getMonthlyComparison();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const textColor = isDark ? '#cbd5e1' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#475569';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  if (data.length === 0) {
    return (
      <div className="chart-card">
        <h3 className="chart-title">Monthly Comparison</h3>
        <div className="empty-state">No data available</div>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3 className="chart-title">Monthly Income vs Expenses</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 14, fontWeight: 600, fill: textColor }}
              stroke={textMuted}
              tickMargin={10}
            />
            <YAxis
              tick={{ fontSize: 13, fontWeight: 500, fill: textMuted }}
              stroke={textMuted}
              tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`}
              tickMargin={8}
            />
            <Tooltip
              contentStyle={{
                background: tooltipBg,
                border: `1px solid ${tooltipBorder}`,
                borderRadius: 10,
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                fontSize: 14,
                fontWeight: 500,
                padding: '10px 14px',
                color: textColor,
              }}
              formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, undefined]}
            />
            <Legend
              wrapperStyle={{ fontSize: 13, fontWeight: 600, paddingTop: 12, color: textColor }}
            />
            <Bar dataKey="income" name="Income" fill="#22c55e" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
