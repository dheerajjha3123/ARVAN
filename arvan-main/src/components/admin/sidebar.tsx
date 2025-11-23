"use client";

import { useState, useEffect } from "react";
import type React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  LogOut,
  BarChart2,
  Tag,
  Layers,
  Plus,
  List,
  Grid,
  TrendingUp,
  Users,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
} from "lucide-react";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check window width and set collapsed and mobile state on initial load and resize
  useEffect(() => {
    const handleResize = () => {
      const mobileView = window.innerWidth <= 1180;
      setIsMobile(mobileView);
      setIsCollapsed(mobileView);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <>
      {/* Mobile menu button - always visible on mobile, now on right side */}
      {isMobile && (
        <button
          className="fixed top-4 right-4 z-50 bg-white p-2 rounded-md shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      )}

      {/* Backdrop - only visible when expanded on mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed h-full bg-white border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ${
          isCollapsed
            ? "w-[64px]"
            : isMobile
            ? "w-[260px] shadow-xl"
            : "w-[220px]"
        } ${isCollapsed && isMobile ? "translate-x-[-100%]" : "translate-x-0"}`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center gap-2 font-semibold">
          <span className="h-6 w-6 rounded-full bg-[#4f507f] flex-shrink-0"></span>
          {!isCollapsed && <span>Arvan</span>}
          {!isMobile && (
            <button
              className="ml-auto text-gray-500 hover:text-gray-700"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronLeft size={18} />
              )}
            </button>
          )}
        </div>

        <div className="overflow-y-auto flex-grow">
          <div className="p-4">
            <div className="space-y-1 mb-2">
              <NavItem
                href="/"
                icon={<Home size={18} />}
                label="Home"
                collapsed={isCollapsed}
              />
              <div
                onClick={() => signOut({redirectTo:"/"})}
                className={`flex cursor-pointer items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all text-gray-700 hover:bg-gray-100 ${
                  isCollapsed ? "justify-center" : ""
                }`}
              >
                <div className="flex-shrink-0">
                  <LogOut size={18} />
                </div>
                {!isCollapsed && <span>Logout</span>}
              </div>
            </div>
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Main</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin"
                icon={<Home size={18} />}
                label="Dashboard"
                active={isActive("/admin")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/products"
                icon={<LogOut size={18} />}
                label="Products"
                active={isActive("/admin/products")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/orders"
                icon={<ShoppingCart size={18} />}
                label="Orders"
                active={isActive("/admin/orders")}
                collapsed={isCollapsed}
              />
            </div>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Products</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin/products"
                icon={<Grid size={18} />}
                label="All Products"
                active={isActive("/admin/products")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/products/add"
                icon={<Plus size={18} />}
                label="Add Product"
                active={isActive("/admin/products/add")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/products/categories"
                icon={<Tag size={18} />}
                label="Categories"
                active={isActive("/admin/products/categories")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/products/inventory"
                icon={<Layers size={18} />}
                label="Inventory"
                active={isActive("/admin/products/inventory")}
                collapsed={isCollapsed}
              />
            </div>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Orders</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin/orders"
                icon={<List size={18} />}
                label="All Orders"
                active={isActive("/admin/orders")}
                collapsed={isCollapsed}
              />
            </div>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Customers</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin/customers"
                icon={<Users size={18} />}
                label="All Customers"
                active={isActive("/admin/customers")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/testimonials"
                icon={<Plus size={18} />}
                label="Add Testimonial"
                active={isActive("/admin/testimonials")}
                collapsed={isCollapsed}
              />
            </div>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Analytics</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin/analytics/sales"
                icon={<BarChart2 size={18} />}
                label="Sales Performance"
                active={isActive("/admin/analytics/sales")}
                collapsed={isCollapsed}
              />
              <NavItem
                href="/admin/analytics/products"
                icon={<TrendingUp size={18} />}
                label="Product Performance"
                active={isActive("/admin/analytics/products")}
                collapsed={isCollapsed}
              />
            </div>
          </div>

          <div className="p-4">
            {!isCollapsed && (
              <div className="text-sm text-gray-500 mb-2">Communication</div>
            )}
            <div className="space-y-1">
              <NavItem
                href="/admin/contacts"
                icon={<MessageSquare size={18} />}
                label="Contacts"
                active={isActive("/admin/contacts")}
                collapsed={isCollapsed}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content wrapper - adds margin to accommodate the fixed sidebar */}
      <div
        className={`transition-all duration-300 ${
          !isCollapsed && !isMobile
            ? "ml-[220px]"
            : isMobile
            ? "ml-0"
            : "ml-[64px]"
        }`}
      >
        {/* Your main content goes here */}
      </div>
    </>
  );
}

function NavItem({
  href,
  icon,
  label,
  active = false,
  collapsed = false,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-all ${
        active
          ? "bg-[#edeefc] text-[#4f507f] font-medium"
          : "text-gray-700 hover:bg-gray-100"
      } ${collapsed ? "justify-center" : ""}`}
      title={collapsed ? label : ""}
    >
      <div className="flex-shrink-0">{icon}</div>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
