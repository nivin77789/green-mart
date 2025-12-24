import { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import { NotificationProvider } from "./contexts/NotificationContext";

// Lazy Load Pages
const Gateway = lazy(() => import("./pages/Gateway"));
const AppGallery = lazy(() => import("./pages/AppGallery"));
const NotFound = lazy(() => import("./pages/NotFound"));
const OrderManagement = lazy(() => import("./pages/OrderManagement"));
const PremiumEntry = lazy(() => import("./pages/PremiumEntry"));
const RatingEntry = lazy(() => import("./pages/RatingEntry"));
const StockEntry = lazy(() => import("./pages/StockEntry"));
const ProductEntry = lazy(() => import("./pages/ProductEntry"));
const DeliveryScreen = lazy(() => import("./pages/DeliveryScreen"));
const Overview = lazy(() => import("./pages/Overview"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AIChat = lazy(() => import("./pages/AIChat"));
const CustomApp = lazy(() => import("./pages/CustomApp"));
const KeywordEntry = lazy(() => import("./pages/KeywordEntry"));
const BackOffice = lazy(() => import("./pages/BackOffice"));
const EmployeeManagement = lazy(() => import("./pages/EmployeeManagement"));
const TaskManager = lazy(() => import("./pages/TaskManager"));
const NotificationManager = lazy(() => import("./pages/NotificationManager"));
const Staffes = lazy(() => import("./pages/Staffes"));

const queryClient = new QueryClient();

// Loading Fallback Component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <NotificationProvider>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Gateway />} />
              <Route path="/apps" element={<AppGallery />} />
              <Route path="/orders" element={<OrderManagement />} />
              <Route path="/premium-entry" element={<PremiumEntry />} />
              <Route path="/rating-entry" element={<RatingEntry />} />
              <Route path="/stock-entry" element={<StockEntry />} />
              <Route path="/product-entry" element={<ProductEntry />} />
              <Route path="/delivery" element={<DeliveryScreen />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/chat" element={<AIChat />} />
              <Route path="/custom-app/:id" element={<CustomApp />} />
              <Route path="/keyword-entry" element={<KeywordEntry />} />
              <Route path="/back-office" element={<BackOffice />} />

              <Route path="/employee-management" element={<EmployeeManagement />} />
              <Route path="/tasks" element={<TaskManager />} />
              <Route path="/notifications" element={<NotificationManager />} />
              <Route path="/staffes" element={<Staffes />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
