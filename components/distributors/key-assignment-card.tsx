"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { KeyRound, Send, History, ArrowRight } from "lucide-react"

export function KeyAssignmentCard() {
  const [selectedDistributor, setSelectedDistributor] = useState("")
  const [keyCount, setKeyCount] = useState("100")

  return (
    <div className="space-y-6">
      <Card className="border-0 bg-gradient-to-br from-electric-purple/10 to-electric-blue/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="h-5 w-5 text-electric-purple" />
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Assign Keys
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="distributor">Select Distributor</Label>
            <Select value={selectedDistributor} onValueChange={setSelectedDistributor}>
              <SelectTrigger id="distributor" className="border-electric-purple/30">
                <SelectValue placeholder="Select distributor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ND001">TechGuard Solutions</SelectItem>
                <SelectItem value="ND002">SecureFamily Networks</SelectItem>
                <SelectItem value="ND003">KidSafe Technologies</SelectItem>
                <SelectItem value="ND004">ParentControl Systems</SelectItem>
                <SelectItem value="ND005">FamilyShield Inc.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="keyCount">Number of Keys</Label>
            <Input
              id="keyCount"
              type="number"
              value={keyCount}
              onChange={(e) => setKeyCount(e.target.value)}
              className="border-electric-purple/30"
            />
          </div>
          <Button className="w-full bg-gradient-to-r from-electric-purple to-electric-blue hover:opacity-90">
            <Send className="mr-2 h-4 w-4" />
            Assign Keys
          </Button>
        </CardContent>
      </Card>

      <Card className="border-0 bg-gradient-to-br from-electric-green/10 to-electric-cyan/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-electric-green" />
            <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
              Recent Assignments
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { id: "ND001", name: "TechGuard Solutions", keys: 500, time: "2 hours ago" },
            { id: "ND004", name: "ParentControl Systems", keys: 1000, time: "1 day ago" },
            { id: "ND002", name: "SecureFamily Networks", keys: 300, time: "3 days ago" },
          ].map((assignment, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800"
            >
              <div className="flex flex-col">
                <span className="font-medium">{assignment.name}</span>
                <span className="text-xs text-gray-500">{assignment.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-electric-green">{assignment.keys}</span>
                <ArrowRight className="h-4 w-4 text-electric-green" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
