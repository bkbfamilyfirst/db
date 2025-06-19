"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { History, Search, Download, Send, Package, Calendar } from "lucide-react"
import { getKeyTransferLogs } from "../../lib/api"
import type { KeyTransferLog } from "../../lib/api"

export function KeyMovementLogs() {
  const [logs, setLogs] = useState<KeyTransferLog[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [totalLogs, setTotalLogs] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true)
      setError(null)
      try {
        const params: any = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
          status: filterStatus === "all" ? undefined : filterStatus,
          type: filterType === "all" ? undefined : filterType,
        }
        const response = await getKeyTransferLogs(params)
        setLogs(response.logs)
        setTotalLogs(response.total)
      } catch (err) {
        setError("Failed to fetch movement logs.")
      }
      setLoading(false)
    }

    fetchLogs()
  }, [currentPage, itemsPerPage, searchTerm, filterStatus, filterType])

  const totalPages = Math.ceil(totalLogs / itemsPerPage)

  // Reset to first page when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn()
    setCurrentPage(1)
  }

  const getTypeIcon = (type: KeyTransferLog["type"]) => {
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

  const getTypeColor = (type: KeyTransferLog["type"]) => {
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

  const getStatusColor = (status: KeyTransferLog["status"]) => {
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
    console.log("Exporting logs:", logs)
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
              Movement History ({totalLogs} records)
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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-red-500">
                      {error}
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No movement logs found.
                    </TableCell>
                  </TableRow>
                ) : (                  logs.map((log, index) => {
                    const isValidDate = log.date && !isNaN(new Date(log.date).getTime());
                    // Use a unique key combination to avoid React warnings
                    const uniqueKey = log._id || log.transferId || `log-${index}-${log.date || Date.now()}`;
                    return (
                      <TableRow key={uniqueKey} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="text-sm">
                            {isValidDate ? (
                              <>
                                <div>{new Date(log.date).toLocaleDateString()}</div>
                                <div className="text-muted-foreground">{new Date(log.date).toLocaleTimeString()}</div>
                              </>
                            ) : (
                              <div>Invalid Date</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getTypeColor(log.type)}>
                            {getTypeIcon(log.type)}
                            <span className="ml-1 capitalize">{log.type || 'N/A'}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.notes || '-'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{log.count ? log.count.toLocaleString() : '0'}</div>
                            <div className="text-xs text-muted-foreground">keys</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="font-medium">{log.fromUser?.name || 'System'}</div>
                            <div className="text-muted-foreground">↓</div>
                            <div className="font-medium">{log.toUser?.name || 'System'}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                            {log.transferId || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(log.status)}>
                            <span className="capitalize">{log.status || 'Unknown'}</span>
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
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
