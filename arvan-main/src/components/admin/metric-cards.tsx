import { TrendingUp, TrendingDown } from "lucide-react"

export function MetricCards() {
  const metrics = [
    {
      title: "Views",
      value: "7,265",
      change: "+11.01%",
      increasing: true,
      bgColor: "#edeefc",
      textColor: "#4f507f",
    },
    {
      title: "Visits",
      value: "3,671",
      change: "-0.03%",
      increasing: false,
      bgColor: "#e6f1fd",
      textColor: "#7094f4",
    },
    {
      title: "New Users",
      value: "156",
      change: "+15.03%",
      increasing: true,
      bgColor: "#edeefc",
      textColor: "#4f507f",
    },
    {
      title: "Active Users",
      value: "2,318",
      change: "+6.08%",
      increasing: true,
      bgColor: "#e6f1fd",
      textColor: "#7094f4",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <MetricCard
          key={index}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          increasing={metric.increasing}
          bgColor={metric.bgColor}
          textColor={metric.textColor}
        />
      ))}
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  increasing,
  bgColor,
  textColor,
}: {
  title: string
  value: string
  change: string
  increasing: boolean
  bgColor: string
  textColor: string
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm" style={{ backgroundColor: bgColor }}>
      <h3 className="text-sm mb-2" style={{ color: textColor }}>
        {title}
      </h3>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold" style={{ color: textColor }}>
          {value}
        </div>
        <div className={`flex items-center text-sm ${increasing ? "text-green-600" : "text-red-600"}`}>
          {increasing ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{change}</span>
        </div>
      </div>
    </div>
  )
}

