import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Download, Filter } from "lucide-react"

export function ReportsHeader() {
  return (
    <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-orange via-electric-pink to-electric-purple animate-gradient-shift">
      <CardContent className="p-6 text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <BarChart3 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Reports & Analytics</h2>
              <p className="mt-1 text-white/90">Track key transfers and system performance</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* <Button className="bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30">
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </Button> */}
            <Button className="bg-white text-electric-purple hover:bg-white/90">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
