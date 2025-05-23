// src/hooks/useAnalytics.tsx (Enhanced version)
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBusiness } from "@/hooks/useBusiness";
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { convertFirestoreData } from "@/utils/dbUtils";
import { startOfDay, endOfDay, subDays, subMonths, format } from "date-fns";

export type Order = {
  id: string;
  status: "pending" | "processing" | "completed" | "canceled";
  date: Date;
  customerName: string;
  total: number;
  items: any[];
};

export type Transaction = {
  id: string;
  date: Date;
  orderId: string;
  customerName: string;
  type: "sale" | "refund";
  amount: number;
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  image?: string;
};

export type DateRangeFilter = {
  name: string;
  startDate: Date;
  endDate: Date;
};

interface AnalyticsState {
  orders: Order[];
  transactions: Transaction[];
  products: Product[];
  filters: {
    dateRange: DateRangeFilter;
  };
  orderStats: {
    total: number;
    completed: number;
    processing: number;
    pending: number;
    canceled: number;
    percentChange: number;
    trend: "up" | "down" | "neutral";
  };
  revenueStats: {
    total: number;
    percentChange: number;
    trend: "up" | "down" | "neutral";
  };
  loading: boolean;
  error: string | null;
}

export function useAnalytics() {
  const { toast } = useToast();
  const { business, loading: businessLoading } = useBusiness();

  // Custom date ranges as specified
  const defaultDateRanges: DateRangeFilter[] = useMemo(
    () => [
      {
        name: "Last 7 Days",
        startDate: subDays(startOfDay(new Date()), 6),
        endDate: endOfDay(new Date()),
      },
      {
        name: "Last 30 Days",
        startDate: subDays(startOfDay(new Date()), 29),
        endDate: endOfDay(new Date()),
      },
      {
        name: "Last 90 Days",
        startDate: subDays(startOfDay(new Date()), 89),
        endDate: endOfDay(new Date()),
      },
      {
        name: "Last 12 Months",
        startDate: subMonths(startOfDay(new Date()), 11),
        endDate: endOfDay(new Date()),
      },
      {
        name: "Year to Date",
        startDate: new Date(new Date().getFullYear(), 0, 1),
        endDate: endOfDay(new Date()),
      },
      {
        name: "All Time",
        startDate: new Date(2020, 0, 1), // Arbitrary start date in the past
        endDate: endOfDay(new Date()),
      },
    ],
    []
  );

  // Pre-initialize with empty values to avoid undefined errors
  const initialState: AnalyticsState = {
    orders: [],
    transactions: [],
    products: [],
    filters: {
      dateRange: defaultDateRanges[0], // Default to "Last 7 Days"
    },
    orderStats: {
      total: 0,
      completed: 0,
      processing: 0,
      pending: 0,
      canceled: 0,
      percentChange: 0,
      trend: "neutral",
    },
    revenueStats: {
      total: 0,
      percentChange: 0,
      trend: "neutral",
    },
    loading: true,
    error: null,
  };

  const [state, setState] = useState<AnalyticsState>(initialState);

  // Update date range filter
  const updateDateRange = (dateRange: DateRangeFilter) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        dateRange,
      },
    }));
  };

  // Fetch orders within the current date range
  const fetchOrders = async () => {
    if (!business?.id) return [];

    try {
      const { startDate, endDate } = state.filters.dateRange;

      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("business_id", "==", business.id),
        orderBy("created_at", "desc")
      );

      const querySnapshot = await getDocs(q);
      const allOrders = querySnapshot.docs.map((doc) =>
        convertFirestoreData({ id: doc.id, ...doc.data() })
      );

      // Filter by date range in memory
      const filteredOrders = allOrders.filter((orderData) => {
        const orderDate = orderData.created_at;
        return orderDate >= startDate && orderDate <= endDate;
      });

      const orders: Order[] = [];

      // Process orders and get items for each order
      for (const orderData of filteredOrders) {
        // Fetch order items from subcollection
        const itemsRef = collection(db, "orders", orderData.id, "items");
        const itemsSnapshot = await getDocs(itemsRef);

        const items = itemsSnapshot.docs.map((itemDoc) =>
          convertFirestoreData({ id: itemDoc.id, ...itemDoc.data() })
        );

        // Get customer name from embedded customer data or fallback
        let customerName = "Guest";
        if (orderData.customer) {
          customerName = orderData.customer.name || "Unknown Customer";
        }

        orders.push({
          id: orderData.id,
          status: orderData.status,
          date: orderData.created_at,
          customerName,
          total: orderData.total || 0,
          items,
        });
      }

      return orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  };

  // Fetch transactions within the current date range
  const fetchTransactions = async () => {
    if (!business?.id) return [];

    try {
      const { startDate, endDate } = state.filters.dateRange;

      const transactionsRef = collection(db, "transactions");
      const q = query(
        transactionsRef,
        where("business_id", "==", business.id),
        orderBy("payment_date", "desc")
      );

      const querySnapshot = await getDocs(q);
      const allTransactions = querySnapshot.docs.map((doc) =>
        convertFirestoreData({ id: doc.id, ...doc.data() })
      );

      // Filter by date range in memory
      const filteredTransactions = allTransactions.filter((transData) => {
        const paymentDate = transData.payment_date;
        return paymentDate >= startDate && paymentDate <= endDate;
      });

      const transactions: Transaction[] = filteredTransactions.map(
        (transData) => ({
          id: transData.id,
          date: transData.payment_date,
          orderId: transData.order_id || "",
          customerName: transData.customer_name || "Unknown",
          type: transData.type === "refund" ? "refund" : "sale",
          amount: transData.amount || 0,
        })
      );

      return transactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  // Fetch product performance
  const fetchProductPerformance = async () => {
    if (!business?.id) return [];

    try {
      // First get all products
      const productsRef = collection(db, "products");
      const q = query(productsRef, where("business_id", "==", business.id));

      const querySnapshot = await getDocs(q);
      const productsData = querySnapshot.docs.map((doc) =>
        convertFirestoreData({ id: doc.id, ...doc.data() })
      );

      // Get product options and their sales stats
      const productsWithOptions = [];
      for (const product of productsData) {
        const optionsRef = collection(db, "product_options");
        const optionsQuery = query(
          optionsRef,
          where("product_id", "==", product.id)
        );

        const optionsSnapshot = await getDocs(optionsQuery);
        const options = optionsSnapshot.docs.map((doc) =>
          convertFirestoreData({ id: doc.id, ...doc.data() })
        );

        // Get category name
        let categoryName = "Uncategorized";
        if (product.category_id) {
          const categoriesRef = collection(db, "categories");
          const categoryQuery = query(
            categoriesRef,
            where("business_id", "==", business.id)
          );
          const categoriesSnapshot = await getDocs(categoryQuery);
          const category = categoriesSnapshot.docs
            .map((doc) => convertFirestoreData({ id: doc.id, ...doc.data() }))
            .find((cat) => cat.id === product.category_id);

          if (category) {
            categoryName = category.name;
          }
        }

        // Calculate totals from options
        let totalSold = 0;
        let totalStock = 0;
        let averagePrice = 0;

        if (options.length > 0) {
          totalSold = options.reduce(
            (sum, option) => sum + (option.sold || 0),
            0
          );
          totalStock = options.reduce(
            (sum, option) => sum + (option.stock || 0),
            0
          );
          averagePrice =
            options.reduce((sum, option) => sum + (option.price || 0), 0) /
            options.length;
        }

        productsWithOptions.push({
          id: product.id,
          name: product.name,
          category: categoryName,
          price: averagePrice,
          stock: totalStock,
          sold: totalSold,
          image: options[0]?.image_url || undefined,
        });
      }

      return productsWithOptions;
    } catch (error) {
      console.error("Error fetching product performance:", error);
      throw error;
    }
  };

  // Calculate order statistics with comparison to previous period
  const calculateOrderStats = async (orders: Order[]) => {
    // Count orders by status
    const statusCounts = orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Get orders from previous period for comparison
    const { dateRange } = state.filters;
    const currentPeriodStart = dateRange.startDate;
    const currentPeriodEnd = dateRange.endDate;
    const periodDuration =
      currentPeriodEnd.getTime() - currentPeriodStart.getTime();

    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
    const previousPeriodStart = new Date(
      previousPeriodEnd.getTime() - periodDuration
    );

    // Fetch previous period orders
    let previousOrders: any[] = [];
    if (business?.id) {
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("business_id", "==", business.id));
        const querySnapshot = await getDocs(q);

        previousOrders = querySnapshot.docs
          .map((doc) => convertFirestoreData({ id: doc.id, ...doc.data() }))
          .filter((orderData) => {
            const orderDate = orderData.created_at;
            return (
              orderDate >= previousPeriodStart && orderDate <= previousPeriodEnd
            );
          });
      } catch (error) {
        console.error("Error fetching previous period orders:", error);
      }
    }

    const currentTotal = orders.length;
    const previousTotal = previousOrders.length;

    let percentChange = 0;
    let trend: "up" | "down" | "neutral" = "neutral";

    if (previousTotal > 0) {
      percentChange = ((currentTotal - previousTotal) / previousTotal) * 100;
      trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";
    }

    return {
      total: currentTotal,
      completed: statusCounts.completed || 0,
      processing: statusCounts.processing || 0,
      pending: statusCounts.pending || 0,
      canceled: statusCounts.canceled || 0,
      percentChange,
      trend,
    };
  };

  // Calculate revenue statistics with comparison to previous period
  const calculateRevenueStats = async (transactions: Transaction[]) => {
    // Calculate total revenue
    const total = transactions.reduce(
      (sum, transaction) =>
        sum +
        (transaction.type.toLowerCase() === "sale"
          ? transaction.amount
          : -transaction.amount),
      0
    );

    // Get transactions from previous period for comparison
    const { dateRange } = state.filters;
    const currentPeriodStart = dateRange.startDate;
    const currentPeriodEnd = dateRange.endDate;
    const periodDuration =
      currentPeriodEnd.getTime() - currentPeriodStart.getTime();

    const previousPeriodEnd = new Date(currentPeriodStart.getTime() - 1);
    const previousPeriodStart = new Date(
      previousPeriodEnd.getTime() - periodDuration
    );

    // Fetch previous period transactions
    let previousTransactions: any[] = [];
    if (business?.id) {
      try {
        const transactionsRef = collection(db, "transactions");
        const q = query(
          transactionsRef,
          where("business_id", "==", business.id)
        );
        const querySnapshot = await getDocs(q);

        previousTransactions = querySnapshot.docs
          .map((doc) => convertFirestoreData({ id: doc.id, ...doc.data() }))
          .filter((transData) => {
            const paymentDate = transData.payment_date;
            return (
              paymentDate >= previousPeriodStart &&
              paymentDate <= previousPeriodEnd
            );
          });
      } catch (error) {
        console.error("Error fetching previous period transactions:", error);
      }
    }

    const previousTotal = previousTransactions.reduce(
      (sum, transData) =>
        sum +
        (transData.type === "refund" ? -transData.amount : transData.amount),
      0
    );

    let percentChange = 0;
    let trend: "up" | "down" | "neutral" = "neutral";

    if (previousTotal > 0) {
      percentChange = ((total - previousTotal) / previousTotal) * 100;
      trend = percentChange > 0 ? "up" : percentChange < 0 ? "down" : "neutral";
    }

    return {
      total,
      percentChange,
      trend,
    };
  };

  // Group revenue by time period
  const getRevenueByTimeframe = (
    transactions: Transaction[],
    groupBy: "day" | "month" | "year"
  ) => {
    const result: Record<string, number> = {};

    transactions.forEach((transaction) => {
      const date = transaction.date;
      let key = "";

      if (groupBy === "day") {
        key = format(date, "yyyy-MM-dd");
      } else if (groupBy === "month") {
        key = format(date, "yyyy-MM");
      } else {
        key = format(date, "yyyy");
      }

      if (!result[key]) {
        result[key] = 0;
      }

      result[key] +=
        transaction.type.toLowerCase() === "sale" ? transaction.amount : -transaction.amount;
    });

    return result;
  };

  // Get top selling products
  const getTopSellingProducts = (products: Product[], count = 5) => {
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, count);
  };

  // Get orders by status
  const getOrdersByStatus = (orders: Order[]) => {
    const counts = {
      completed: 0,
      processing: 0,
      pending: 0,
      canceled: 0,
    };

    orders.forEach((order) => {
      if (order.status in counts) {
        counts[order.status as keyof typeof counts]++;
      }
    });

    return counts;
  };

  // Update data based on filters
  useEffect(() => {
    const fetchData = async () => {
      if (businessLoading || !business) return;

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Fetch all data in parallel
        const [orders, transactions, products] = await Promise.all([
          fetchOrders(),
          fetchTransactions(),
          fetchProductPerformance(),
        ]);

        // Calculate statistics
        const orderStats = await calculateOrderStats(orders);
        const revenueStats = await calculateRevenueStats(transactions);

        setState((prev) => ({
          ...prev,
          orders,
          transactions,
          products,
          orderStats,
          revenueStats,
          loading: false,
        }));
      } catch (error: any) {
        console.error("Error fetching analytics data:", error);
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error.message || "Failed to load analytics data",
        }));

        toast({
          title: "Error",
          description: "Failed to load analytics data: " + error.message,
          variant: "destructive",
        });
      }
    };

    fetchData();
  }, [business, businessLoading, state.filters.dateRange, toast]);

  return {
    ...state,
    defaultDateRanges,
    updateDateRange,
    getRevenueByTimeframe,
    getTopSellingProducts,
    getOrdersByStatus,
  };
}
