"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { Send, Users, CheckCircle, Clock, Package, Plus } from "lucide-react"

interface Distribution {
  id: string
  retailerName: string
  retailerId: string
  quantity: number
  distributedDate: string
  status: "pending" | "sent" | "delivered" | "confirmed"
  batchNumber: string
  region: string
}

const mockDistributions: Distribution[] = [
  {
    id: "1",
    retailerName: "Tech Store Mumbai",
    retailerId: "RET-001",
    quantity: 500,
    distributedDate: "2024-01-15",
    status: "confirmed",
    batchNumber: "SS-2024-001",
    region: "West",
  },
  {
    id: "2",
    retailerName: "Digital Hub Delhi",
    retailerId: "RET-002",
    quantity: 750,
    distributedDate: "2024-01-20",
    status: "delivered",
    batchNumber: "SS-2024-001",
    region: "North",
  },
  {
    id: "3",
    retailerName: "Smart Electronics Kolkata",
    retailerId: "RET-003",
    quantity: 425,
    distributedDate: "2024-01-22",
    status: "sent",
    batchNumber: "SS-2024-002",
    region: "East",
  },
  {
    id: "4",
    retailerName: "Cyber Solutions Chennai",
    retailerId: "RET-004",
    quantity: 320,
    distributedDate: "2024-01-23",
    status: "pending",
    batchNumber: "SS-2024-002",
    region: "South",
  },
  {
    id: "5",
    retailerName: "Future Tech Bangalore",
    retailerId: "RET-005",
    quantity: 680,
    distributedDate: "2024-01-24",
    status: "confirmed",
    batchNumber: "SS-2024-003",
    region: "South",
  },
  {
    id: "6",
    retailerName: "Digital World Pune",
    retailerId: "RET-006",
    quantity: 450,
    distributedDate: "2024-01-25",
    status: "delivered",
    batchNumber: "SS-2024-003",
    region: "West",
  },
]

const mockRetailers = [
  { id: "RET-001", name: "Tech Store Mumbai", region: "West" },
  { id: "RET-002", name: "Digital Hub Delhi", region: "North" },
  { id: "RET-003", name: "Smart Electronics Kolkata", region: "East" },
  { id: "RET-004", name: "Cyber Solutions Chennai", region: "South" },
]

export function DistributeKeysSection() {
  const [distributions, setDistributions] = useState<Distribution[]>(mockDistributions)
  const [isDistributing, setIsDistributing] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(4)
  const [newDistribution, setNewDistribution] = useState({
    retailerId: "",
    quantity: "",
    batchNumber: "",
  })

  // Calculate pagination
  const totalPages = Math.ceil(distributions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDistributions = distributions.slice(startIndex, endIndex)

  const handleDistribute = () => {
    if (!newDistribution.retailerId || !newDistribution.quantity || !newDistribution.batchNumber) return

    const retailer = mockRetailers.find((r) => r.id === newDistribution.retailerId)
    if (!retailer) return

    const distribution: Distribution = {
      id: Date.now().toString(),
      retailerName: retailer.name,
      retailerId: newDistribution.retailerId,
      quantity: Number.parseInt(newDistribution.quantity),
      distributedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      batchNumber: newDistribution.batchNumber,
      region: retailer.region,
    }

    setDistributions([distribution, ...distributions])
    setNewDistribution({ retailerId: "", quantity: "", batchNumber: "" })
    setIsDistributing(false)
    setCurrentPage(1) // Reset to first page when adding new distribution
  }

  const handleStatusUpdate = (distributionId: string, newStatus: Distribution["status"]) => {
    setDistributions((prev) => prev.map((dist) => (dist.id === distributionId ? { ...dist, status: newStatus } : dist)))
  }

  const getStatusIcon = (status: Distribution["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "sent":
        return <Send className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Distribution["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
      case "sent":
        return "bg-gradient-to-r from-electric-blue to-electric-purple text-white"
      case "delivered":
        return "bg-gradient-to-r from-electric-cyan to-electric-blue text-white"
      case "confirmed":
        return "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Distribute Keys Form */}
      <Card className="border-0 bg-gradient-to-br from-electric-orange/5 to-electric-pink/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
                <Send className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
                Distribute Keys to Retailers
              </span>
            </div>
            <Button
              onClick={() => setIsDistributing(!isDistributing)}
              size="sm"
              className="bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Distribution
            </Button>
          </CardTitle>
        </CardHeader>
        {isDistributing && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="retailer">Select Retailer</Label>
                <Select
                  value={newDistribution.retailerId}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, retailerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose retailer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRetailers.map((retailer) => (
                      <SelectItem key={retailer.id} value={retailer.id}>
                        {retailer.name} ({retailer.region})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newDistribution.quantity}
                  onChange={(e) => setNewDistribution({ ...newDistribution, quantity: e.target.value })}
                  placeholder="Number of keys"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Source Batch</Label>
                <Select
                  value={newDistribution.batchNumber}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, batchNumber: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SS-2024-001">SS-2024-001 (2,500 keys)</SelectItem>
                    <SelectItem value="SS-2024-002">SS-2024-002 (1,800 keys)</SelectItem>
                    <SelectItem value="SS-2024-003">SS-2024-003 (3,200 keys)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleDistribute}
                className="bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
              >
                Distribute Keys
              </Button>
              <Button variant="outline" onClick={() => setIsDistributing(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Distribution List */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Distribution History ({distributions.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-electric-purple/5 to-electric-blue/5">
                  <TableHead>Retailer</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDistributions.map((distribution) => (
                  <TableRow key={distribution.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{distribution.retailerName}</div>
                        <div className="text-sm text-muted-foreground">{distribution.retailerId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{distribution.quantity.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">keys</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                        {distribution.batchNumber}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                        {distribution.region}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(distribution.distributedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(distribution.status)}>
                        {getStatusIcon(distribution.status)}
                        <span className="ml-1 capitalize">{distribution.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {distribution.status === "pending" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(distribution.id, "sent")}
                          >
                            Mark Sent
                          </Button>
                        )}
                        {distribution.status === "sent" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(distribution.id, "delivered")}
                          >
                            Mark Delivered
                          </Button>
                        )}
                        {distribution.status === "delivered" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(distribution.id, "confirmed")}
                          >
                            Confirm
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Custom Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        </CardContent>
      </Card>
    </div>
  )
}
