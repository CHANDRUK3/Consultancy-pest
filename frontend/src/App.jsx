import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navigation from "./components/Navigation"
import HomePage from "./pages/Home" // Assuming you saved the Home code in src/pages/Home.jsx
import Products from "./pages/ProductPage"
import Pesticides from "./pages/PesticideCatalog"
import ProductDetailPage from "./pages/ProductDetailPage"
import Billing from "./pages/BillingPage"
import Recommendations from "./pages/SmartRecommendation"
import Footer from "./components/Footer"
const AdminLogin = () => <div className="p-20 text-center text-2xl font-bold text-teal-900">Admin Login Portal</div>

function App() {
  // Set to true to see the Dashboard/Sales links
  const isAdminLoggedIn = false 

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navigation is always visible at the top */}
        <Navigation isAdminLoggedIn={isAdminLoggedIn} />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/pesticides" element={<Pesticides />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/recommendation" element={<Recommendations />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Catch-all for "Coming Soon" pages */}
            <Route path="*" element={
              <div className="p-20 text-center">
                <h2 className="text-3xl font-bold text-slate-400">Section Coming Soon</h2>
                <p className="mt-4 text-slate-500">We are currently building this part of the Anand Agro platform.</p>
              </div>
            } />
          </Routes>
        </main>
          <Footer />
      </div>
    
    </Router>
  )
}

export default App