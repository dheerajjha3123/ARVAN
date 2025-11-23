import { TestimonialsManager } from "@/components/admin/testimonials-manager"

export default function TestimonialsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#1c1c1c] mb-6">Testimonials Management</h1>
      <TestimonialsManager />
    </div>
  )
}