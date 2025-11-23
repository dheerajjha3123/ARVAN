"use client"

import type React from "react"

import { useState } from "react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [inventoryAlerts, setInventoryAlerts] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Implement save functionality
    console.log("Notification settings saved")
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h2 className="text-lg font-medium mb-4 text-[#4f507f]">Notification Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <span className="text-sm font-medium text-gray-900">Email Notifications</span>
              <span className="text-sm text-gray-500">Receive notifications via email</span>
            </span>
            <button
              type="button"
              className={`${
                emailNotifications ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setEmailNotifications(!emailNotifications)}
            >
              <span
                className={`${
                  emailNotifications ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <span className="text-sm font-medium text-gray-900">Push Notifications</span>
              <span className="text-sm text-gray-500">Receive push notifications</span>
            </span>
            <button
              type="button"
              className={`${
                pushNotifications ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setPushNotifications(!pushNotifications)}
            >
              <span
                className={`${
                  pushNotifications ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <span className="text-sm font-medium text-gray-900">Order Updates</span>
              <span className="text-sm text-gray-500">Receive notifications for order status changes</span>
            </span>
            <button
              type="button"
              className={`${
                orderUpdates ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setOrderUpdates(!orderUpdates)}
            >
              <span
                className={`${
                  orderUpdates ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex-grow flex flex-col">
              <span className="text-sm font-medium text-gray-900">Inventory Alerts</span>
              <span className="text-sm text-gray-500">Receive notifications for low stock items</span>
            </span>
            <button
              type="button"
              className={`${
                inventoryAlerts ? "bg-indigo-600" : "bg-gray-200"
              } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              onClick={() => setInventoryAlerts(!inventoryAlerts)}
            >
              <span
                className={`${
                  inventoryAlerts ? "translate-x-5" : "translate-x-0"
                } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
              />
            </button>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}

