import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Wallet, AlertTriangle, CheckCircle } from "lucide-react"

export function BalanceKeysCard() {
  const totalBalance = 15420
  const allocated = 8945
  const available = totalBalance - allocated
  const allocationPercentage = (allocated / totalBalance) * 100

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-cyan/10 to-electric-green/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-electric-cyan/30 to-electric-green/30 rounded-full -translate-y-12 translate-x-12"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Balance Keys</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-cyan to-electric-green shadow-lg">
          <Wallet className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-cyan to-electric-green bg-clip-text text-transparent">
          {totalBalance.toLocaleString()}
        </div>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Allocation Status</span>
            <span className="font-medium">{allocationPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={allocationPercentage} className="h-2" />
          <div className="grid grid-cols-2 gap-4 mt-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-electric-green" />
              <div>
                <div className="text-sm font-medium text-electric-green">{allocated.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Allocated</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-electric-orange" />
              <div>
                <div className="text-sm font-medium text-electric-orange">{available.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Available</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
