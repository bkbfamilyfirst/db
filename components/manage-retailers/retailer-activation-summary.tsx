import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, TrendingUp, Target, Calendar, BarChart3 } from "lucide-react"

const activationData = [
  { period: "Today", activations: 1247, target: 1500, color: "from-electric-green to-electric-cyan" },
  { period: "This Week", activations: 8945, target: 10000, color: "from-electric-blue to-electric-purple" },
  { period: "This Month", activations: 34567, target: 40000, color: "from-electric-orange to-electric-pink" },
]

const topPerformers = [
  { name: "Tech Store Mumbai", activations: 487, efficiency: 97.4 },
  { name: "Digital Hub Delhi", activations: 623, efficiency: 83.1 },
  { name: "Smart Electronics Kolkata", activations: 398, efficiency: 93.6 },
]

export function RetailerActivationSummary() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Activation Metrics */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
              Activation Summary
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activationData.map((data, index) => {
              const percentage = (data.activations / data.target) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{data.period}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold bg-gradient-to-r ${data.color} bg-clip-text text-transparent`}>
                        {data.activations.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">of {data.target.toLocaleString()}</div>
                    </div>
                  </div>
                  <Progress value={Math.min(percentage, 100)} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percentage.toFixed(1)}% of target</span>
                    {percentage >= 100 ? (
                      <div className="flex items-center gap-1 text-electric-green">
                        <Target className="h-3 w-3" />
                        <span>Target achieved!</span>
                      </div>
                    ) : (
                      <span>{(data.target - data.activations).toLocaleString()} remaining</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-pink">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-purple to-electric-pink bg-clip-text text-transparent">
              Top Performing Retailers
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-700/50 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-6 h-6 rounded-full bg-gradient-to-r ${
                        index === 0
                          ? "from-yellow-400 to-yellow-600"
                          : index === 1
                            ? "from-gray-400 to-gray-600"
                            : "from-orange-400 to-orange-600"
                      } flex items-center justify-center text-white text-xs font-bold`}
                    >
                      {index + 1}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-electric-green">{performer.activations}</div>
                    <div className="text-xs text-muted-foreground">activations</div>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Efficiency Rate</span>
                  <span className="font-medium text-electric-blue">{performer.efficiency}%</span>
                </div>
                <Progress value={performer.efficiency} className="h-1.5 mt-2" />
              </div>
            ))}

            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-electric-blue" />
                <span className="font-medium">Overall Performance:</span>
                <span className="text-electric-green">+12.5% vs last month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
