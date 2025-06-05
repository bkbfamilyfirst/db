import { ReportsHeader } from "@/components/reports/reports-header"
import { ReportsStats } from "@/components/reports/reports-stats"
import { KeyTransferLogs } from "@/components/reports/key-transfer-logs"
import { ReportsFilters } from "@/components/reports/reports-filters"

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <ReportsHeader />

      {/* Stats Overview */}
      <div className="mt-8">
        <ReportsStats />
      </div>

      {/* Filters */}
      <div className="mt-8">
        <ReportsFilters />
      </div>

      {/* Key Transfer Logs */}
      <div className="mt-8">
        <KeyTransferLogs />
      </div>
    </div>
  )
}
