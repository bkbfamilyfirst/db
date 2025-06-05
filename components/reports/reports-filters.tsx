"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function ReportsFilters() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("7days")
  const [distributor, setDistributor] = useState("")
  const [status, setStatus] = useState("")

  const addFilter = (filter: string) => {
    if (!activeFilters.includes(filter)) {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const removeFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter))
  }

  const clearAllFilters = () => {
    setActiveFilters([])
    setDateRange("7days")
    setDistributor("")
    setStatus("")
  }

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-electric-blue" />
          <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
            Filter Reports
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filter Controls */}
        <div className="grid gap-4 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="dateRange">Date Range</Label>
            <Select
              value={dateRange}
              onValueChange={(value) => {
                setDateRange(value)
                addFilter(`Date: ${value}`)
              }}
            >
              <SelectTrigger id="dateRange" className="border-electric-blue/30">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="distributor">Distributor</Label>
            <Select
              value={distributor}
              onValueChange={(value) => {
                setDistributor(value)
                addFilter(`Distributor: ${value}`)
              }}
            >
              <SelectTrigger id="distributor" className="border-electric-purple/30">
                <SelectValue placeholder="All distributors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Distributors</SelectItem>
                <SelectItem value="ND001">TechGuard Solutions</SelectItem>
                <SelectItem value="ND002">SecureFamily Networks</SelectItem>
                <SelectItem value="ND003">KidSafe Technologies</SelectItem>
                <SelectItem value="ND004">ParentControl Systems</SelectItem>
                <SelectItem value="ND005">FamilyShield Inc.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Transfer Status</Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value)
                addFilter(`Status: ${value}`)
              }}
            >
              <SelectTrigger id="status" className="border-electric-green/30">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="search" placeholder="Search transfers..." className="pl-8 border-electric-orange/30" />
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Active Filters</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-electric-red hover:text-electric-red/80"
              >
                <X className="mr-1 h-3 w-3" />
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} className="bg-gradient-to-r from-electric-blue to-electric-purple text-white">
                  {filter}
                  <button onClick={() => removeFilter(filter)} className="ml-2 hover:text-white/70">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-electric-blue to-electric-purple hover:opacity-90">
            <Search className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
