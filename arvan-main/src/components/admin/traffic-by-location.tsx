"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "United States", value: 52.1, color: "#4f507f" },
  { name: "Canada", value: 22.8, color: "#92bfff" },
  { name: "Mexico", value: 13.9, color: "#94e9b8" },
  { name: "Other", value: 11.2, color: "#aec7ed" },
]

export function TrafficByLocation() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-6">Traffic by Location</h3>
      <div className="h-[240px] flex items-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              layout="vertical"
              verticalAlign="middle"
              align="right"
              formatter={(value) => {
                return <span className="text-sm">{value}</span>
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

