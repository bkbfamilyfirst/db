"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { History, Search, Download, Send, Package, Calendar } from "lucide-react"

interface MovementLog {
  id: string
  timestamp: string
  type: "receive" | "distribute" | "transfer" | "activate"
  description: string
  quantity: number
  from: string
  to: string
  batchNumber?: string
  status: "completed" | "pending" | "failed"
  reference: string
}

const mockLogs: MovementLog[] = [
  {
    id: "1",
    timestamp: "2024-01-25T10:30:00Z",
    type: "receive",
    description: "Received keys from SS",
    quantity: 3200,
    from: "SS Central",
    to: "Main Inventory",
    batchNumber: "SS-2024-003",
    status: "completed",
    reference: "REC-001",
  },
  {
    id: "2",
    timestamp: "2024-01-25T09:15:00Z",
    type: "distribute",
    description: "Distributed keys to retailer",
    quantity: 425,
    from: "Main Inventory",
    to: "Smart Electronics Kolkata",
    batchNumber: "SS-2024-002",
    status: "completed",
    reference: "DIST-045",
  },
  {
    id: "3",
    timestamp: "2024-01-24T16:45:00Z",
    type: "activate",
    description: "Keys activated by retailer",
    quantity: 156,
    from: "Smart Electronics Kolkata",
    to: "End Customer",
    status: "completed",
    reference: "ACT-789",
  },
  {
    id: "4",
    timestamp: "2024-01-24T14:20:00Z",
    type: "distribute",
    description: "Distributed keys to retailer",
    quantity: 750,
    from: "Main Inventory",
    to: "Digital Hub Delhi",
    batchNumber: "SS-2024-001",
    status: "pending",
    reference: "DIST-044",
  },
  {
    id: "5",
    timestamp: "2024-01-23T11:30:00Z",
    type: "transfer",
    description: "Internal transfer between warehouses",
    quantity: 200,
    from: "Warehouse A",
    to: "Warehouse B",
    status: "completed",
    reference: "TRF-012",
  },
  {
    id: "6",
    timestamp: "2024-01-23T09:45:00Z",
    type: "receive",
    description: "Received keys from SS",
    quantity: 1800,
    from: "SS Central",
    to: "Main Inventory",
    batchNumber: "SS-2024-002",
    status: "completed",
    reference: "REC-002",
  },
  {
    id: "7",
    timestamp: "2024-01-22T15:20:00Z",
    type: "distribute",
    description: "Distributed keys to retailer",
    quantity: 320,
    from: "Main Inventory",
    to: "Cyber Solutions Chennai",
    batchNumber: "SS-2024-001",
    status: "failed",
    reference: "DIST-043",
  },
  {
    id: "8",
    timestamp: "2024-01-22T13:10:00Z",
    type: "activate",
    description: "Keys activated by retailer",
    quantity: 89,
    from: "Tech Store Mumbai",
    to: "End Customer",
    status: "completed",
    reference: "ACT-788",
  },
]

export function KeyMovementLogs() {
  const [logs, setLogs] = useState<MovementLog[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.reference.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || log.type === filterType
    const matchesStatus = filterStatus === "all" || log.status === filterStatus

    return matchesSearch && matchesType && matchesStatus
  })

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentLogs = filteredLogs.slice(startIndex, endIndex)

  // Reset to first page when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn()
    setCurrentPage(1)
  }

  const getTypeIcon = (type: MovementLog["type"]) => {
    switch (type) {
      case "receive":
        return <Download className="h-4 w-4" />
      case "distribute":
        return <Send className="h-4 w-4" />
      case "transfer":
        return <Package className="h-4 w-4" />
      case "activate":
        return <Package className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: MovementLog["type"]) => {
    switch (type) {
      case "receive":
        return "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
      case "distribute":
        return "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
      case "transfer":
        return "bg-gradient-to-r from-electric-blue to-electric-purple text-white"
      case "activate":
        return "bg-gradient-to-r from-electric-purple to-electric-pink text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getStatusColor = (status: MovementLog["status"]) => {
    switch (status) {
      case "completed":
        return "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
      case "pending":
        return "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
      case "failed":
        return "bg-gradient-to-r from-red-500 to-red-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const exportLogs = () => {
    // This would typically export to CSV or PDF
    console.log("Exporting logs:", filteredLogs)
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card className="border-0 bg-gradient-to-br from-electric-purple/5 to-electric-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                <History className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                Key Movement Logs
              </span>
            </div>
            <Button
              onClick={exportLogs}
              size="sm"
              variant="outline"
              className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value) => handleFilterChange(() => setFilterType(value))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="receive">Receive</SelectItem>
                  <SelectItem value="distribute">Distribute</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                  <SelectItem value="activate">Activate</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={(value) => handleFilterChange(() => setFilterStatus(value))}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              Movement History ({filteredLogs.length} records)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-electric-purple/5 to-electric-blue/5">
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>From → To</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(log.timestamp).toLocaleDateString()}</div>
                        <div className="text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(log.type)}>
                        {getTypeIcon(log.type)}
                        <span className="ml-1 capitalize">{log.type}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{log.description}</div>
                        {log.batchNumber && (
                          <div className="text-sm text-muted-foreground">Batch: {log.batchNumber}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{log.quantity.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">keys</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="font-medium">{log.from}</div>
                        <div className="text-muted-foreground">↓</div>
                        <div className="font-medium">{log.to}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                        {log.reference}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(log.status)}>
                        <span className="capitalize">{log.status}</span>
                      </Badge>
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
