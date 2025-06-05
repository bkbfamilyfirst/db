import { Card, CardContent } from "@/components/ui/card"
import { UserCheck, UserX, Key, Activity } from "lucide-react"

const stats = [
  {
    title: "Active Distributors",
    value: "24",
    change: "+3 this month",
    icon: UserCheck,
    color: "from-electric-green to-electric-cyan",
  },
  {
    title: "Inactive Distributors",
    value: "5",
    change: "-2 this month",
    icon: UserX,
    color: "from-electric-orange to-electric-pink",
  },
  {
    title: "Keys Assigned",
    value: "12,450",
    change: "+1,200 this month",
    icon: Key,
    color: "from-electric-purple to-electric-blue",
  },
  {
    title: "Activation Rate",
    value: "87%",
    change: "+5% this month",
    icon: Activity,
    color: "from-electric-blue to-electric-cyan",
  },
]

export function DistributorsStats() {
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
              <div className={`text-sm font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
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
