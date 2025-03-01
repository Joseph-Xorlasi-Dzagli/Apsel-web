
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <Layout>
                <Index />
              </Layout>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <Layout>
                <Analytics />
              </Layout>
            } 
          />
          <Route 
            path="/sales-chart" 
            element={
              <Layout>
                <SalesChartPage />
              </Layout>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <Layout>
                <Orders />
              </Layout>
            } 
          />
          <Route 
            path="/orders/:id" 
            element={
              <Layout>
                <OrderDetail />
              </Layout>
            } 
          />
          <Route 
            path="/inventory" 
            element={
              <Layout>
                <Inventory />
              </Layout>
            } 
          />
          <Route 
            path="/business-hub" 
            element={
              <Layout>
                <BusinessHub />
              </Layout>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <Layout>
                <Notifications />
              </Layout>
            } 
          />
          <Route 
            path="/faqs" 
            element={
              <Layout>
                <HelpFAQ />
              </Layout>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <Layout>
                <Settings />
              </Layout>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
