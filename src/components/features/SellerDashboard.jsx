import { memo, useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { useTheme } from "../../hooks/ThemeContext";
import { formatPrice } from "../../utils/formatPrice";
import { getSellerStats } from "../../api/seller";
import { statusStyles } from "../../data/sellerMock";
import { Badge, Button, Card, PageHeader, Skeleton } from "../ui";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

function StatCard({ label, value, hint, icon }) {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-secondary">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-text-primary">{value}</p>
          {hint && <p className="mt-1 text-xs text-accent">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-lg">{icon}</span>
      </div>
    </Card>
  );
}

function SellerDashboard() {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [sellerStats, setSellerStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    let active = true;
    getSellerStats().then((data) => {
      if (!active) return;
      setSellerStats(data.stats);
      setMonthlyData(data.monthlyData);
      setTopProducts(data.topProducts);
      setRecentOrders(data.recentOrders);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const tickColor = isDark ? "#a1a1a1" : "#6b6b6b";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: tickColor, usePointStyle: true },
        },
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: tickColor },
        },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { color: tickColor },
        },
      },
    }),
    [tickColor, gridColor]
  );

  const barData = useMemo(
    () => ({
      labels: monthlyData.map((d) => d.month),
      datasets: [
        {
          label: "Sales",
          data: monthlyData.map((d) => d.sales),
          backgroundColor: "rgba(94, 106, 210, 0.75)",
          borderRadius: 8,
        },
        {
          label: "Orders",
          data: monthlyData.map((d) => d.orders),
          backgroundColor: "rgba(196, 168, 130, 0.85)",
          borderRadius: 8,
        },
      ],
    }),
    [monthlyData]
  );

  const lineData = useMemo(
    () => ({
      labels: monthlyData.map((d) => d.month),
      datasets: [
        {
          label: "Revenue trend",
          data: monthlyData.map((d) => d.sales),
          borderColor: "rgba(94, 106, 210, 1)",
          backgroundColor: "rgba(94, 106, 210, 0.12)",
          fill: true,
          tension: 0.35,
        },
      ],
    }),
    [monthlyData]
  );

  const doughnutData = useMemo(
    () => ({
      labels: topProducts.map((p) => p.category),
      datasets: [
        {
          data: topProducts.map((p) => p.sales),
          backgroundColor: [
            "rgba(94, 106, 210, 0.8)",
            "rgba(196, 168, 130, 0.85)",
            "rgba(34, 197, 94, 0.75)",
            "rgba(245, 158, 11, 0.75)",
          ],
          borderWidth: 0,
        },
      ],
    }),
    [topProducts]
  );

  if (loading || !sellerStats) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-16 w-full max-w-md" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Seller dashboard"
        description="Track performance, orders, and listings."
        actions={
          <>
            <Button to="/sell" variant="primary" size="sm">
              Add product
            </Button>
            <Button to="/products" variant="outline" size="sm">
              View shop
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Revenue" value={formatPrice(sellerStats.totalRevenue)} hint={`+${sellerStats.monthlyGrowth}% this month`} icon="💰" />
        <StatCard label="Orders" value={sellerStats.totalOrders} hint={`+${sellerStats.weeklyGrowth}% this week`} icon="📦" />
        <StatCard label="Shop views" value={sellerStats.views.toLocaleString()} hint={`${sellerStats.conversion}% conversion`} icon="👁" />
        <StatCard label="Active listings" value={sellerStats.totalProducts} hint="Live on marketplace" icon="🛍" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-4 md:p-6">
          <h3 className="font-semibold text-text-primary">Monthly sales & orders</h3>
          <p className="mt-1 text-xs text-text-secondary">Last 6 months</p>
          <div className="mt-4 h-64 md:h-72">
            <Bar data={barData} options={chartOptions} />
          </div>
        </Card>

        <Card className="p-4 md:p-6">
          <h3 className="font-semibold text-text-primary">Revenue trend</h3>
          <p className="mt-1 text-xs text-text-secondary">Growth over time</p>
          <div className="mt-4 h-64 md:h-72">
            <Line data={lineData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-4 md:p-6 lg:col-span-1">
          <h3 className="font-semibold text-text-primary">Top categories</h3>
          <div className="mt-4 h-56">
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "bottom", labels: { color: tickColor, usePointStyle: true } } },
              }}
            />
          </div>
        </Card>

        <Card className="overflow-hidden lg:col-span-2">
          <div className="border-b border-border px-4 py-4 md:px-6">
            <h3 className="font-semibold text-text-primary">Top products</h3>
          </div>
          <div className="divide-y divide-border">
            {topProducts.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-text-secondary md:px-6">
                No sales yet — list your first product to get started.
              </p>
            ) : (
              topProducts.map((product) => (
                <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
                  <div>
                    <p className="font-medium text-text-primary">{product.name}</p>
                    <p className="text-xs text-text-secondary">{product.category}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-text-primary">{formatPrice(product.revenue)}</p>
                    <p className="text-xs text-text-secondary">{product.sales} sales</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-border px-4 py-4 md:px-6">
          <h3 className="font-semibold text-text-primary">Recent orders</h3>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-text-secondary md:px-6">
              Orders will appear here once buyers check out.
            </p>
          ) : (
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-bg-muted text-xs uppercase tracking-wider text-text-secondary">
                <tr>
                  <th className="px-4 py-3 md:px-6">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="text-text-primary">
                    <td className="px-4 py-3 font-medium md:px-6">{order.id}</td>
                    <td className="px-4 py-3">{order.customer}</td>
                    <td className="px-4 py-3 text-text-secondary">{order.product}</td>
                    <td className="px-4 py-3">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="default" className={statusStyles[order.status]}>
                        {order.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}

export default memo(SellerDashboard);
