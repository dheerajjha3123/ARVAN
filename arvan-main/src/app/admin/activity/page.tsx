import { ActivityFeed } from "@/components/admin/activity-feed"

export default function ActivityPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Activity Feed</h1>
      <ActivityFeed />
    </div>
  )
}

