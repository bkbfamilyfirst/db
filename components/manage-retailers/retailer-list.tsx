"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreHorizontal,
  Edit,
  Key,
  Shield,
  ShieldOff,
  Trash2,
  Store,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { EditRetailerDialog } from "./edit-retailer-dialog"
import { AssignKeysDialog } from "./assign-keys-dialog"
import { getRetailerList, deleteRetailer, updateRetailer, type Retailer } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Map API retailer to UI retailer format
interface UIRetailer {
  id: string
  name: string
  email: string
  phone: string
  region: string
  status: "active" | "blocked"
  keysAssigned: number
  activations: number
  joinDate: string
}

interface RetailerListProps {
  searchTerm: string
  filterStatus: string
  refreshTrigger?: number
}

export function RetailerList({ searchTerm, filterStatus, refreshTrigger = 0 }: RetailerListProps) {
  const [retailers, setRetailers] = useState<UIRetailer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingRetailer, setEditingRetailer] = useState<UIRetailer | null>(null)
  const [assigningKeysRetailer, setAssigningKeysRetailer] = useState<UIRetailer | null>(null)
  const { toast } = useToast()
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  // Function to map API retailer to UI format
  const mapRetailerToUI = (retailer: Retailer): UIRetailer => ({
    id: retailer._id,
    name: retailer.name,
    email: retailer.email,
    phone: retailer.phone,
    region: retailer.location || 'Unknown',
    status: retailer.status === 'blocked' ? 'blocked' : 'active',
    keysAssigned: retailer.assignedKeys,
    activations: retailer.activations || 0,
    joinDate: retailer.createdAt,
  })

  // Fetch retailers from API
  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await getRetailerList({
          search: searchTerm || undefined,
          status: filterStatus === 'all' ? undefined : filterStatus,
        })
        
        const mappedRetailers = response.retailers.map(mapRetailerToUI)
        setRetailers(mappedRetailers)
      } catch (err: any) {
        console.error('Failed to fetch retailers:', err)
        let errorMessage = 'Failed to load retailers'
        
        if (err.code === 'ECONNREFUSED' || err.message?.includes('Network Error')) {
          errorMessage = 'Backend server is not available'
        } else if (err.response?.status === 401) {
          errorMessage = 'Authentication failed'
        } else if (err.response?.status === 500) {
          errorMessage = 'Server error occurred'
        }
        
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }    }    
      fetchRetailers()
  }, [searchTerm, filterStatus, refreshTrigger])

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch =
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || retailer.status === filterStatus

    return matchesSearch && matchesFilter
  })

  // Pagination calculations
  const totalItems = filteredRetailers.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRetailers = filteredRetailers.slice(startIndex, endIndex)
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filterStatus])

  const handleStatusToggle = async (retailerId: string) => {
    try {
      const retailer = retailers.find(r => r.id === retailerId)
      if (!retailer) return
      
      const newStatus = retailer.status === "active" ? "blocked" : "active"
      
      await updateRetailer(retailerId, { status: newStatus })
      
      setRetailers((prev) =>
        prev.map((retailer) =>
          retailer.id === retailerId
            ? { ...retailer, status: newStatus }
            : retailer,
        ),
      )
      
      toast({
        title: "Success",
        description: `Retailer ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update retailer status",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRetailer = async (retailerId: string) => {
    try {
      await deleteRetailer(retailerId)
      setRetailers((prev) => prev.filter((retailer) => retailer.id !== retailerId))
      
      toast({
        title: "Success",
        description: "Retailer deleted successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete retailer",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRetailer = async (updatedRetailer: UIRetailer) => {
    try {
      await updateRetailer(updatedRetailer.id, {
        name: updatedRetailer.name,
        email: updatedRetailer.email,
        phone: updatedRetailer.phone,
        location: updatedRetailer.region,
      })
      
      setRetailers((prev) => prev.map((retailer) => 
        retailer.id === updatedRetailer.id ? updatedRetailer : retailer
      ))
      
      toast({
        title: "Success",
        description: "Retailer updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update retailer",
        variant: "destructive",
      })
    }
  }

  const handleAssignKeys = (retailerId: string, keyCount: number) => {
    setRetailers((prev) =>
      prev.map((retailer) =>
        retailer.id === retailerId ? { ...retailer, keysAssigned: retailer.keysAssigned + keyCount } : retailer,
      ),
    )
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
  }
  return (
    <>
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              Retailer Directory ({totalItems})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading retailers...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-6 w-6" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          ) : retailers.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-muted-foreground">
                <Store className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No retailers found</p>
                <p className="text-xs">Try adjusting your search or filters</p>
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-electric-purple/5 to-electric-blue/5">
                      <TableHead>Retailer Info</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Region</TableHead>
                      <TableHead>Keys</TableHead>
                      <TableHead>Activations</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                {currentRetailers.map((retailer) => (
                  <TableRow key={retailer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{retailer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {new Date(retailer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {retailer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {retailer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                        {retailer.region}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{retailer.keysAssigned}</div>
                        <div className="text-xs text-muted-foreground">assigned</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium text-electric-green">{retailer.activations}</div>
                        <div className="text-xs text-muted-foreground">
                          {((retailer.activations / retailer.keysAssigned) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={retailer.status === "active" ? "default" : "destructive"}
                        className={
                          retailer.status === "active"
                            ? "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
                            : "bg-gradient-to-r from-electric-pink to-electric-orange text-white"
                        }
                      >
                        {retailer.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingRetailer(retailer)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAssigningKeysRetailer(retailer)}>
                            <Key className="h-4 w-4 mr-2" />
                            Assign Keys
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(retailer.id)}>
                            {retailer.status === "active" ? (
                              <>
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Block Retailer
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Unblock Retailer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRetailer(retailer.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>                
              </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-2 py-4">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                      <SelectTrigger className="h-8 w-[70px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent side="top">
                        {[5, 10, 20, 30, 50].map((pageSize) => (
                          <SelectItem key={pageSize} value={pageSize.toString()}>
                            {pageSize}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => handlePageChange(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} entries
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Retailer Dialog */}
      <EditRetailerDialog
        retailer={editingRetailer}
        open={!!editingRetailer}
        onOpenChange={(open) => !open && setEditingRetailer(null)}
        onUpdate={handleUpdateRetailer}
      />

      {/* Assign Keys Dialog */}
      <AssignKeysDialog
        retailer={assigningKeysRetailer}
        open={!!assigningKeysRetailer}
        onOpenChange={(open) => !open && setAssigningKeysRetailer(null)}
        onAssign={handleAssignKeys}
      />
    </>
  )
}
