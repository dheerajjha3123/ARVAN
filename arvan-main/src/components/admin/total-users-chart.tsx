"use client"

import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", thisYear: 10000, lastYear: 8000 },
  { name: "Feb", thisYear: 15000, lastYear: 10000 },
  { name: "Mar", thisYear: 12000, lastYear: 12000 },
  { name: "Apr", thisYear: 18000, lastYear: 14000 },
  { name: "May", thisYear: 25000, lastYear: 16000 },
  { name: "Jun", thisYear: 22000, lastYear: 18000 },
  { name: "Jul", thisYear: 20000, lastYear: 20000 },
]

export function TotalUsersChart() {
  const [activeTab, setActiveTab] = useState("Total Users")

  const tabs = ["Total Users", "Total Products", "Operating Status"]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`text-sm ${activeTab === tab ? "text-[#4f507f] font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center text-xs">
          <div className="flex items-center mr-4">
            <span className="h-2 w-2 rounded-full bg-[#1c1c1c] mr-2"></span>
            <span>This year</span>
          </div>
          <div className="flex items-center">
            <span className="h-2 w-2 rounded-full bg-gray-300 mr-2"></span>
            <span>Last year</span>
          </div>
        </div>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="thisYear"
              stroke="#4f507f"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="lastYear"
              stroke="#e0e0e0"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

