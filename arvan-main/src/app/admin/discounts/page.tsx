import { DiscountList } from "@/components/admin/discount-list"
import { CreateDiscountButton } from "@/components/admin/create-discount-button"

export default function DiscountsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#1c1c1c]">Discounts & Coupons</h1>
        <CreateDiscountButton />
      </div>
      <DiscountList />
    </div>
  )
}

