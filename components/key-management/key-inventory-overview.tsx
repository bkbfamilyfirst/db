"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Package, Download, Send, AlertTriangle, TrendingUp, Loader2 } from "lucide-react"
import { getKeyStats, KeyStats } from "@/lib/api"
import { toast as sonnerToast } from 'sonner'

export function KeyInventoryOverview() {
  const [keyStats, setKeyStats] = useState<KeyStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // use Sonner for toasts

  useEffect(() => {
    const fetchKeyStats = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await getKeyStats()
        setKeyStats(response.data)
      } catch (err: any) {
        console.error("Error fetching key stats:", err)
        setError(err.response?.data?.message || "Failed to fetch key statistics. Please try again.")
        sonnerToast.error(err.response?.data?.message || "Failed to fetch key statistics.")
      }
      setIsLoading(false)
    }

    fetchKeyStats()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
        <p className="ml-2 text-muted-foreground">Loading key statistics...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-red-50 dark:bg-red-900/10 p-4 rounded-lg border border-red-200 dark:border-red-700">
        <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
        <p className="mt-2 text-center text-red-700 dark:text-red-300">Error: {error}</p>
        <p className="text-xs text-muted-foreground mt-1">Please check your connection or try refreshing the page.</p>
      </div>
    )
  }

  if (!keyStats) {
    return (
      <div className="flex flex-col justify-center items-center h-64 bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
        <AlertTriangle className="h-8 w-8 text-yellow-500 dark:text-yellow-400" />
        <p className="mt-2 text-center text-yellow-700 dark:text-yellow-300">No key statistics available at the moment.</p>
      </div>
    )
  }

  const inventoryDisplayStats = [
    {
      title: "Total Inventory",
      value: keyStats.totalInventory,
      icon: Package,
      color: "from-electric-purple to-electric-blue",
      change: `${keyStats.receivedFromSs.thisWeek >= 0 ? '+' : ''}${keyStats.receivedFromSs.thisWeek.toLocaleString()} this week`,
      changeType: keyStats.receivedFromSs.thisWeek >= 0 ? "positive" : "negative",
    },
    {
      title: "Received from SS",
      value: keyStats.receivedFromSs.total,
      icon: Download,
      color: "from-electric-green to-electric-cyan",
      // Assuming no specific 'today' field for received from SS in new API, using thisWeek as an example
      change: `${keyStats.receivedFromSs.thisWeek >= 0 ? '+' : ''}${keyStats.receivedFromSs.thisWeek.toLocaleString()} this week`,
      changeType: "positive", 
    },
    {
      title: "Distributed",
      value: keyStats.distributed.total,
      icon: Send,
      color: "from-electric-orange to-electric-pink",
      change: `${keyStats.distributed.pending.toLocaleString()} pending`,
      changeType: "neutral",
    },
    {
      title: "Available",
      value: keyStats.available.total,
      icon: keyStats.available.lowStockAlert ? AlertTriangle : Package, // Show alert icon if low stock
      color: keyStats.available.lowStockAlert ? "from-red-500 to-pink-500" : "from-electric-blue to-electric-green",
      change: keyStats.available.lowStockAlert || `${keyStats.available.total.toLocaleString()} in stock`,
      changeType: keyStats.available.lowStockAlert ? "warning" : "positive",
    },
  ]

  const { distributionProgress, distributed, remaining, total } = keyStats.keyDistributionOverview

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {inventoryDisplayStats.map((stat, index) => (
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
                        : stat.changeType === "negative"
                          ? "text-red-500"
                          : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-electric-green"
                      : stat.changeType === "warning"
                        ? "text-electric-orange"
                        : stat.changeType === "negative"
                          ? "text-red-500"
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
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Distribution Progress: <span className="font-bold text-electric-blue dark:text-electric-cyan">{distributionProgress.toFixed(1)}%</span>
              </p>
              <p className="text-sm text-muted-foreground">
                {distributed.toLocaleString()} / {total.toLocaleString()} Keys
              </p>
            </div>
            <Progress value={distributionProgress} className="w-full h-3 bg-gray-200 dark:bg-gray-700 [&>div]:bg-gradient-to-r [&>div]:from-electric-blue [&>div]:to-electric-purple" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Distributed</p>
              <p className="text-lg font-semibold text-electric-green">{distributed.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold text-electric-orange">{remaining.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total in Batch</p>
              <p className="text-lg font-semibold text-electric-purple">{total.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
