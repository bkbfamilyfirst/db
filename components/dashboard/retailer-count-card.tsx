import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Store, Users, TrendingUp, MapPin } from "lucide-react"

interface RetailerCountCardProps {
  data?: {
    totalActiveRetailers: number;
    growthThisMonth: string;
    regionalDistribution: {
      north: number;
      south: number;
      east: number;
      west: number;
    };
  };
}

export function RetailerCountCard({ data }: RetailerCountCardProps) {
  const totalRetailers = data?.totalActiveRetailers || 0
  const growthThisMonth = data?.growthThisMonth || "0%"
  const regionalDistribution = data?.regionalDistribution || {
    north: 0,
    south: 0,
    east: 0,
    west: 0
  }

  const retailerStats = [
    { region: "North", count: regionalDistribution.north, color: "from-electric-blue to-electric-cyan" },
    { region: "South", count: regionalDistribution.south, color: "from-electric-green to-electric-blue" },
    { region: "East", count: regionalDistribution.east, color: "from-electric-purple to-electric-pink" },
    { region: "West", count: regionalDistribution.west, color: "from-electric-orange to-electric-pink" },
  ]

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
          {growthThisMonth !== "0%" && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
              <TrendingUp className="h-4 w-4 text-electric-green" />
              <span className="text-sm text-electric-green font-medium">{growthThisMonth} growth this month</span>
            </div>
          )}

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
