import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"

function Navigation({ isAdminLoggedIn }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const handleAdminLogout = () => {
    // Add logic like localStorage.removeItem('token') here later
    navigate("/")
  }

  const closeMenus = () => setMenuOpen(false)

  const linkClass = "text-slate-700 font-bold text-sm px-3 py-2 rounded-lg transition-all hover:bg-slate-100 hover:text-emerald-600 whitespace-nowrap"
  const adminLinkClass = "text-slate-700 font-bold text-sm px-3 py-2 rounded-lg transition-all hover:bg-emerald-50 hover:text-emerald-700 whitespace-nowrap"

  return (
    <nav className="sticky top-0 z-[2000] w-full bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-[1440px] mx-auto px-6 flex items-center justify-between h-20">
        
        {/* LOGO */}
        <Link to="/" className="flex flex-col leading-none min-w-fit" onClick={closeMenus}>
          <span className="text-xl font-black text-[#406661] uppercase tracking-tighter">Anand Agro</span>
          <span className="text-[10px] font-bold text-[#2aa904] tracking-[2px] mt-1 text-center">Agencies</span>
        </Link>

        {/* MOBILE MENU TOGGLE */}
        <button className="lg:hidden p-2 text-[#406661]" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION LINKS */}
        <ul className={`
          fixed lg:static top-20 left-0 w-full lg:w-auto h-[calc(100vh-80px)] lg:h-auto 
          bg-white lg:bg-transparent flex flex-col lg:flex-row items-center p-8 lg:p-0 gap-4 lg:gap-1
          transition-transform duration-300 ease-in-out z-50 overflow-y-auto lg:overflow-visible
          ${menuOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
        `}>
          
          <li><Link to="/" className={linkClass} onClick={closeMenus}>Home</Link></li>
          <li><Link to="/products" className={linkClass} onClick={closeMenus}>Products</Link></li>
          
          {!isAdminLoggedIn && (
            <>
              <li><Link to="/pesticides" className={linkClass} onClick={closeMenus}>Pesticides</Link></li>
              <li><Link to="/billing" className={linkClass} onClick={closeMenus}>Billing</Link></li>
              <li><Link to="/recommendation" className={linkClass} onClick={closeMenus}>Recommendations</Link></li>
              <li><Link to="/about" className={linkClass} onClick={closeMenus}>About</Link></li>
            </>
          )}

          {isAdminLoggedIn ? (
            <>
              <li className="hidden lg:block border-l border-slate-300 mx-2 h-6 self-center"></li>
              <li><Link to="/admin/dashboard" className={adminLinkClass} onClick={closeMenus}>Dashboard</Link></li>
              <li>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-sm bg-red-100 text-red-500 hover:bg-red-200 transition-colors"
                  onClick={() => { handleAdminLogout(); closeMenus(); }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/admin/login" className="px-5 py-2.5 rounded-xl font-black text-sm bg-[#2aa904] text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-200" onClick={closeMenus}>
                Admin Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation