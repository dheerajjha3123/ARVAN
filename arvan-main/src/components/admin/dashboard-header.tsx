// import { Search, Sun, History, Bell, Layout } from "lucide-react"

export function DashboardHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">Overview</h1>
      </div>
      {/* <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-4 py-1.5 rounded-full bg-gray-100 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4f507f] focus:border-transparent"
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Sun size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <History size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Layout size={20} className="text-gray-600" />
        </button>
      </div> */}
    </div>
  )
}

