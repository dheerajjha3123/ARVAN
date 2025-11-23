"use client"

import { useState } from "react"
import { ShoppingCart, Star, User, Package, DollarSign } from "lucide-react"

const initialActivities = [
  {
    id: 1,
    type: "order",
    user: "John Doe",
    action: "placed a new order",
    details: "Order #1234",
    timestamp: "2023-06-15 14:30",
  },
  {
    id: 2,
    type: "review",
    user: "Jane Smith",
    action: "left a review",
    details: "5 stars for Product A",
    timestamp: "2023-06-15 13:45",
  },
  {
    id: 3,
    type: "account",
    user: "Bob Johnson",
    action: "created an account",
    details: "",
    timestamp: "2023-06-15 12:15",
  },
  {
    id: 4,
    type: "product",
    user: "Admin User",
    action: "added a new product",
    details: "Product X",
    timestamp: "2023-06-15 11:30",
  },
  {
    id: 5,
    type: "order",
    user: "Alice Brown",
    action: "cancelled an order",
    details: "Order #1230",
    timestamp: "2023-06-15 10:45",
  },
  {
    id: 6,
    type: "payment",
    user: "Charlie Davis",
    action: "made a payment",
    details: "$99.99",
    timestamp: "2023-06-15 09:30",
  },
]

export function ActivityFeed() {
  const [activities] = useState(initialActivities)

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart className="h-6 w-6 text-blue-500" />
      case "review":
        return <Star className="h-6 w-6 text-yellow-500" />
      case "account":
        return <User className="h-6 w-6 text-green-500" />
      case "product":
        return <Package className="h-6 w-6 text-purple-500" />
      case "payment":
        return <DollarSign className="h-6 w-6 text-green-500" />
      default:
        return <ShoppingCart className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {activities.map((activity) => (
          <li key={activity.id} className="p-4 hover:bg-gray-50">
            <div className="flex space-x-3">
              <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">{activity.user}</h3>
                  <p className="text-sm text-gray-500">{activity.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {activity.action} {activity.details && `- ${activity.details}`}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

