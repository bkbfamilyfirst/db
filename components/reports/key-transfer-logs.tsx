"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, CheckCircle, Clock, XCircle, Eye, Download, ArrowRight, Calendar, User, Key } from "lucide-react"

// Sample data for key transfer logs
const transferLogs = [
  {
    id: "TXN001",
    timestamp: "2024-01-15 14:30:25",
    fromUser: "Admin",
    toDistributor: "TechGuard Solutions",
    distributorId: "ND001",
    keysTransferred: 500,
    status: "completed",
    transferType: "bulk",
    notes: "Monthly key allocation",
  },
  {
    id: "TXN002",
    timestamp: "2024-01-15 13:45:12",
    fromUser: "Admin",
    toDistributor: "SecureFamily Networks",
    distributorId: "ND002",
    keysTransferred: 300,
    status: "completed",
    transferType: "regular",
    notes: "Additional keys requested",
  },
  {
    id: "TXN003",
    timestamp: "2024-01-15 12:20:08",
    fromUser: "Admin",
    toDistributor: "KidSafe Technologies",
    distributorId: "ND003",
    keysTransferred: 750,
    status: "pending",
    transferType: "bulk",
    notes: "Quarterly allocation",
  },
  {
    id: "TXN004",
    timestamp: "2024-01-15 11:15:33",
    fromUser: "Admin",
    toDistributor: "ParentControl Systems",
    distributorId: "ND004",
    keysTransferred: 1000,
    status: "completed",
    transferType: "bulk",
    notes: "Large order fulfillment",
  },
  {
    id: "TXN005",
    timestamp: "2024-01-15 10:30:45",
    fromUser: "Admin",
    toDistributor: "FamilyShield Inc.",
    distributorId: "ND005",
    keysTransferred: 200,
    status: "failed",
    transferType: "regular",
    notes: "Insufficient inventory",
  },
  {
    id: "TXN006",
    timestamp: "2024-01-14 16:45:22",
    fromUser: "Admin",
    toDistributor: "TechGuard Solutions",
    distributorId: "ND001",
    keysTransferred: 150,
    status: "completed",
    transferType: "regular",
    notes: "Emergency allocation",
  },
  {
    id: "TXN007",
    timestamp: "2024-01-14 15:20:18",
    fromUser: "Admin",
    toDistributor: "SecureFamily Networks",
    distributorId: "ND002",
    keysTransferred: 400,
    status: "completed",
    transferType: "bulk",
    notes: "Weekly allocation",
  },
  {
    id: "TXN008",
    timestamp: "2024-01-14 14:10:55",
    fromUser: "Admin",
    toDistributor: "KidSafe Technologies",
    distributorId: "ND003",
    keysTransferred: 600,
    status: "pending",
    transferType: "bulk",
    notes: "Pending approval",
  },
]

export function KeyTransferLogs() {
  const [sortColumn, setSortColumn] = useState("timestamp")
  const [sortDirection, setSortDirection] = useState("desc")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("desc")
    }
  }

  const sortedLogs = [...transferLogs].sort((a, b) => {
    const aValue = a[sortColumn as keyof typeof a]
    const bValue = b[sortColumn as keyof typeof b]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-electric-green" />
      case "pending":
        return <Clock className="h-4 w-4 text-electric-orange" />
      case "failed":
        return <XCircle className="h-4 w-4 text-electric-red" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-gradient-to-r from-electric-green to-electric-cyan text-white">Completed</Badge>
      case "pending":
        return <Badge className="bg-gradient-to-r from-electric-orange to-electric-yellow text-white">Pending</Badge>
      case "failed":
        return <Badge className="bg-gradient-to-r from-electric-red to-electric-pink text-white">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getTransferTypeBadge = (type: string) => {
    return type === "bulk" ? (
      <Badge variant="outline" className="text-electric-purple border-electric-purple">
        Bulk
      </Badge>
    ) : (
      <Badge variant="outline" className="text-electric-blue border-electric-blue">
        Regular
      </Badge>
    )
  }

  return (
    <Card className="border-0 bg-white dark:bg-gray-900 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-electric-orange" />
            Key Transfer Logs
          </CardTitle>
          <div className="flex gap-2">
            {/* <Button
              size="sm"
              variant="outline"
              className="border-electric-blue/30 text-electric-blue hover:bg-electric-blue/10"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button> */}
            <Button
              size="sm"
              className="bg-gradient-to-r from-electric-orange to-electric-pink hover:opacity-90 text-white"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                <TableHead className="w-[100px]">Transfer ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort("timestamp")}>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Timestamp
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    Transfer Details
                  </div>
                </TableHead>
                <TableHead className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Key className="h-4 w-4" />
                    Keys
                  </div>
                </TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedLogs.map((log) => (
                <TableRow key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 group transition-colors">
                  <TableCell className="font-medium text-electric-purple">{log.id}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</div>
                      <div className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">From:</span>
                        <span className="font-medium text-electric-blue">{log.fromUser}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="h-3 w-3 text-gray-400" />
                        <span className="font-medium text-electric-green">{log.toDistributor}</span>
                        <span className="text-xs text-gray-500">({log.distributorId})</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                        {log.keysTransferred.toLocaleString()}
                      </span>
                      <span className="text-xs text-gray-500">keys</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      {getStatusIcon(log.status)}
                      {getStatusBadge(log.status)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{getTransferTypeBadge(log.transferType)}</TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{log.notes}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
