'use client';

import { useEffect, useState } from "react"
import { WelcomeCard } from "@/components/welcome-card"
import { ReceivedKeysCard } from "@/components/dashboard/received-keys-card"
import { BalanceKeysCard } from "@/components/dashboard/balance-keys-card"
import { RetailerCountCard } from "@/components/dashboard/retailer-count-card"
import { DailyActivationsCard } from "@/components/dashboard/daily-activations-card"
import { getDashboardSummary, type DashboardSummary } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        const data = await getDashboardSummary()
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
        // In development mode, use mock data
        if (process.env.NODE_ENV === 'development') {
          setDashboardData({
            receivedKeys: 25847,
            receivedKeysDetails: {
              changeFromLastWeek: 12.5,
              today: 1234,
              thisWeek: 8567,
              lastBatch: {
                count: 2500,
                from: "State Supervisor",
                date: new Date().toISOString()
              }
            },
            balanceKeys: 15420,
            allocationStatus: 58.0,
            allocated: 8945,
            available: 6475,
            retailerCount: {
              totalActiveRetailers: 9945,
              growthThisMonth: "8.3%",
              regionalDistribution: {
                north: 2847,
                south: 3456,
                east: 2134,
                west: 1508
              }
            },
            dailyActivations: {
              today: 1247,
              avgDaily: 1547,
              weeklyPerformance: [
                { day: "Mon", activations: 1247, target: 1500, percentage: 83.1 },
                { day: "Tue", activations: 1834, target: 1800, percentage: 101.9 },
                { day: "Wed", activations: 1456, target: 1600, percentage: 91.0 },
                { day: "Thu", activations: 1923, target: 1900, percentage: 101.2 },
                { day: "Fri", activations: 2156, target: 2200, percentage: 98.0 },
                { day: "Sat", activations: 1678, target: 1700, percentage: 98.7 },
                { day: "Sun", activations: 1234, target: 1300, percentage: 94.9 }
              ],
              thisWeekSummary: {
                count: 11528,
                target: 12000,
                percentage: 96.1,
                remaining: 472
              }
            }
          })
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="responsive-container py-4 sm:py-8">
        <WelcomeCard />
        
        {/* Loading Skeletons */}
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
        
        <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (error && !dashboardData) {
    return (
      <div className="responsive-container py-4 sm:py-8">
        <WelcomeCard />
        
        <div className="mt-6 sm:mt-8 p-6 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="responsive-container py-4 sm:py-8">
      <WelcomeCard />

      {/* First Row - Key Management */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
        <ReceivedKeysCard data={dashboardData?.receivedKeysDetails} totalKeys={dashboardData?.receivedKeys} />
        <BalanceKeysCard data={{
          totalBalance: dashboardData?.balanceKeys || 0,
          allocated: dashboardData?.allocated || 0,
          available: dashboardData?.available || 0,
          allocationStatus: dashboardData?.allocationStatus || 0
        }} />
      </div>

      {/* Second Row - Business Metrics */}
      <div className="mt-4 sm:mt-6 grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        <RetailerCountCard data={dashboardData?.retailerCount} />
        <DailyActivationsCard data={dashboardData?.dailyActivations} />
      </div>
    </div>
  )
}
