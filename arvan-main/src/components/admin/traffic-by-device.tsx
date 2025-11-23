"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { name: "Linux", value: 15000, color: "#9f9ff8" },
  { name: "Mac", value: 25000, color: "#96e2d6" },
  { name: "iOS", value: 20000, color: "#1c1c1c" },
  { name: "Windows", value: 30000, color: "#92bfff" },
  { name: "Android", value: 12000, color: "#aec7ed" },
  { name: "Other", value: 22000, color: "#94e9b8" },
]

export function TrafficByDevice() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-6">Traffic by Device</h3>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={30} fill="#8884d8" isAnimationActive={false}>
              {data.map((entry, index) => (
                <rect key={`rect-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

