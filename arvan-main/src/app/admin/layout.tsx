"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/admin/sidebar"
// import { NotificationSidebar } from "@/components/admin/notification-sidebar"
import { Bell } from "lucide-react"
import QueryProvider from "@/lib/queryclient"
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isNotificationSidebarOpen, setIsNotificationSidebarOpen] = useState(false)

  return (
    <QueryProvider>
    <div className="flex min-h-screen bg-[#f9f9fa]">
      <Sidebar />
      <main className="flex-1 overflow-auto relative">
        <div className="absolute top-4 right-16 xl:right-4 z-10">
          <button
            onClick={() => setIsNotificationSidebarOpen(!isNotificationSidebarOpen)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
          </button>
        </div>
        {children}
      </main>
      {/* <NotificationSidebar isOpen={isNotificationSidebarOpen} onClose={() => setIsNotificationSidebarOpen(false)} /> */}
    </div>
    <ReactQueryDevtools initialIsOpen={false} />
    </QueryProvider>
  )
}
