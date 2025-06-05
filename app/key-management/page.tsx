import { KeyManagement } from "@/components/key-management/key-management"
import KeyManagementHeader from "@/components/key-management/key-management-header"

export default function KeyManagementPage() {
  return (
    <div className="responsive-container py-4 sm:py-8">
      <KeyManagementHeader />
      <KeyManagement />
    </div>
  )
}
