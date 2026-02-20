// src/components/Navigation.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";

function Navigation({ isAdminLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");   // ← important: clear the flag
    setMenuOpen(false);
    navigate("/");                           // or "/admin/login" if you prefer
    // Optional: window.location.reload();   // to fully reset state
  };

  const closeMenus = () => setMenuOpen(false);

  const publicLinkClass =
    "text-slate-700 font-medium text-sm px-3 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-emerald-600 whitespace-nowrap";

  const adminLinkClass =
    "text-emerald-700 font-semibold text-sm px-4 py-2 rounded-lg transition-all hover:bg-emerald-50 hover:text-emerald-800 whitespace-nowrap flex items-center gap-1.5";

  const adminLogoutClass =
    "flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors";

  return (
    <nav className="sticky top-0 z-[2000] w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        {/* LOGO */}
        <Link to="/" className="flex flex-col leading-none min-w-fit" onClick={closeMenus}>
          <span className="text-xl sm:text-2xl font-black text-[#406661] uppercase tracking-tighter">
            Anand Agro
          </span>
          <span className="text-[9px] sm:text-[10px] font-bold text-[#2aa904] tracking-[2px] mt-0.5 text-center">
            Agencies
          </span>
        </Link>

        {/* MOBILE MENU TOGGLE */}
        <button className="lg:hidden p-2 text-[#406661]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION LINKS */}
        <ul
          className={`
            fixed lg:static top-16 sm:top-20 left-0 w-full lg:w-auto h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] lg:h-auto 
            bg-white lg:bg-transparent flex flex-col lg:flex-row items-center lg:items-center p-8 lg:p-0 gap-5 lg:gap-2
            transition-transform duration-300 ease-in-out z-50 overflow-y-auto lg:overflow-visible
            ${menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
          `}
        >
          {isAdminLoggedIn ? (
            // ── ADMIN MODE ──────────────────────────────────────────────
            <>
              <li className="w-full lg:w-auto border-t lg:border-t-0 border-slate-200 pt-4 lg:pt-0 mt-2 lg:mt-0 lg:ml-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50/70 rounded-lg text-emerald-700 font-semibold">
                  <ShieldCheck size={18} />
                  Admin Mode
                </div>
              </li>

              <li>
                <Link to="/admin/dashboard" className={adminLinkClass} onClick={closeMenus}>
                  Dashboard
                </Link>
              </li>

              {/* You can add quick links to main admin sections here */}
              <li>
                <Link to="/admin/inventory" className={adminLinkClass} onClick={closeMenus}>
                  Inventory
                </Link>
              </li>
              <li>
                <Link to="/admin/sales" className={adminLinkClass} onClick={closeMenus}>
                  Sales
                </Link>
              </li>
              <li>
                <Link to="/admin/reports/government" className={adminLinkClass} onClick={closeMenus}>
                  Reports
                </Link>
              </li>

              <li className="mt-6 lg:mt-0 lg:ml-6">
                <button className={adminLogoutClass} onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}>
                  <LogOut size={16} />
                  Logout
                </button>
              </li>
            </>
          ) : (
            // ── PUBLIC / NORMAL VISITOR ────────────────────────────────
            <>
              <li><Link to="/" className={publicLinkClass} onClick={closeMenus}>Home</Link></li>
              <li><Link to="/products" className={publicLinkClass} onClick={closeMenus}>Products</Link></li>
              <li><Link to="/pesticides" className={publicLinkClass} onClick={closeMenus}>Pesticides</Link></li>
              <li><Link to="/billing" className={publicLinkClass} onClick={closeMenus}>Billing</Link></li>
              <li><Link to="/recommendation" className={publicLinkClass} onClick={closeMenus}>Recommendations</Link></li>
              {/* <li><Link to="/about" className={publicLinkClass} onClick={closeMenus}>About</Link></li> */}

              <li className="mt-6 lg:mt-0 lg:ml-4">
                <Link
                  to="/admin/login"
                  className="px-6 py-3 rounded-xl font-bold text-sm bg-[#2aa904] text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-200/40"
                  onClick={closeMenus}
                >
                  Admin Login
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;