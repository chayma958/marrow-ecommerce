import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/coupons', label: 'Coupons' },
  { to: '/admin/users', label: 'Users' },
];

const AdminLayout: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-[200px_1fr] gap-8">
      <aside>
        <h1 className="font-display font-bold text-lg mb-4">Admin</h1>
        <nav className="flex md:flex-col gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                  isActive ? 'bg-ink text-white' : 'text-ink/60 hover:bg-ink/5'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
