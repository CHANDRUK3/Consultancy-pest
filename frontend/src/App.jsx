// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import HomePage from "./pages/Home";
import Products from "./pages/ProductPage";
import Pesticides from "./pages/PesticideCatalog";
import ProductDetailPage from "./pages/ProductDetailPage";
import Billing from "./pages/BillingPage";
import Recommendations from "./pages/SmartRecommendation";
import Footer from "./components/Footer";

// ── Admin imports ────────────────────────────────────────────────
import AdminLogin from "./admin/pages/Login";
import AdminLayout from "./admin/components/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import StockOverview from "./admin/pages/Inventory/StockOverview";
import ExpiryAlerts from "./admin/pages/Inventory/ExpiryAlerts";
import AddPurchase from "./admin/pages/Inventory/AddPurchase";
import SalesHistory from "./admin/pages/Sales/SalesHistory";
import AddSale from "./admin/pages/Sales/AddSale";
import ProductsMaster from "./admin/pages/Masters/ProductsMaster";
import Categories from "./admin/pages/Masters/Categories";
import GovernmentReport from "./admin/pages/Reports/GovernmentReport";

function App() {
  // Very simple client-side check (replace with real JWT + context later)
  const isAdminLoggedIn = !!localStorage.getItem("adminToken");

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navigation isAdminLoggedIn={isAdminLoggedIn} />

        <main className="flex-grow">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/pesticides" element={<Pesticides />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/recommendation" element={<Recommendations />} />

            {/* Admin public route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            {isAdminLoggedIn ? (
              <Route element={<AdminLayout />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/inventory" element={<StockOverview />} />
                <Route path="/admin/inventory/expiry" element={<ExpiryAlerts />} />
                <Route path="/admin/inventory/purchase" element={<AddPurchase />} />
                <Route path="/admin/sales" element={<SalesHistory />} />
                <Route path="/admin/sales/add" element={<AddSale />} />
                <Route path="/admin/masters/products" element={<ProductsMaster />} />
                <Route path="/admin/masters/categories" element={<Categories />} />
                <Route path="/admin/reports/government" element={<GovernmentReport />} />

                {/* Placeholder for future admin pages */}
                <Route path="/admin/*" element={<div className="p-10 text-2xl">Coming soon...</div>} />
              </Route>
            ) : (
              <Route
                path="/admin/*"
                element={
                  <div className="p-20 text-center text-xl">
                    <h2 className="text-3xl font-bold text-red-600 mb-6">Admin Access Restricted</h2>
                    <p>Please <a href="/admin/login" className="text-teal-600 underline">login</a> to continue.</p>
                  </div>
                }
              />
            )}

            {/* 404 / fallback */}
            <Route
              path="*"
              element={
                <div className="p-20 text-center">
                  <h2 className="text-3xl font-bold text-slate-400">Section Coming Soon</h2>
                  <p className="mt-4 text-slate-500">
                    We are currently building this part of the Anand Agro platform.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;