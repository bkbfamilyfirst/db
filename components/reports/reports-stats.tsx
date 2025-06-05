import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpDown, TrendingUp, Users, Calendar } from "lucide-react"

const stats = [
  {
    title: "Total Transfers Today",
    value: "1,247",
    change: "+23% from yesterday",
    icon: ArrowUpDown,
    color: "from-electric-blue to-electric-cyan",
  },
  {
    title: "Weekly Transfer Volume",
    value: "8,945",
    change: "+15.3% from last week",
    icon: TrendingUp,
    color: "from-electric-green to-electric-blue",
  },
  {
    title: "Active Distributors",
    value: "24",
    change: "3 new this month",
    icon: Users,
    color: "from-electric-purple to-electric-pink",
  },
  {
    title: "Average Daily Transfers",
    value: "1,278",
    change: "+8.7% this month",
    icon: Calendar,
    color: "from-electric-orange to-electric-red",
  },
]

export function ReportsStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className="overflow-hidden border-0 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:scale-105"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`rounded-xl p-3 bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
              <div className={`text-xs font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.change}
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
              <p className={`mt-1 text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
