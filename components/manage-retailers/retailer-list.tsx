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
import { toast as sonnerToast } from 'sonner'
import { changeRetailerPassword } from '@/lib/api'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, Copy } from 'lucide-react'

// Map API retailer to UI retailer format
interface UIRetailer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: "active" | "blocked"
  keysAssigned: number
  activations: number
  joinDate: string
}

// Shape expected by the EditRetailerDialog (map UI -> dialog shape)
interface DialogRetailer {
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
  const [editingRetailer, setEditingRetailer] = useState<DialogRetailer | null>(null)
  const [assigningKeysRetailer, setAssigningKeysRetailer] = useState<UIRetailer | null>(null)
  const [confirmingChangePasswordFor, setConfirmingChangePasswordFor] = useState<UIRetailer | null>(null)
  const [changingPasswordFor, setChangingPasswordFor] = useState<UIRetailer | null>(null)
  const [newPassword, setNewPassword] = useState<string>('')
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [passwordSuccessFor, setPasswordSuccessFor] = useState<{ retailer: UIRetailer; password: string } | null>(null)
  const [passwordErrorFor, setPasswordErrorFor] = useState<{ retailer: UIRetailer; message: string } | null>(null)
  // use Sonner for toasts
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)  // Function to map API retailer to UI format
  const mapRetailerToUI = (retailer: Retailer): UIRetailer => {
    return {
      id: retailer._id,
      name: retailer.name,
      email: retailer.email,
      phone: retailer.phone,
      address: retailer.address || 'Unknown',
      status: retailer.status === 'blocked' ? 'blocked' : 'active',
      keysAssigned: retailer.receivedKeys,
      activations: retailer.activations || 0,
      joinDate: retailer.createdAt,
    }
  }

  // Removed auto-generated password: user must enter a new password manually

  // Fetch retailers from API
  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        setIsLoading(true)
        setError(null)
          const response = await getRetailerList({
          search: searchTerm || undefined,
          status: filterStatus === 'all' ? undefined : filterStatus,        })
        
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
        sonnerToast.error(errorMessage)
      } finally {
        setIsLoading(false)
      }    }    
      fetchRetailers()
  }, [searchTerm, filterStatus, refreshTrigger])

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch =
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.address.toLowerCase().includes(searchTerm.toLowerCase())

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
      
      sonnerToast.success(`Retailer ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`)
    } catch (error: any) {
      sonnerToast.error("Failed to update retailer status")
    }
  }

  const handleDeleteRetailer = async (retailerId: string) => {
    try {
      await deleteRetailer(retailerId)
      setRetailers((prev) => prev.filter((retailer) => retailer.id !== retailerId))
      
      sonnerToast.success("Retailer deleted successfully")
    } catch (error: any) {
      sonnerToast.error("Failed to delete retailer")    }
  }

  // Receive the retailer in the dialog (DialogRetailer) shape, map back to UIRetailer
  const handleUpdateRetailer = async (updatedDialogRetailer: DialogRetailer) => {
    // Map dialog shape back to UI shape
    const updatedRetailer: UIRetailer = {
      id: updatedDialogRetailer.id,
      name: updatedDialogRetailer.name,
      email: updatedDialogRetailer.email,
      phone: updatedDialogRetailer.phone,
      address: updatedDialogRetailer.region,
      status: updatedDialogRetailer.status,
      keysAssigned: updatedDialogRetailer.keysAssigned,
      activations: updatedDialogRetailer.activations,
      joinDate: updatedDialogRetailer.joinDate,
    }

    try {
      await updateRetailer(updatedRetailer.id, {
        name: updatedRetailer.name,
        phone: updatedRetailer.phone,
        address: updatedRetailer.address, // Map UI address to backend address field
      })

      setRetailers((prev) => prev.map((retailer) => (retailer.id === updatedRetailer.id ? updatedRetailer : retailer)))

      sonnerToast.success("Retailer updated successfully")
    } catch (error: any) {
      sonnerToast.error("Failed to update retailer")
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
                      <TableHead>Address</TableHead>
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
                        {retailer.address}
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
                          <DropdownMenuItem onClick={() => setEditingRetailer({
                            id: retailer.id,
                            name: retailer.name,
                            email: retailer.email,
                            phone: retailer.phone,
                            region: retailer.address,
                            status: retailer.status,
                            keysAssigned: retailer.keysAssigned,
                            activations: retailer.activations,
                            joinDate: retailer.joinDate,
                          })}>
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
                          <DropdownMenuItem onClick={() => setConfirmingChangePasswordFor(retailer)}>
                            <Key className="h-4 w-4 mr-2" />
                            Change Password
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
        onOpenChangeAction={(open) => !open && setEditingRetailer(null)}
        onUpdateAction={handleUpdateRetailer}
      />      {/* Assign Keys Dialog */}
      <AssignKeysDialog
        retailer={assigningKeysRetailer ? {
          id: assigningKeysRetailer.id,
          name: assigningKeysRetailer.name,
          email: assigningKeysRetailer.email,
          phone: assigningKeysRetailer.phone,
          region: assigningKeysRetailer.address,
          status: assigningKeysRetailer.status,
          keysAssigned: assigningKeysRetailer.keysAssigned,
          activations: assigningKeysRetailer.activations,
          joinDate: assigningKeysRetailer.joinDate,
        } : null}
        open={!!assigningKeysRetailer}
        onOpenChangeAction={(open) => !open && setAssigningKeysRetailer(null)}
        onAssignAction={handleAssignKeys}
      />
      {/* Confirm Change Password Dialog */}
      <Dialog open={!!confirmingChangePasswordFor} onOpenChange={(open) => !open && setConfirmingChangePasswordFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password?</DialogTitle>
            <DialogDescription>Are you sure you want to change the password for {confirmingChangePasswordFor?.name}?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setConfirmingChangePasswordFor(null)}>Cancel</Button>
              <Button onClick={() => { setChangingPasswordFor(confirmingChangePasswordFor); setConfirmingChangePasswordFor(null); setNewPassword(''); }}>Proceed</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={!!changingPasswordFor} onOpenChange={(open) => !open && setChangingPasswordFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change password for {changingPasswordFor?.name}</DialogTitle>
            <DialogDescription>Enter a new password for the retailer. You can toggle visibility and copy the generated password.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <label className="text-sm text-muted-foreground">New Password</label>
            <div className="relative">
              <Input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type={showNewPassword ? 'text' : 'password'} minLength={8} aria-invalid={newPassword.length > 0 && newPassword.length < 8} />
              <button type="button" className="absolute right-2 top-1/2 -translate-y-1/2 p-2" onClick={() => setShowNewPassword((s) => !s)} aria-label="Toggle password visibility">
                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {newPassword.length > 0 && newPassword.length < 8 && (
              <div className="text-sm text-red-600">Password must be at least 8 characters.</div>
            )}
          </div>

          <DialogFooter>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setChangingPasswordFor(null)}>Cancel</Button>
              <Button onClick={async () => {
                if (!changingPasswordFor) return;
                if (!newPassword || newPassword.trim().length === 0) {
                  sonnerToast.error('Please enter a new password before submitting.');
                  return;
                }
                if (newPassword.trim().length < 8) {
                  sonnerToast.error('Password must be at least 8 characters long.');
                  return;
                }
                try {
                  const res = await changeRetailerPassword(changingPasswordFor.id, newPassword);
                  setPasswordSuccessFor({ retailer: changingPasswordFor, password: newPassword });
                  setChangingPasswordFor(null);
                } catch (err: any) {
                  const msg = err?.response?.data?.message || err?.message || 'Failed to change password.';
                  setPasswordErrorFor({ retailer: changingPasswordFor, message: msg });
                  setChangingPasswordFor(null);
                }
              }}>Change Password</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Success Dialog */}
      <Dialog open={!!passwordSuccessFor} onOpenChange={(open) => !open && setPasswordSuccessFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Password Changed</DialogTitle>
            <DialogDescription>The password was changed successfully for {passwordSuccessFor?.retailer.name}.</DialogDescription>
          </DialogHeader>

          <div className="mt-2">
            <div className="rounded-md border p-4 flex items-center justify-between">
              <div className="font-mono break-all">{passwordSuccessFor?.password}</div>
              <button className="p-2 ml-4" onClick={() => { navigator.clipboard.writeText(passwordSuccessFor?.password || ''); sonnerToast.success('Copied password to clipboard'); }} aria-label="Copy password">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setPasswordSuccessFor(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Error Dialog */}
      <Dialog open={!!passwordErrorFor} onOpenChange={(open) => !open && setPasswordErrorFor(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error Changing Password</DialogTitle>
            <DialogDescription>Unable to change password for {passwordErrorFor?.retailer.name}.</DialogDescription>
          </DialogHeader>
          <div className="mt-2 text-sm text-red-600">{passwordErrorFor?.message}</div>
          <DialogFooter>
            <Button onClick={() => setPasswordErrorFor(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
