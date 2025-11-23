import { GeneralSettings } from "@/components/admin/general-settings"
import { NotificationSettings } from "@/components/admin/notification-settings"
import { SecuritySettings } from "@/components/admin/security-settings"

export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Settings</h1>
      <div className="space-y-6">
        <GeneralSettings />
        <NotificationSettings />
        <SecuritySettings />
      </div>
    </div>
  )
}

