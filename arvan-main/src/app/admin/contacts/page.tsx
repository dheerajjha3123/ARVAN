import { ContactList } from "@/components/admin/contact-list"

export default function ContactsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Customer Contacts</h1>
      <ContactList />
    </div>
  )
}

