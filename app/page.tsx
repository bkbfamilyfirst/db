'use client';

import { useEffect, useState } from "react"
import { WelcomeCard } from "@/components/welcome-card"
import { ReceivedKeysCard } from "@/components/dashboard/received-keys-card"
import { BalanceKeysCard } from "@/components/dashboard/balance-keys-card"
import { RetailerCountCard } from "@/components/dashboard/retailer-count-card"
import { DailyActivationsCard } from "@/components/dashboard/daily-activations-card"
import { getDashboardSummary, getRetailerCityDistribution, type DashboardSummary } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function Home() {
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        // Fetch dashboard summary and city distribution in parallel
        const [data, cityDist] = await Promise.all([
          getDashboardSummary(),
          getRetailerCityDistribution({ limit: 8 }).catch(() => null),
        ])

        // Attach city distribution to retailerCount if present
        if (cityDist && data?.retailerCount) {
          ;(data.retailerCount as any).cityDistribution = cityDist.topCities.map(c => ({ city: c.city, count: c.count }))
        }

        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
          // Fallback: set blank dashboard data so UI renders with zeros
          setDashboardData({
            receivedKeys: 0,
            receivedKeysDetails: {
              changeFromLastWeek: 0,
              today: 0,
              thisWeek: 0,
              lastBatch: null,
            },
            balanceKeys: 0,
            transferStatus: 0,
            transferredKeys: 0,
            available: 0,
            retailerCount: {
              totalActiveRetailers: 0,
              growthThisMonth: "0%",
              regionalDistribution: {
                north: 0,
                south: 0,
                east: 0,
                west: 0,
              },
            },
            dailyActivations: {
              today: 0,
              avgDaily: 0,
              weeklyPerformance: [],
              thisWeekSummary: {
                count: 0,
                target: 0,
                percentage: 0,
                remaining: 0,
              },
            },
          })
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
        {/* Prefer detailed receivedKeysDetails; if unavailable, map from keyStats */}
        <ReceivedKeysCard
          data={
            dashboardData?.receivedKeysDetails
            ?? (dashboardData?.keyStats ? {
              changeFromLastWeek: 0,
              today: dashboardData.keyStats.receivedFromSs?.total || 0,
              thisWeek: dashboardData.keyStats.receivedFromSs?.thisWeek || 0,
              lastBatch: null,
            } : undefined)
          }
          totalKeys={dashboardData?.keyStats?.totalInventory ?? dashboardData?.receivedKeys}
        />
        <BalanceKeysCard data={{
          // Prefer backend keyStats when available
          totalBalance: dashboardData?.keyStats?.totalInventory ?? dashboardData?.balanceKeys ?? 0,
          transferredKeys: dashboardData?.keyStats?.distributed?.total ?? dashboardData?.transferredKeys ?? 0,
          available: dashboardData?.keyStats?.available?.total ?? dashboardData?.available ?? 0,
          transferStatus: dashboardData?.keyStats?.keyDistributionOverview?.distributionProgress ?? dashboardData?.transferStatus ?? 0,
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
