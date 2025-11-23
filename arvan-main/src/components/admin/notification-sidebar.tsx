import type React from "react"
import { Bell, X } from "lucide-react"
import Image from "next/image";

export function NotificationSidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-y-0 right-0 w-[300px] bg-white border-l border-gray-200 shadow-lg z-50 transition-transform duration-300 ease-in-out transform">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="font-semibold">Notifications</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="overflow-auto flex-1">
        <div className="p-4 border-b border-gray-100">
          <NotificationItem icon={<Bell size={16} />} title="You fixed a bug." time="Just now" />
        </div>

        <div className="p-4 border-b border-gray-100">
          <NotificationItem icon={<UserIcon />} title="New user registered." time="59 minutes ago" />
        </div>

        <div className="p-4 border-b border-gray-100">
          <NotificationItem icon={<Bell size={16} />} title="You fixed a bug." time="12 hours ago" />
        </div>

        <div className="p-4 border-b border-gray-100">
          <NotificationItem icon={<MessageIcon />} title="Andi Lane subscribed to you." time="Today, 11:59 AM" />
        </div>

        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium mb-4">Activities</h3>
          <div className="space-y-4">
            <ActivityItem avatar="/placeholder.svg?height=32&width=32" title="Changed the style." time="Just now" />

            <ActivityItem
              avatar="/placeholder.svg?height=32&width=32"
              title="Released a new version."
              time="59 minutes ago"
            />

            <ActivityItem avatar="/placeholder.svg?height=32&width=32" title="Submitted a bug." time="12 hours ago" />

            <ActivityItem
              avatar="/placeholder.svg?height=32&width=32"
              title="Modified A data in Page X."
              time="Today, 11:59 AM"
            />

            <ActivityItem
              avatar="/placeholder.svg?height=32&width=32"
              title="Deleted a page in Project X."
              time="Feb 2, 2025"
            />
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-4">Contacts</h3>
          <div className="space-y-3">
            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Natali Craig" />

            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Drew Cano" />

            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Andi Lane" />

            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Koray Okumus" />

            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Kate Morrison" />

            <ContactItem avatar="/placeholder.svg?height=32&width=32" name="Melody Macy" />
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationItem({
  icon,
  title,
  time,
}: {
  icon: React.ReactNode
  title: string
  time: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

function ActivityItem({
  avatar,
  title,
  time,
}: {
  avatar: string
  title: string
  time: string
}) {
  return (
    <div className="flex items-center gap-3">
      <Image src={avatar || "/logo.svg"} alt="" width={200} height={200} className="w-6 h-6 rounded-full" />
      <div>
        <p className="text-sm">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  )
}

function ContactItem({ avatar, name }: { avatar: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <Image src={avatar || "/logo.svg"} alt="" width={200} height={200} className="w-6 h-6 rounded-full" />
      <p className="text-sm">{name}</p>
    </div>
  )
}

function UserIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-[#4f507f] flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
          fill="white"
        />
        <path d="M12 13C7.58172 13 4 16.5817 4 21H20C20 16.5817 16.4183 13 12 13Z" fill="white" />
      </svg>
    </div>
  )
}

function MessageIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-[#7094f4] flex items-center justify-center">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M21 11.5C21.0034 12.8199 20.6951 14.1219 20.1 15.3C19.3944 16.7118 18.3098 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0035 9.87812 19.6951 8.7 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92179 4.44061 8.37488 5.27072 7.03258C6.10083 5.69028 7.28825 4.6056 8.7 3.90003C9.87812 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47089C20.0052 6.94699 20.885 8.91568 21 11V11.5Z"
          fill="white"
        />
      </svg>
    </div>
  )
}

