// TODO: Replace with GET /seller/stats when API ships
export const sellerStats = {
  totalSales: 8420,
  totalOrders: 186,
  totalProducts: 12,
  totalRevenue: 12450,
  views: 4820,
  conversion: 3.8,
  monthlyGrowth: 12.5,
  weeklyGrowth: 8.2,
};

export const topProducts = [
  { id: 1, name: "Handmade Ceramic Vase", sales: 45, revenue: 675, target: 50, category: "Pottery" },
  { id: 2, name: "Artisan Wooden Bowl", sales: 38, revenue: 570, target: 40, category: "Woodwork" },
  { id: 3, name: "Macrame Wall Hanging", sales: 32, revenue: 480, target: 35, category: "Textiles" },
  { id: 4, name: "Leather Wallet", sales: 28, revenue: 420, target: 30, category: "Leather" },
];

export const recentOrders = [
  { id: "ORD-001", customer: "Sarah Johnson", product: "Handmade Ceramic Vase", quantity: 2, total: 45, status: "Completed", date: "2024-01-15" },
  { id: "ORD-002", customer: "Mike Chen", product: "Artisan Wooden Bowl", quantity: 1, total: 35, status: "Processing", date: "2024-01-14" },
  { id: "ORD-003", customer: "Emma Wilson", product: "Macrame Wall Hanging", quantity: 1, total: 28, status: "Shipped", date: "2024-01-13" },
  { id: "ORD-004", customer: "David Brown", product: "Leather Wallet", quantity: 3, total: 75, status: "Completed", date: "2024-01-12" },
];

export const monthlyData = [
  { month: "Jul", sales: 1200, orders: 12 },
  { month: "Aug", sales: 1450, orders: 15 },
  { month: "Sep", sales: 1100, orders: 11 },
  { month: "Oct", sales: 1680, orders: 18 },
  { month: "Nov", sales: 1920, orders: 21 },
  { month: "Dec", sales: 2100, orders: 24 },
];

export const statusStyles = {
  Completed: "bg-success/10 text-success border-success/20",
  Processing: "bg-accent-warm/15 text-accent-warm border-accent-warm/25",
  Shipped: "bg-accent/10 text-accent border-accent/20",
};
