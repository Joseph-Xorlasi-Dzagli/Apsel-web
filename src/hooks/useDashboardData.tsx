// src/hooks/useDashboardData.tsx (Enhanced version)
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  getOrdersByBusiness,
  getProductsByBusiness,
  getTransactionsByBusiness,
  getCategoriesByBusiness,
} from "@/services/firestoreService";
import { convertFirestoreData } from "@/utils/dbUtils";

export type OrderStatusType =
  | "pending"
  | "processing"
  | "completed"
  | "canceled";
export type DashboardTimeFrame = "week" | "month" | "year";

export interface OrderData {
  id: string;
  date: Date;
  status: OrderStatusType;
  customer_id?: string;
  customerName: string;
  total: number;
  [key: string]: any;
}

export interface ProductData {
  id: string;
  name: string;
  category: string;
  category_id: string;
  price: number;
  stock: number;
  sold: number;
  image?: string;
  [key: string]: any;
}

export interface TransactionData {
  id: string;
  date: Date;
  amount: number;
  type: "sale" | "refund";
  orderId: string;
  customerName: string;
  [key: string]: any;
}

export interface CategoryData {
  id: string;
  name: string;
  [key: string]: any;
}

export interface OrderStatusStats {
  pending: number;
  processing: number;
  completed: number;
  canceled: number;
}

