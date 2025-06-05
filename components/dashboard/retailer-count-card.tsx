import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, TrendingUp, MapPin } from "lucide-react"

const retailerStats = [
  { region: "North", count: 2847, color: "from-electric-blue to-electric-cyan" },
  { region: "South", count: 3456, color: "from-electric-green to-electric-blue" },
  { region: "East", count: 2134, color: "from-electric-purple to-electric-pink" },
  { region: "West", count: 1508, color: "from-electric-orange to-electric-pink" },
]

export function RetailerCountCard() {
  const totalRetailers = retailerStats.reduce((sum, stat) => sum + stat.count, 0)

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:shadow-xl transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
            <Store className="h-5 w-5 text-white" />
          </div>
          <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
            Retailer Count
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Count */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
            <div className="flex items-center gap-3">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                <Users className="h-4 w-4 text-white" />
              </div>
              <span className="font-medium">Total Active Retailers</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              {totalRetailers.toLocaleString()}
            </span>
          </div>

          {/* Growth Indicator */}
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
            <TrendingUp className="h-4 w-4 text-electric-green" />
            <span className="text-sm text-electric-green font-medium">+8.3% growth this month</span>
          </div>

          {/* Regional Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-electric-blue" />
              <span>Regional Distribution</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {retailerStats.map((stat, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.region}</span>
                    <span className={`text-sm font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.count.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
