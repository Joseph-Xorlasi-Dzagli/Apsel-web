import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import AppInitializer from "./components/AppInitializer";
import Index from "./pages/Index";
import Analytics from "./pages/Analytics";
import SalesChartPage from "./pages/SalesChart";
import Orders from "./pages/Orders";
import OrderDetail from "./pages/OrderDetail";
import Inventory from "./pages/Inventory";
import BusinessHub from "./pages/BusinessHub";
import Notifications from "./pages/Notifications";
import HelpFAQ from "./pages/HelpFAQ";
import Settings from "./pages/Settings";
import Billing from "./pages/Billing";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import ConfirmSubscription from "./pages/ConfirmSubscription";
import NotFound from "./pages/NotFound";
import ViewAllBillingHistory from "./pages/ViewAllBillingHistory";
import OrderStatuses from "./pages/OrderStatuses";
import CreateOrder from "./pages/CreateOrder";
import Auth from "./pages/Auth";
import Customers from "./pages/Customers";
import PrivateRoute from "./components/auth/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppInitializer>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Index />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders/statuses"
                element={
                  <PrivateRoute>
                    <Layout>
                      <OrderStatuses />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders/create"
                element={
                  <PrivateRoute>
                    <Layout>
                      <CreateOrder />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/sales-chart"
                element={
                  <PrivateRoute>
                    <Layout>
                      <SalesChartPage />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Orders />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/orders/:id"
                element={
                  <PrivateRoute>
                    <Layout>
                      <OrderDetail />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/inventory"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Inventory />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/business-hub"
                element={
                  <PrivateRoute>
                    <Layout>
                      <BusinessHub />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Notifications />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/faqs"
                element={
                  <PrivateRoute>
                    <Layout>
                      <HelpFAQ />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/billing"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Billing />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/billing/plans"
                element={
                  <PrivateRoute>
                    <Layout>
                      <SubscriptionPlans />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/customers"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Customers />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/billing/history"
                element={
                  <PrivateRoute>
                    <Layout>
                      <ViewAllBillingHistory />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/billing/confirm"
                element={
                  <PrivateRoute>
                    <Layout>
                      <ConfirmSubscription />
                    </Layout>
                  </PrivateRoute>
                }
              />

              {/* Redirect to auth if not authenticated */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AppInitializer>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
