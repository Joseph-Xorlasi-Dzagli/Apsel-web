import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";

// Type definitions for our data
type TimeFrame = "week" | "month" | "year";
type Transaction = {
  id: string;
  date: string;
  amount: number;
  type: "sale" | "refund";
  orderId: string;
  customerName: string;
};

type RevenueByDate = {
  [key: string]: number;
};

// Format date based on selected timeframe
const formatDate = (dateString: string, timeframe: TimeFrame) => {
  const date = new Date(dateString);

  switch (timeframe) {
    case "week":
      return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
        date
      );
    case "month":
      return new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
    case "year":
      return new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
    default:
      return dateString;
  }
};

// Helper function to get revenue by timeframe
const getRevenueByTimeframe = (
  transactions: Transaction[],
  timeframeUnit: "day" | "week" | "month" | "year"
): RevenueByDate => {
  const result: RevenueByDate = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    let key = "";

    switch (timeframeUnit) {
      case "day":
        key = date.toISOString().split("T")[0]; // YYYY-MM-DD
        break;
      case "week":
        // Get week number and year
        const oneJan = new Date(date.getFullYear(), 0, 1);
        const weekNum = Math.ceil(
          ((date.getTime() - oneJan.getTime()) / 86400000 +
            oneJan.getDay() +
            1) /
            7
        );
        key = `${date.getFullYear()}-W${weekNum}`;
        break;
      case "month":
        key = `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}`;
        break;
      case "year":
        key = date.getFullYear().toString();
        break;
    }

    if (!result[key]) {
      result[key] = 0;
    }

    result[key] += transaction.amount;
  });

  return result;
};

// Database service for handling transactions
class TransactionDatabase {
  private static instance: TransactionDatabase;
  private db: IDBDatabase | null = null;
  private dbName = "salesAppDB";
  private storeName = "transactions";

  // Singleton pattern
  private constructor() {}

  public static getInstance(): TransactionDatabase {
    if (!TransactionDatabase.instance) {
      TransactionDatabase.instance = new TransactionDatabase();
    }
    return TransactionDatabase.instance;
  }

  // Initialize the database
  public async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        console.error("Error opening database:", event);
        reject(new Error("Could not open database"));
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.log("Database opened successfully");
        resolve();
      };

      request.onupgradeneeded = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;

        // Create the transaction store if it doesn't exist
        if (!this.db.objectStoreNames.contains(this.storeName)) {
          const store = this.db.createObjectStore(this.storeName, {
            keyPath: "id",
          });
          store.createIndex("date", "date", { unique: false });
          console.log("Object store created");
        }
      };
    });
  }

  // Add a transaction to the database
  public async addTransaction(transaction: Transaction): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.add(transaction);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error adding transaction:", event);
        reject(new Error("Could not add transaction"));
      };

      tx.oncomplete = () => {
        console.log("Transaction added successfully");
      };
    });
  }

  // Add multiple transactions at once
  public async addTransactions(transactions: Transaction[]): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);

      transactions.forEach((transaction) => {
        store.add(transaction);
      });

      tx.oncomplete = () => {
        console.log(`${transactions.length} transactions added successfully`);
        resolve();
      };

      tx.onerror = (event) => {
        console.error("Error adding transactions:", event);
        reject(new Error("Could not add transactions"));
      };
    });
  }

  // Get all transactions
  public async getAllTransactions(): Promise<Transaction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Error getting transactions:", event);
        reject(new Error("Could not get transactions"));
      };
    });
  }

  // Get transactions by date range
  public async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<Transaction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readonly");
      const store = tx.objectStore(this.storeName);
      const index = store.index("date");

      // Convert dates to string format for comparison
      const range = IDBKeyRange.bound(
        startDate.toISOString(),
        endDate.toISOString()
      );

      const request = index.getAll(range);

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (event) => {
        console.error("Error getting transactions by date range:", event);
        reject(new Error("Could not get transactions by date range"));
      };
    });
  }

  // Clear all data (for testing)
  public async clearAllData(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(this.storeName, "readwrite");
      const store = tx.objectStore(this.storeName);
      const request = store.clear();

      request.onsuccess = () => {
        console.log("All transactions cleared");
        resolve();
      };

      request.onerror = (event) => {
        console.error("Error clearing transactions:", event);
        reject(new Error("Could not clear transactions"));
      };
    });
  }
}

