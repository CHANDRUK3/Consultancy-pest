import React from "react";
import { NavLink } from "react-router-dom";

const menuGroups = [
  {
    title: "Overview",
    items: [{ path: "/admin/dashboard", label: "Dashboard" }],
  },
  {
    title: "Inventory",
    items: [
      { path: "/admin/inventory", label: "Stock Overview" },
      { path: "/admin/inventory/purchase", label: "Add Purchase" },
      { path: "/admin/inventory/expiry", label: "Expiry Alerts" },
    ],
  },
  {
    title: "Sales",
    items: [
      { path: "/admin/sales", label: "Sales History" },
      { path: "/admin/sales/add", label: "New Sale" },
    ],
  },
  {
    title: "Masters",
    items: [
      { path: "/admin/masters/products", label: "Products" },
      { path: "/admin/masters/categories", label: "Categories" },
      // Add Suppliers, Customers later
    ],
  },
  {
    title: "Reports",
    items: [{ path: "/admin/reports/government", label: "Government Report" }],
  },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-teal-800 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-teal-700">
        Admin Panel
      </div>

      <nav className="flex-1 px-3 py-6 space-y-8">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 mb-2 text-teal-300 text-sm uppercase tracking-wider">
              {group.title}
            </h3>
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `block px-4 py-2.5 rounded-lg transition-colors ${
                        isActive
                          ? "bg-teal-700 text-white"
                          : "text-teal-100 hover:bg-teal-700/70"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-teal-700">
        <button
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}
          className="w-full py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}