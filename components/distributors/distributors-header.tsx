"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Network, Plus, Search, SlidersHorizontal } from "lucide-react"

interface DistributorsHeaderProps {
  onAddDistributor: () => void
}

export function DistributorsHeader({ onAddDistributor }: DistributorsHeaderProps) {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-blue via-electric-purple to-electric-pink animate-gradient-shift">
      <CardContent className="p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">National Distributors</h2>
              <p className="mt-1 text-white/90">Manage your distribution network</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* <Button className="bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter
            </Button> */}
            <Button onClick={onAddDistributor} className="bg-white text-electric-purple hover:bg-white/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Distributor
            </Button>
          </div>
        </div>
        <div className="mt-6 flex w-full max-w-md items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/70" />
            <Input
              type="search"
              placeholder="Search distributors..."
              className="bg-white/10 border-white/20 pl-8 text-white placeholder:text-white/70 focus:border-white"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
