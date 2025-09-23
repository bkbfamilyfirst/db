"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu" 
import { Download, Package, CheckCircle, Clock, AlertCircle, Plus, Loader2, XCircle, MoreHorizontal, Eye } from "lucide-react" 
import { getRecentKeyBatches, RecentKeyBatch, RecentKeyBatchesResponse, ReceiveKeysFromSsData, handleApiError, getErrorMessage, handleKeyBatchAction, receiveKeysFromSs } from "@/lib/api"
import { toast as sonnerToast } from 'sonner'

export function ReceiveKeysSection() {
  const [batches, setBatches] = useState<RecentKeyBatch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddingBatch, setIsAddingBatch] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(3)
  const [newBatch, setNewBatch] = useState({
    batchNumber: "",
    quantity: "",
    ssReference: "",
    notes: "",
  })
  // use Sonner for toasts

  useEffect(() => {
    const fetchBatches = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // getRecentKeyBatches now returns RecentKeyBatchesResponse which has a `batches` property
        // The `batches` property itself is an array of the new RecentKeyBatch structure.
        const responseData = await getRecentKeyBatches() 
        setBatches(responseData.batches || []) // Assuming API returns { batches: RecentKeyBatch[] }
      } catch (err) {
  const errorMessage = err instanceof Error ? err.message : "An unknown error occurred";
  setError(errorMessage)
  sonnerToast.error(`Error fetching batches: ${errorMessage}`);
        setBatches([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchBatches()
  }, [])

  const totalPages = Math.ceil(batches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentBatches = batches.slice(startIndex, endIndex)

  const handleAddBatch = async () => { // Changed to async to potentially call API
    if (!newBatch.batchNumber || !newBatch.quantity || !newBatch.ssReference) {
      sonnerToast.error("Batch Number, Quantity, and SS Reference are required.");
      return;
    }
    if (isNaN(parseInt(newBatch.quantity)) || parseInt(newBatch.quantity) <= 0) {
    sonnerToast.error("Quantity must be a positive number.");
        return;
    }    // This object is for the receiveKeysFromSs API, which matches the server expectation
    const batchDataForApi: ReceiveKeysFromSsData = { 
      batchNumber: newBatch.batchNumber, 
      quantity: Number.parseInt(newBatch.quantity),
      ssReference: newBatch.ssReference, 
      notes: newBatch.notes || "", // Ensure notes is never undefined
    };

    // Simulating API call and adding to local state with new structure
    try {
      // Replace local simulation with actual API call
      setIsLoading(true); // Set loading state for API call
      const response = await receiveKeysFromSs(batchDataForApi);
      
      // The API returns an object like { message: string, batch: RecentKeyBatch }
      const createdApiBatch: RecentKeyBatch = response.batch; // Explicitly type createdApiBatch

  setBatches(prevBatches => [createdApiBatch, ...prevBatches].sort((a, b) => new Date(b.receivedDate).getTime() - new Date(a.receivedDate).getTime()));
      setNewBatch({ batchNumber: "", quantity: "", ssReference: "", notes: "" });
      setIsAddingBatch(false);
      setCurrentPage(1);
  sonnerToast.success(`${response.message} (Batch ID: ${createdApiBatch.ssReference})`);
    } catch (error) {
  handleApiError(error, "Failed to add batch");
  sonnerToast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false); // Ensure loading is turned off in finally block
    }
  }

  const handleStatusUpdate = async (batchId: string, newStatus: RecentKeyBatch["status"]) => {
    const originalBatches = [...batches];
    setBatches((prev) =>
      prev.map((batch) => (batch.batchId === batchId ? { ...batch, status: newStatus } : batch))
    )
    try {
      // Use batchId (which is the actual _id from DB) for the API call
      await handleKeyBatchAction(batchId, 'updateStatus', { status: newStatus }); 
      sonnerToast.success(`Status updated: Batch ${batchId} is now ${newStatus}.`);
    } catch (error) {
      setBatches(originalBatches); // Revert on error
      handleApiError(error, "Failed to update batch status");
      sonnerToast.error(`Error updating status: ${getErrorMessage(error)}`);
    }
  }

  const getStatusIcon = (status: RecentKeyBatch["status"]) => {
    switch (status) {
      case "Pending":
        return <Clock className="h-4 w-4" />
      case "Received":
        return <Download className="h-4 w-4" />
      case "Verified":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: RecentKeyBatch["status"]) => {
    switch (status) {
      case "Pending":
        return "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
      case "Received":
        return "bg-gradient-to-r from-electric-blue to-electric-purple text-white"
      case "Verified":
        return "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Batch Card - Functionality is currently local */}
      <Card className="border-0 bg-gradient-to-br from-electric-green/5 to-electric-cyan/5">        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
                <Download className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                Receive Keys from SS
              </span>
            </div>
            <Button
              onClick={() => setIsAddingBatch(!isAddingBatch)}
              size="sm"
              className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white"
            >
              {isAddingBatch ? <XCircle className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {isAddingBatch ? "Cancel" : "New Batch"}
            </Button>
          </CardTitle>
        </CardHeader>        {isAddingBatch && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={newBatch.batchNumber}
                  onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                  placeholder="SS-2024-XXX"
                  className="border-electric-green/30 focus:border-electric-green focus:ring-electric-green/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                  placeholder="Number of keys"
                  className="border-electric-cyan/30 focus:border-electric-cyan focus:ring-electric-cyan/20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="ssReference">SS Reference</Label>
                <Input
                  id="ssReference"
                  value={newBatch.ssReference}
                  onChange={(e) => setNewBatch({ ...newBatch, ssReference: e.target.value })}
                  placeholder="REF-SS-XXX"
                  className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                  className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                />
              </div>
            </div>            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddBatch}
                disabled={isLoading}
                className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Receive Batch
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setIsAddingBatch(false)} disabled={isLoading}>
                Cancel
              </Button>            </div>
          </CardContent>
        )}
      </Card>

      {/* Batch List Card */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Recent Key Batches ({isLoading ? "..." : batches.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-electric-blue" />
              <span className="ml-2">Loading batches...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-40 text-red-500">
              <AlertCircle className="h-8 w-8 mb-2" />
              <span>Error loading batches: {error}</span>
              <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-4">
                Try Again
              </Button>
            </div>
          ) : batches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <Package className="h-8 w-8 mb-2" />
              <span>No key batches found.</span>
              <span>Why not add a new one?</span>
            </div>
          ) : (
            <>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gradient-to-r from-electric-purple/5 to-electric-blue/5">
                      <TableHead>Batch Info</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>SS Reference</TableHead>
                      <TableHead>Received Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentBatches.map((batch) => (
                      <TableRow key={batch.batchId} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="font-medium">{batch.ssReference}</div>
                          <div className="text-xs text-muted-foreground truncate max-w-[150px]" title={batch.batchInfo}>
                            {batch.batchInfo}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">{batch.quantity.toLocaleString()}</Badge> keys
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-muted-foreground">SS Ref:</div>
                          <div>{batch.ssReference}</div>
                        </TableCell>
                        <TableCell>
                          {new Date(batch.receivedDate).toLocaleDateString()} {/* Format date */}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(batch.status)}>
                            {getStatusIcon(batch.status)}
                            <span className="ml-1.5">{batch.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleStatusUpdate(batch.batchId, "Verified")}
                                disabled={batch.status === "Verified" || batch.status === "Distributed" || batch.status === "Partially Distributed"}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" /> Mark as Verified
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(batch.batchId, "Received")}
                                disabled={batch.status === "Received" || batch.status === "Verified" || batch.status === "Distributed" || batch.status === "Partially Distributed"}
                              >
                                <Download className="mr-2 h-4 w-4" /> Mark as Received
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => alert(`Viewing details for ${batch.batchId}`)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              {/* Add more actions like 'Distribute Batch' if applicable */}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                 <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-6"
                  />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
