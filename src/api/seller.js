import API from "./axios";
import {
  sellerStats as fallbackStats,
  topProducts as fallbackTopProducts,
  recentOrders as fallbackRecentOrders,
  monthlyData as fallbackMonthlyData,
} from "../data/sellerMock";

export async function getSellerStats() {
  try {
    const res = await API.get("/seller/stats");
    const data = res.data.data ?? res.data;
    return {
      stats: {
        totalSales: data.totalSales,
        totalOrders: data.totalOrders,
        totalProducts: data.totalProducts,
        totalRevenue: data.totalRevenue,
        views: data.views,
        conversion: data.conversion,
        monthlyGrowth: data.monthlyGrowth,
        weeklyGrowth: data.weeklyGrowth,
      },
      monthlyData: data.monthlyData ?? fallbackMonthlyData,
      topProducts: data.topProducts ?? fallbackTopProducts,
      recentOrders: data.recentOrders ?? fallbackRecentOrders,
    };
  } catch {
    return {
      stats: fallbackStats,
      monthlyData: fallbackMonthlyData,
      topProducts: fallbackTopProducts,
      recentOrders: fallbackRecentOrders,
    };
  }
}
