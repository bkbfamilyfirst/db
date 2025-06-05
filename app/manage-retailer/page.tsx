import RetailerHeaderCard from "@/components/manage-retailers/retailer-header-card"
import { RetailerManagement } from "@/components/manage-retailers/retailer-management"

export default function ManageRetailerPage() {
  return (
    <div className="responsive-container py-4 sm:py-8">
      <RetailerHeaderCard />
      <RetailerManagement />
    </div>
  )
}
