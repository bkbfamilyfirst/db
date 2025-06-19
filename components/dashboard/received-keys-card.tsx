import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, TrendingUp, Package, TrendingDown } from "lucide-react"

interface ReceivedKeysCardProps {
  data?: {
    changeFromLastWeek: number;
    today: number;
    thisWeek: number;
    lastBatch: {
      count: number;
      from: string;
      date: string;
    } | null;
  };
  totalKeys?: number;
}

export function ReceivedKeysCard({ data, totalKeys }: ReceivedKeysCardProps) {
  const receivedKeys = totalKeys || 0
  const changeFromLastWeek = data?.changeFromLastWeek || 0
  const todayKeys = data?.today || 0
  const thisWeekKeys = data?.thisWeek || 0
  const lastBatch = data?.lastBatch

  const isPositiveChange = changeFromLastWeek >= 0
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown
  const trendColor = isPositiveChange ? "text-electric-green" : "text-red-500"

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours === 1) {
      return "1 hour ago"
    } else {
      return `${diffInHours} hours ago`
    }
  }

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
          {receivedKeys.toLocaleString()}
        </div>
        {changeFromLastWeek !== 0 && (
          <div className="flex items-center gap-1 mt-2">
            <TrendIcon className={`h-4 w-4 ${trendColor}`} />
            <p className={`text-sm ${trendColor} font-medium`}>
              {isPositiveChange ? '+' : ''}{changeFromLastWeek}% from last week
            </p>
          </div>
        )}
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Today: {todayKeys.toLocaleString()}</span>
          <span>This Week: {thisWeekKeys.toLocaleString()}</span>
        </div>
        {lastBatch && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>
              Last batch: {lastBatch.count.toLocaleString()} keys ({formatTimeAgo(lastBatch.date)})
            </span>
          </div>
        )}
        {!lastBatch && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>No recent batches</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
