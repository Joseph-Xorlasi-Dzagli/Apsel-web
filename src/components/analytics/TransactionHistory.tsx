// src/components/analytics/TransactionHistory.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowDown,
  ArrowUp,
  Loader2,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

type GroupBy = "none" | "day" | "month" | "year";

export function TransactionHistory() {
  const isMobile = useIsMobile();
  const { transactions, loading } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
  const [timeframe, setTimeframe] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [groupBy, setGroupBy] = useState<GroupBy>("none");
  const itemsPerPage = 10;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  };

  const filterTransactions = () => {
    let filtered = [...transactions];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.id.toLowerCase().includes(term) ||
          transaction.customerName.toLowerCase().includes(term) ||
          transaction.orderId.toLowerCase().includes(term)
      );
    }

    // Filter by timeframe
    if (timeframe !== "all") {
      const now = new Date();
      let startDate: Date;

      switch (timeframe) {
        case "today":
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate = new Date(0);
      }

      filtered = filtered.filter(
        (transaction) => transaction.date >= startDate
      );
    }

    return filtered;
  };

  // Group transactions by time period
  const groupTransactions = (transactions: any[]) => {
    if (groupBy === "none") {
      return { grouped: false, data: transactions };
    }

    const groups: Record<string, any> = {};

    transactions.forEach((transaction) => {
      const date = transaction.date;
      let key = "";

      if (groupBy === "day") {
        key = format(date, "yyyy-MM-dd");
      } else if (groupBy === "month") {
        key = format(date, "yyyy-MM");
      } else if (groupBy === "year") {
        key = format(date, "yyyy");
      }

      if (!groups[key]) {
        groups[key] = {
          key,
          label:
            groupBy === "day"
              ? format(date, "MMM dd, yyyy")
              : groupBy === "month"
              ? format(date, "MMMM yyyy")
              : format(date, "yyyy"),
          transactions: [],
          totalAmount: 0,
          salesCount: 0,
          refundsCount: 0,
        };
      }

      groups[key].transactions.push(transaction);
      groups[key].totalAmount += transaction.amount;

      if (transaction.type.toLowerCase() === "sale") {
        groups[key].salesCount++;
      } else {
        groups[key].refundsCount++;
      }
    });

    return {
      grouped: true,
      data: Object.values(groups).sort((a, b) => b.key.localeCompare(a.key)),
    };
  };

  const filteredTransactions = filterTransactions();
  const groupedData = groupTransactions(filteredTransactions);

  const paginatedData = groupedData.grouped
    ? groupedData.data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : groupedData.data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );

  const totalPages = Math.ceil(groupedData.data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, timeframe, groupBy]);

  return (
    <Card className="w-full border-none p-0">
      <CardHeader className="p-0">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View and filter your transaction records
            </CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 border-t pt-4">
          <Tabs
            defaultValue="none"
            onValueChange={(value) => setGroupBy(value as GroupBy)}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="none">Individual</TabsTrigger>
                <TabsTrigger value="day">Daily</TabsTrigger>
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">Yearly</TabsTrigger>
              </TabsList>

              {groupedData.grouped && (
                <div className="text-sm text-muted-foreground">
                  Viewing totals by{" "}
                  {groupBy === "day"
                    ? "day"
                    : groupBy === "month"
                    ? "month"
                    : "year"}
                </div>
              )}
            </div>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="mt-4 p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading transactions...</span>
            </div>
          </div>
        ) : groupedData.grouped ? (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                      Period
                    </th>
                    <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                      Sales
                    </th>
                    <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                      Refunds
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((group: any) => (
                    <tr
                      key={group.key}
                      className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-medium">{group.label}</td>
                      <td className="p-3 text-right">
                        <span
                          className={`font-medium ${
                            group.totalAmount >= 0
                              ? "text-status-completed"
                              : "text-status-canceled"
                          }`}>
                          {group.totalAmount >= 0 ? "+" : ""}GHS{" "}
                          {group.totalAmount.toFixed(2)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Badge
                          variant="outline"
                          className="bg-brand/10 text-brand hover:bg-brand/20">
                          {group.salesCount}
                        </Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Badge
                          variant="outline"
                          className="bg-status-canceled/10 text-status-canceled hover:bg-status-canceled/20">
                          {group.refundsCount}
                        </Badge>
                      </td>
                    </tr>
                  ))}

                  {paginatedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="p-6 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                      Date
                    </th>
                    <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                      Order ID
                    </th>
                    <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                      Customer
                    </th>
                    <th className="text-left p-3 font-medium text-xs uppercase text-muted-foreground">
                      Type
                    </th>
                    <th className="text-right p-3 font-medium text-xs uppercase text-muted-foreground">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((transaction: any) => (
                    <tr
                      key={transaction.id}
                      className="border-t hover:bg-muted/50 transition-colors">
                      <td className="p-3 text-sm">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="p-3 text-sm">
                        #{transaction.orderId.slice(-6)}
                      </td>
                      <td className="p-3 text-sm">
                        {transaction.customerName}
                      </td>
                      <td className="p-3">
                        {transaction.type.toLowerCase() === "sale" ? (
                          <Badge className="bg-brand/10 text-brand hover:bg-brand/20">
                            Sale
                          </Badge>
                        ) : (
                          <Badge className="bg-status-canceled/10 text-status-canceled hover:bg-status-canceled/20">
                            Refund
                          </Badge>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <span
                          className={`flex items-center justify-end font-medium ${
                            transaction.amount >= 0
                              ? "text-status-completed"
                              : "text-status-canceled"
                          }`}>
                          {transaction.amount >= 0 ? (
                            <ArrowUp className="mr-1 h-3 w-3" />
                          ) : (
                            <ArrowDown className="mr-1 h-3 w-3" />
                          )}
                          GHS {Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {paginatedData.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="p-6 text-center text-muted-foreground">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-3 border-t mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, groupedData.data.length)} of{" "}
              {groupedData.data.length}{" "}
              {groupedData.grouped ? "periods" : "transactions"}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
