"use client"; // Ensure this is at the top

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getRecentActivities, Activity, handleApiError } from "@/lib/api" // Import API functions and types
import { toast as sonnerToast } from 'sonner'
import { Loader2, AlertTriangle } from "lucide-react" // For loading and error states

// Activity interface is in api.ts

const getBadgeColor = (type: Activity["type"]) => {
  switch (type) {
    case "success":
      return "bg-electric-green text-white"
    case "info":
      return "bg-electric-blue text-white"
    case "warning":
      return "bg-electric-orange text-white"
    case "error": // Added error type
      return "bg-electric-pink text-white"
    default:
      return "bg-electric-purple text-white"
  }
}

// Helper to format time if needed (example: "2 hours ago" from a timestamp)
const formatTimeAgo = (isoDateString: string): string => {
  const date = new Date(isoDateString)
  const now = new Date()
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  const minutes = Math.round(seconds / 60)
  const hours = Math.round(minutes / 60)
  const days = Math.round(hours / 24)

  if (seconds < 60) return `${seconds} seconds ago`
  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // use Sonner for toasts

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const acts = await getRecentActivities()
        // Assuming the API returns activities sorted by time, or sort them here if needed.
        // Example: acts.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
        setActivities(acts)
      } catch (err) {
        handleApiError(err)
        setError("Failed to load recent activities.")
        sonnerToast.error("Could not load recent activities.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [])

  if (isLoading) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-electric-purple" />
          <p className="ml-2">Loading activities...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center h-40 text-destructive">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p>{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 py-8">
            No recent activities to display.
          </p>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => ( // Use activity.id if available from API
              <div
                key={activity.id} // Use a unique ID from the activity data
                className="flex items-center gap-4 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
              >
                <Avatar className="ring-2 ring-electric-purple/30">
                  <AvatarImage
                    src={activity.user.avatar || "/placeholder.svg"}
                  />
                  <AvatarFallback className="bg-gradient-to-r from-electric-cyan to-electric-blue text-white">
                    {activity.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <span className="font-semibold text-electric-purple">
                      {activity.user.name}
                    </span>{" "}
                    {activity.action}{" "}
                    <span className="font-semibold text-electric-blue">
                      {activity.target}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.time)}
                  </p>
                </div>
                <Badge className={getBadgeColor(activity.type)}>
                  {activity.type.charAt(0).toUpperCase() +
                    activity.type.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
