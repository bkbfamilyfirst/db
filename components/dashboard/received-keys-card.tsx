import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, TrendingUp, Package } from "lucide-react"

export function ReceivedKeysCard() {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-electric-purple/20 to-electric-blue/20 rounded-full -translate-y-16 translate-x-16"></div>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">Received Keys</CardTitle>
        <div className="rounded-full p-3 bg-gradient-to-r from-electric-purple to-electric-blue shadow-lg">
          <Key className="h-5 w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          25,847
        </div>
        <div className="flex items-center gap-1 mt-2">
          <TrendingUp className="h-4 w-4 text-electric-green" />
          <p className="text-sm text-electric-green font-medium">+12.5% from last week</p>
        </div>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Today: 1,234</span>
          <span>This Week: 8,567</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
          <Package className="h-3 w-3" />
          <span>Last batch: 2,500 keys (3 hours ago)</span>
        </div>
      </CardContent>
    </Card>
  )
}
