import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  fetchRevenueByMonth,
  fetchOrdersByMonth,
  fetchTopProducts,
  fetchNewUsersByMonth,
  MonthlyPoint,
  NamedPoint,
} from '@/api/analytics';
import Loader from '@/components/Loader';
import Message from '@/components/Message';

const BRAND = '#5457ee';
const GRID = 'rgba(20, 22, 31, 0.08)';
const AXIS_TEXT = 'rgba(20, 22, 31, 0.4)';

const formatMonth = (month: string) => {
  const [year, m] = month.split('-');
  return new Date(Number(year), Number(m) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
};

const tickStyle = { fontSize: 11, fill: AXIS_TEXT };

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
  formatValue?: (value: number) => string;
}> = ({ active, payload, label, formatValue }) => {
  if (!active || !payload || payload.length === 0) return null;
  const value = payload[0].value;
  return (
    <div className="bg-white border border-ink/8 rounded-xl shadow-cardHover px-3.5 py-2.5 text-xs">
      <p className="text-ink/40 mb-0.5">{label}</p>
      <p className="font-semibold text-ink">{formatValue ? formatValue(value) : value}</p>
    </div>
  );
};

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white border border-ink/8 rounded-2xl p-6">
    <h3 className="font-semibold text-sm mb-5">{title}</h3>
    <div className="h-64">{children}</div>
  </div>
);

const AdminDashboardPage: React.FC = () => {
  const [revenue, setRevenue] = useState<MonthlyPoint[] | null>(null);
  const [orders, setOrders] = useState<MonthlyPoint[] | null>(null);
  const [topProducts, setTopProducts] = useState<NamedPoint[] | null>(null);
  const [newUsers, setNewUsers] = useState<MonthlyPoint[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([fetchRevenueByMonth(), fetchOrdersByMonth(), fetchTopProducts(), fetchNewUsersByMonth()])
      .then(([r, o, t, u]) => {
        setRevenue(r);
        setOrders(o);
        setTopProducts(t);
        setNewUsers(u);
      })
      .catch(() => setError('We couldn\'t load the analytics dashboard right now. Please try again in a moment.'));
  }, []);

  if (error) return <Message variant="error">{error}</Message>;
  if (!revenue || !orders || !topProducts || !newUsers) return <Loader />;

  const revenueData = revenue.map((r) => ({ ...r, label: formatMonth(r.month) }));
  const ordersData = orders.map((r) => ({ ...r, label: formatMonth(r.month) }));
  const newUsersData = newUsers.map((r) => ({ ...r, label: formatMonth(r.month) }));

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <ChartCard title="Revenue by month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => `$${v}`} />
              <Tooltip content={<CustomTooltip formatValue={(v) => `$${v.toFixed(2)}`} />} cursor={{ stroke: GRID }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={BRAND}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: BRAND, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by month">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ordersData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: GRID }} />
              <Bar dataKey="value" fill={BRAND} radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top selling products">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid stroke={GRID} horizontal={false} />
              <XAxis type="number" tick={tickStyle} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                tick={tickStyle}
                axisLine={false}
                tickLine={false}
                width={120}
                tickFormatter={(v: string) => (v.length > 16 ? `${v.slice(0, 16)}…` : v)}
              />
              <Tooltip content={<CustomTooltip formatValue={(v) => `${v} sold`} />} cursor={{ fill: GRID }} />
              <Bar dataKey="value" fill={BRAND} radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="New users by month">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={newUsersData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid stroke={GRID} vertical={false} />
              <XAxis dataKey="label" tick={tickStyle} axisLine={false} tickLine={false} />
              <YAxis tick={tickStyle} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: GRID }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={BRAND}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: BRAND, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
