import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, Download, Send, AlertTriangle, TrendingUp } from "lucide-react"

const inventoryStats = [
  {
    title: "Total Inventory",
    value: 25847,
    icon: Package,
    color: "from-electric-purple to-electric-blue",
    change: "+2,500 this week",
    changeType: "positive",
  },
  {
    title: "Received from SS",
    value: 15420,
    icon: Download,
    color: "from-electric-green to-electric-cyan",
    change: "+1,200 today",
    changeType: "positive",
  },
  {
    title: "Distributed",
    value: 12847,
    icon: Send,
    color: "from-electric-orange to-electric-pink",
    change: "850 pending",
    changeType: "neutral",
  },
  {
    title: "Available",
    value: 2573,
    icon: AlertTriangle,
    color: "from-electric-pink to-electric-purple",
    change: "Low stock alert",
    changeType: "warning",
  },
]

export function KeyInventoryOverview() {
  const totalKeys = 25847
  const distributedKeys = 12847
  const distributionPercentage = (distributedKeys / totalKeys) * 100

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {inventoryStats.map((stat, index) => (
          <Card
            key={index}
            className="relative overflow-hidden border-0 bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-gray-100/20 rounded-full -translate-y-10 translate-x-10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
              <div className={`rounded-full p-2 bg-gradient-to-r ${stat.color} shadow-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value.toLocaleString()}
              </div>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp
                  className={`h-3 w-3 ${
                    stat.changeType === "positive"
                      ? "text-electric-green"
                      : stat.changeType === "warning"
                        ? "text-electric-orange"
                        : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-electric-green"
                      : stat.changeType === "warning"
                        ? "text-electric-orange"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Distribution Progress */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Key Distribution Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Distribution Progress</span>
              <span className="text-sm font-bold">{distributionPercentage.toFixed(1)}%</span>
            </div>
            <Progress value={distributionPercentage} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <div className="text-lg font-bold text-electric-green">{distributedKeys.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Distributed</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-electric-orange/10 to-electric-pink/10">
                <div className="text-lg font-bold text-electric-orange">
                  {(totalKeys - distributedKeys).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">Remaining</div>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                <div className="text-lg font-bold text-electric-purple">{totalKeys.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