export function useDashboardData() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dashboard data states
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [products, setProducts] = useState<ProductData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);

  // Load initial dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!business || businessLoading) return;

      try {
        setLoading(true);
        setError(null);

        // Fetch data in parallel for better performance
        const [ordersResult, categoriesResult, transactionsResult] =
          await Promise.all([
            // Fetch recent orders (last 100)
            getOrdersByBusiness(business.id, null, null, 100).catch((err) => {
              console.warn("Error fetching orders:", err);
              return { orders: [], lastDoc: null };
            }),

            // Fetch categories
            getCategoriesByBusiness(business.id).catch((err) => {
              console.warn("Error fetching categories:", err);
              return [];
            }),

            // Fetch transactions (last 3 months)
            (async () => {
              const today = new Date();
              const threeMonthsAgo = new Date();
              threeMonthsAgo.setMonth(today.getMonth() - 3);

              try {
                const result = await getTransactionsByBusiness(
                  business.id,
                  threeMonthsAgo,
                  today
                );
                return result;
              } catch (err) {
                console.warn("Error fetching transactions:", err);
                return { transactions: [], lastDoc: null };
              }
            })(),
          ]);

        // Process orders
        const ordersWithNames: OrderData[] = ordersResult.orders.map(
          (order) => {
            const convertedOrder = convertFirestoreData(order);

            return {
              id: convertedOrder.id,
              date: convertedOrder.created_at || new Date(),
              status: (convertedOrder.status as OrderStatusType) || "pending",
              customer_id: convertedOrder.customer?.id,
              customerName:
                convertedOrder.customer?.name || "Anonymous Customer",
              total: convertedOrder.total || 0,
              ...convertedOrder,
            };
          }
        );
        setOrders(ordersWithNames);

        // Process categories
        const categoriesMap = categoriesResult.reduce((map, category) => {
          const converted = convertFirestoreData(category);
          map[converted.id] = {
            id: converted.id,
            name: converted.name,
            ...converted,
          };
          return map;
        }, {} as Record<string, CategoryData>);
        setCategories(Object.values(categoriesMap));

        // Fetch products after we have categories
        try {
          const { products: fetchedProducts } = await getProductsByBusiness(
            business.id
          );

          const productsWithDetails: ProductData[] = [];

          for (const product of fetchedProducts) {
            const convertedProduct = convertFirestoreData(product);
            let totalSold = 0;
            let basePrice = 0;
            let totalStock = 0;

            // Calculate aggregates from product options
            if (convertedProduct.options && convertedProduct.options.length) {
              totalSold = convertedProduct.options.reduce(
                (sum, option) => sum + (option.sold || 0),
                0
              );
              basePrice = convertedProduct.options[0].price || 0;
              totalStock = convertedProduct.options.reduce(
                (sum, option) => sum + (option.stock || 0),
                0
              );
            }

            productsWithDetails.push({
              id: convertedProduct.id,
              name: convertedProduct.name || "Unnamed Product",
              category_id: convertedProduct.category_id,
              category:
                categoriesMap[convertedProduct.category_id]?.name ||
                "Uncategorized",
              price: basePrice,
              stock: totalStock,
              sold: totalSold,
              image: convertedProduct.options?.[0]?.image_url || "",
              ...convertedProduct,
            });
          }
          setProducts(productsWithDetails);
        } catch (err) {
          console.warn("Error fetching products:", err);
          setProducts([]);
        }

        // Process transactions
        const formattedTransactions: TransactionData[] =
          transactionsResult.transactions.map((transaction) => {
            const converted = convertFirestoreData(transaction);
            return {
              id: converted.id,
              date: converted.payment_date || new Date(),
              amount: converted.amount || 0,
              type: (converted.type as "sale" | "refund") || "sale",
              orderId: converted.order_id || "",
              customerName: converted.customer_name || "Anonymous Customer",
              ...converted,
            };
          });
        setTransactions(formattedTransactions);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        toast({
          title: "Error",
          description:
            "Failed to load dashboard data. Some features may not work properly.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [business, businessLoading, toast]);

  // Get recent orders (last 5)
  const getRecentOrders = () => {
    return [...orders]
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  };

  // Get top selling products
  const getTopSellingProducts = (limit = 5) => {
    return [...products]
      .filter((product) => product.sold > 0) // Only include products with sales
      .sort((a, b) => b.sold - a.sold)
      .slice(0, limit);
  };

  // Get order status stats
  const getOrderStatusStats = (): OrderStatusStats => {
    const stats: OrderStatusStats = { pending: 0, processing: 0, completed: 0, canceled: 0 };
    for (const order of orders) {
      const status = order.status?.toLowerCase();
      if (status && stats.hasOwnProperty(status)) {
        stats[status as keyof OrderStatusStats]++;
      }
    }
    return stats;
  };

  // Get orders by status for pie chart
  const getOrdersByStatus = () => {
    return getOrderStatusStats();
  };

  // Get current month orders and compare to last month
  const getOrderStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthOrders = orders.filter((order) => {
      return (
        order.date.getMonth() === currentMonth &&
        order.date.getFullYear() === currentYear
      );
    });

    const lastMonthOrders = orders.filter((order) => {
      return (
        order.date.getMonth() === lastMonth &&
        order.date.getFullYear() === lastMonthYear
      );
    });

    const percentChange = lastMonthOrders.length
      ? ((currentMonthOrders.length - lastMonthOrders.length) /
          lastMonthOrders.length) *
        100
      : 0;

    return {
      count: currentMonthOrders.length,
      percentChange: percentChange.toFixed(1),
      trend: percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral",
    };
  };

  // Get revenue stats
  const getRevenueStats = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentMonthRevenue = transactions
      .filter((transaction) => {
        return (
          transaction.date.getMonth() === currentMonth &&
          transaction.date.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => {
        return (
          sum +
          (transaction.type.toLowerCase() === "sale"
            ? transaction.amount
            : -transaction.amount)
        );
      }, 0);

    const lastMonthRevenue = transactions
      .filter((transaction) => {
        return (
          transaction.date.getMonth() === lastMonth &&
          transaction.date.getFullYear() === lastMonthYear
        );
      })
      .reduce((sum, transaction) => {
        return (
          sum +
          (transaction.type.toLowerCase() === "sale"
            ? transaction.amount
            : -transaction.amount)
        );
      }, 0);

    const percentChange = lastMonthRevenue
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100
      : 0;

    return {
      total: currentMonthRevenue.toFixed(2),
      percentChange: percentChange.toFixed(1),
      trend: percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral",
    };
  };

  // Get revenue data by timeframe for chart
  const getRevenueByTimeframe = (timeframe: DashboardTimeFrame) => {
    const revenueData: Record<string, number> = {};

    // Process transactions based on timeframe
    transactions.forEach((transaction) => {
      const date = transaction.date;
      let key = "";

      switch (timeframe) {
        case "week":
          key = date.toISOString().split("T")[0];
          break;
        case "month":
          key = date.toISOString().split("T")[0];
          break;
        case "year":
          key = `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`;
          break;
      }

      if (!revenueData[key]) {
        revenueData[key] = 0;
      }

      revenueData[key] +=
        transaction.type.toLowerCase() === "sale" ? transaction.amount : -transaction.amount;
    });

    // Generate chart data format
    const now = new Date();
    let startDate: Date;
    let dateKeys: string[] = [];

    if (timeframe === "week") {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        dateKeys.push(date.toISOString().split("T")[0]);
      }
    } else if (timeframe === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      const dayCount = endDate.getDate();

      for (let i = 1; i <= dayCount; i++) {
        const date = new Date(now.getFullYear(), now.getMonth(), i);
        dateKeys.push(date.toISOString().split("T")[0]);
      }
    } else {
      // Year view - last 12 months
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 11);

      for (let i = 0; i < 12; i++) {
        const date = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + i,
          1
        );
        dateKeys.push(
          `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}`
        );
      }
    }

    // Format dates for display
    return dateKeys.map((key) => {
      let label = key;

      if (timeframe === "week") {
        const date = new Date(key);
        label = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
          date
        );
      } else if (timeframe === "month") {
        const date = new Date(key);
        label = date.getDate().toString();
      } else {
        const [year, month] = key.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        label = new Intl.DateTimeFormat("en-US", { month: "short" }).format(
          date
        );
      }

      return {
        date: key,
        revenue: revenueData[key] || 0,
        label,
      };
    });
  };

  return {
    loading,
    error,
    orders,
    products,
    transactions,
    categories,
    getRecentOrders,
    getTopSellingProducts,
    getOrderStatusStats,
    getOrdersByStatus,
    getOrderStats,
    getRevenueStats,
    getRevenueByTimeframe,
  };
}