// Function to generate sample data for database seeding
const generateSampleTransactions = (count: number): Transaction[] => {
  const transactions: Transaction[] = [];
  const types: ("sale" | "refund")[] = [
    "sale",
    "sale",
    "sale",
    "sale",
    "refund",
  ]; // 80% sales, 20% refunds
  const customers = [
    "Tina Awuntastubborn",
    "Joseph Akurugu Avoka",
    "Winifred Korewaa Adjei",
    "Mike Mazowski",
    "Sarah Johnson",
    "James Williams",
    "Emily Brown",
  ];

  // Generate transactions for the last 3 months
  const now = new Date();
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(now.getMonth() - 3);

  for (let i = 0; i < count; i++) {
    const date = new Date(
      threeMonthsAgo.getTime() +
        Math.random() * (now.getTime() - threeMonthsAgo.getTime())
    );

    const type = types[Math.floor(Math.random() * types.length)];
    const amount = parseFloat((Math.random() * 200 + 20).toFixed(2));

    transactions.push({
      id: `trans-${i + 1}`,
      date: date.toISOString(),
      amount: type === "refund" ? -amount : amount,
      type,
      orderId: `${Math.floor(100000 + Math.random() * 900000)}`,
      customerName: customers[Math.floor(Math.random() * customers.length)],
    });
  }

  // Sort by date (newest first)
  transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return transactions;
};

// Prepare chart data based on timeframe
const prepareChartData = (
  transactions: Transaction[],
  timeframe: TimeFrame
) => {
  const revenueData = getRevenueByTimeframe(
    transactions,
    timeframe === "week" ? "day" : timeframe === "month" ? "day" : "month"
  );

  const now = new Date();
  let startDate: Date;
  let dateKeys: string[] = [];

  // Generate date keys based on timeframe
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

  // Create chart data with dates and revenues
  return dateKeys.map((key) => {
    return {
      date: key,
      revenue: revenueData[key] || 0,
      label: formatDate(key, timeframe),
    };
  });
};

export function SalesChart() {
  const [timeframe, setTimeframe] = useState<TimeFrame>("week");
  const [chartData, setChartData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDbInitialized, setIsDbInitialized] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  // Initialize database and load transactions
  useEffect(() => {
    const initDb = async () => {
      try {
        const db = TransactionDatabase.getInstance();
        await db.init();
        setIsDbInitialized(true);

        // Get all transactions from the database
        let allTransactions = await db.getAllTransactions();

        // If no transactions exist, generate sample data and add to database
        if (allTransactions.length === 0) {
          const sampleTransactions = generateSampleTransactions(100);
          await db.addTransactions(sampleTransactions);
          allTransactions = sampleTransactions;

          toast({
            title: "Sample data generated",
            description:
              "The chart is now displaying sample sales data from the database.",
          });
        }

        setTransactions(allTransactions);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to initialize database:", error);
        toast({
          title: "Database Error",
          description:
            "Could not connect to the database. Using fallback data.",
          variant: "destructive",
        });

        // Fallback to generated data without storing in DB
        const fallbackData = generateSampleTransactions(100);
        setTransactions(fallbackData);
        setIsLoading(false);
      }
    };

    initDb();
  }, [toast]);

  // Update chart data when timeframe or transactions change
  useEffect(() => {
    if (transactions.length > 0) {
      setChartData(prepareChartData(transactions, timeframe));
    }
  }, [timeframe, transactions]);

  // Function to reset database (for testing purposes)
  const handleResetDatabase = async () => {
    try {
      setIsLoading(true);
      const db = TransactionDatabase.getInstance();
      await db.clearAllData();

      // Generate new sample data
      const sampleTransactions = generateSampleTransactions(100);
      await db.addTransactions(sampleTransactions);

      setTransactions(sampleTransactions);
      setChartData(prepareChartData(sampleTransactions, timeframe));

      toast({
        title: "Database Reset",
        description: "New sample data has been generated.",
      });
    } catch (error) {
      console.error("Failed to reset database:", error);
      toast({
        title: "Reset Failed",
        description: "Could not reset the database.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="col-span-2 animate-in-slide">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview (GHS)</CardTitle>
          <CardDescription>
            {timeframe === "week"
              ? "Revenue for the last 7 days"
              : timeframe === "month"
              ? "Revenue for the current month"
              : "Revenue for the last 12 months"}
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <Tabs
            defaultValue="week"
            onValueChange={(value) => setTimeframe(value as TimeFrame)}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[350px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              {timeframe === "year" ? (
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    height={40}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={60}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`GHS ${value}`, "Revenue"]}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--brand))"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              ) : (
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--brand))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--brand))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    height={40}
                    dy={30}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    width={80}
                    dx={-10}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    formatter={(value) => [`GHS ${value}`, "Revenue"]}
                    labelFormatter={(value) => `${value}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--brand))"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        )}

        {/* Testing tools - can be removed in production */}
        <div className="mt-4 flex justify-end">
          <button
            className="text-xs text-muted-foreground hover:underline"
            onClick={handleResetDatabase}>
            Reset Sample Data
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
