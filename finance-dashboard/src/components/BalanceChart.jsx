import { useFinance } from '../context/FinanceContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

export default function BalanceChart() {
  const { balanceHistory, getMonthlyComparison, theme } = useFinance();
  const monthly = getMonthlyComparison();
  const isDark = theme === 'dark';

  const gridColor = isDark ? '#334155' : '#e5e7eb';
  const textColor = isDark ? '#cbd5e1' : '#1e293b';
  const textMuted = isDark ? '#94a3b8' : '#475569';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? '#334155' : '#e2e8f0';

  const data = monthly.length > 0 ? monthly.map(m => ({
    name: m.month,
    Income: m.income,
    Expenses: m.expenses,
    Net: m.net,
  })) : balanceHistory.map(b => ({
    name: b.month,
    Income: b.income,
    Expenses: b.expenses,
    Net: b.balance,
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Balance Trend Over Time</h3>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis
              dataKey="name"
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
            <Line type="monotone" dataKey="Income" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="Expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
            <Line type="monotone" dataKey="Net" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 5, strokeWidth: 2 }} activeDot={{ r: 7 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
