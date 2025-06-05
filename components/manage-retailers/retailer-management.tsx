"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Users } from "lucide-react"
import { RetailerList } from "./retailer-list"
import { AddRetailerDialog } from "./add-retailer-dialog"
import { RetailerActivationSummary } from "./retailer-activation-summary"

export function RetailerManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")

  return (
    <div className="space-y-6 mt-6">
      {/* Activation Summary */}
      <RetailerActivationSummary />

      {/* Header Actions */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-cyan to-electric-purple">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-cyan to-electric-purple bg-clip-text text-transparent">
              Retailer Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search retailers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                  className="bg-gradient-to-r from-electric-blue to-electric-purple text-white"
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "blocked" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("blocked")}
                >
                  Blocked
                </Button>
              </div>
            </div>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Retailer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Retailer List */}
      <RetailerList searchTerm={searchTerm} filterStatus={filterStatus} />



      {/* Add Retailer Dialog */}
      <AddRetailerDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}
