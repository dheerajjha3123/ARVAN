export function TrafficByWebsite() {
  const websites = [
    { name: "Google", value: "30%" },
    { name: "YouTube", value: "25%" },
    { name: "Instagram", value: "20%" },
    { name: "Pinterest", value: "15%" },
    { name: "Facebook", value: "10%" },
    { name: "Twitter", value: "5%" },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-medium mb-6">Traffic by Website</h3>
      <div className="space-y-4">
        {websites.map((website) => (
          <div key={website.name} className="flex items-center justify-between">
            <span className="text-sm">{website.name}</span>
            <div className="flex items-center gap-3">
              <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#4f507f]" style={{ width: website.value }}></div>
              </div>
              <span className="text-xs text-gray-500">{website.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

