"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity, TrendingUp, Target, Calendar, BarChart3, Loader2, AlertCircle } from "lucide-react"
import { getActivationSummary, type ActivationSummary } from "@/lib/api"

export function RetailerActivationSummary() {
  const [activationData, setActivationData] = useState<ActivationSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    const fetchActivationSummary = async () => {
      try {
        setIsLoading(true)
        setError(null)
        console.log('Starting to fetch activation summary...')
        const data = await getActivationSummary()
        console.log('Received activation summary data:', data)
        setActivationData(data)
      } catch (err: any) {
        console.error('Failed to fetch activation summary:', err)        // Provide more specific error messages
        let errorMessage = 'Failed to load activation summary'
        if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          errorMessage = 'Backend server is not available. Please ensure the backend is running on port 5000.'
        } else if (err.code === 'ECONNABORTED') {
          errorMessage = 'Request timed out - server may be slow'
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed'
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error occurred'
        }
        
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivationSummary()
  }, [])

  const summaryData = activationData ? [
    { 
      period: "Today", 
      activations: activationData.activationSummary.today.count, 
      target: activationData.activationSummary.today.target, 
      color: "from-electric-green to-electric-cyan" 
    },
    { 
      period: "This Week", 
      activations: activationData.activationSummary.thisWeek.count, 
      target: activationData.activationSummary.thisWeek.target, 
      color: "from-electric-blue to-electric-purple" 
    },
    { 
      period: "This Month", 
      activations: activationData.activationSummary.thisMonth.count, 
      target: activationData.activationSummary.thisMonth.target, 
      color: "from-electric-orange to-electric-pink" 
    },
  ] : []

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading activation summary...</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading top performers...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-32">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Activation Metrics */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">        <CardHeader>
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
            {summaryData.map((data, index) => {
              const percentage = data.target > 0 ? (data.activations / data.target) * 100 : 0
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
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">        <CardHeader>
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
            {activationData?.topPerformingRetailers && activationData.topPerformingRetailers.length > 0 ? (
              activationData.topPerformingRetailers.map((performer, index) => (
                <div
                  key={performer.id}
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
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium text-electric-blue">{performer.performance.toFixed(1)}%</span>
                  </div>
                  <Progress value={Math.min(performer.performance, 100)} className="h-1.5 mt-2" />
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                <BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No performance data available</p>
              </div>
            )}

            {activationData?.topPerformingRetailers && activationData.topPerformingRetailers.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-electric-blue" />
                  <span className="font-medium">Overall Performance:</span>
                  <span className="text-electric-green">Growing network</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
