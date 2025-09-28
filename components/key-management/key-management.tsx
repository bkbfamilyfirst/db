"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Key, Download, Send, History } from "lucide-react"
import { ReceiveKeysSection } from "./receive-keys-section"
import { DistributeKeysSection } from "./distribute-keys-section"
import { KeyMovementLogs } from "./key-movement-logs"
import { KeyInventoryOverview } from "./key-inventory-overview"

export function KeyManagement() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Key Inventory Overview */}
      <KeyInventoryOverview />

      {/* Main Tabs */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
              <Key className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              Key Operations
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full">
              {/* <TabsTrigger value="receive" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Receive Keys</span>
                <span className="sm:hidden">Receive</span>
              </TabsTrigger> */}
              {/* <TabsTrigger value="distribute" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Distribute Keys</span>
                <span className="sm:hidden">Distribute</span>
              </TabsTrigger> */}
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">Movement Logs</span>
                <span className="sm:hidden">Logs</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="receive" className="mt-6">
              <ReceiveKeysSection />
            </TabsContent>

            {/* <TabsContent value="distribute" className="mt-6">
              <DistributeKeysSection />
            </TabsContent> */}

            <TabsContent value="logs" className="mt-6">
              <KeyMovementLogs />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
