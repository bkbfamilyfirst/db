import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart3, Calendar, TrendingUp, Clock } from "lucide-react"

interface DailyActivationsCardProps {
  data?: {
    today: number;
    avgDaily: number;
    weeklyPerformance: Array<{
      day: string;
      activations: number;
      target?: number;
      percentage: number;
    }>;
    thisWeekSummary?: {
      count: number;
      target: number;
      percentage: number;
      remaining: number;
    };
  };
}

export function DailyActivationsCard({ data }: DailyActivationsCardProps) {
  const todayActivations = data?.today || 0
  const averageDaily = data?.avgDaily || 0
  const weeklyData = data?.weeklyPerformance || []
  const thisWeekSummary = data?.thisWeekSummary

  // Calculate weekly total from the performance data
  const totalWeeklyActivations = weeklyData.reduce((sum, day) => sum + day.activations, 0)

  // If no weekly data, show placeholder
  if (weeklyData.length === 0) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-pink to-electric-orange">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-pink to-electric-orange bg-clip-text text-transparent">
              Daily Activations (Roll-up View)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Today's Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-electric-blue" />
                  <span className="text-sm font-medium">Today</span>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                  {todayActivations.toLocaleString()}
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-electric-green" />
                  <span className="text-sm font-medium">Avg Daily</span>
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                  {averageDaily.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 dark:from-gray-800/50 dark:to-gray-700/50">
              <p className="text-sm text-muted-foreground text-center">No weekly performance data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-pink to-electric-orange">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-pink to-electric-orange bg-clip-text text-transparent">
            Daily Activations (Roll-up View)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Today's Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-electric-blue" />
                <span className="text-sm font-medium">Today</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                {todayActivations.toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-electric-green" />
                <span className="text-sm font-medium">Avg Daily</span>
              </div>
              <div className="text-2xl font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                {averageDaily.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Weekly Overview */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-electric-pink" />
              <span>This Week's Performance</span>
            </div>
            <div className="space-y-2">
              {weeklyData.map((day, index) => {
                const percentage = day.percentage || 0
                const target = day.target || (day.activations > 0 ? Math.round(day.activations / (percentage / 100)) : 1500)
                
                return (
                  <div key={index} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{day.day}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">{day.activations.toLocaleString()}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            percentage >= 100
                              ? "bg-electric-green/20 text-electric-green"
                              : percentage >= 80
                              ? "bg-electric-orange/20 text-electric-orange"
                              : "bg-red-500/20 text-red-500"
                          }`}
                        >
                          {percentage.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <Progress value={Math.min(percentage, 100)} className="h-1.5" />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Weekly Summary */}
          {thisWeekSummary ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-pink/10 to-electric-orange/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-electric-pink to-electric-orange bg-clip-text text-transparent">
                  {thisWeekSummary.count.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  Target: {thisWeekSummary.target.toLocaleString()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {thisWeekSummary.percentage.toFixed(1)}% achieved
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-electric-pink/10 to-electric-orange/10">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weekly Total</span>
                <span className="text-xl font-bold bg-gradient-to-r from-electric-pink to-electric-orange bg-clip-text text-transparent">
                  {totalWeeklyActivations.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
