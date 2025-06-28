"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "@/components/ui/pagination" // Corrected import
import { Send, Users, CheckCircle, Clock, Package, Plus, Loader2 } from "lucide-react"
import { 
  getDistributions, 
  createDistribution, 
  updateDistributionStatus, 
  getRetailers, // This now returns RetailerSelectionInfo[]
  Distribution, 
  RetailerSelectionInfo, // Use this type for the retailers dropdown
  CreateDistributionData, 
  handleApiError 
} from "@/lib/api"
import { useToast } from "@/hooks/use-toast" // For showing notifications

// Interface for Distribution is already in api.ts, no need to redefine

// Mock retailers are removed, will fetch from API

export function DistributeKeysSection() {
  const [distributions, setDistributions] = useState<Distribution[]>([])
  const [retailers, setRetailers] = useState<RetailerSelectionInfo[]>([]) // Changed type here
  const [isLoading, setIsLoading] = useState(true)
  const [isDistributingFormVisible, setIsDistributingFormVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Adjusted items per page
  const [newDistribution, setNewDistribution] = useState<Omit<CreateDistributionData, 'quantity'> & { quantity: string }>({
    retailerId: "",
    quantity: "",
    batchNumber: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [distData, retData] = await Promise.all([
          getDistributions(),
          getRetailers(), // retData is RetailerSelectionInfo[]
        ])
        setDistributions(distData.sort((a, b) => new Date(b.distributedDate).getTime() - new Date(a.distributedDate).getTime()))
        setRetailers(Array.isArray(retData) ? retData : []) // Ensure retData is an array
      } catch (error) {
        handleApiError(error)
        toast({
          title: "Error fetching data",
          description: "Could not load distributions or retailers.",
          variant: "destructive",
        })
        setRetailers([]) // Explicitly clear retailers on error
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [toast])

  // Calculate pagination
  const totalPages = Math.ceil(distributions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentDistributions = distributions.slice(startIndex, endIndex)

  const handleDistribute = async () => {
    if (!newDistribution.retailerId || !newDistribution.quantity || !newDistribution.batchNumber) {
      toast({ title: "Missing fields", description: "Please fill in all required fields.", variant: "destructive" })
      return
    }
    if (isNaN(parseInt(newDistribution.quantity)) || parseInt(newDistribution.quantity) <= 0) {
        toast({ title: "Invalid Quantity", description: "Quantity must be a positive number.", variant: "destructive" });
        return;
    }

    setIsSubmitting(true)
    try {
      const distributionData: CreateDistributionData = {
        ...newDistribution,
        quantity: parseInt(newDistribution.quantity),
      }
      const created = await createDistribution(distributionData)
      
      const retailer = retailers.find(r => r.id === created.retailerId); // Use .id from RetailerSelectionInfo
      const newDistWithDetails: Distribution = {
        ...created,
        retailerName: retailer?.name || 'N/A', 
        region: retailer?.region || 'N/A', // Use .region from RetailerSelectionInfo
      };

      setDistributions(prev => [newDistWithDetails, ...prev].sort((a, b) => new Date(b.distributedDate).getTime() - new Date(a.distributedDate).getTime()))
      setNewDistribution({ retailerId: "", quantity: "", batchNumber: "" })
      setIsDistributingFormVisible(false)
      setCurrentPage(1)
      toast({ title: "Success", description: "Keys distributed successfully." })
    } catch (error) {
      handleApiError(error)
      toast({ title: "Error", description: "Failed to distribute keys.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (distributionId: string, newStatus: Distribution["status"]) => {
    // Optimistic update
    const originalDistributions = [...distributions];
    setDistributions((prev) => prev.map((dist) => (dist.id === distributionId ? { ...dist, status: newStatus } : dist)))
    try {
      await updateDistributionStatus(distributionId, newStatus)
      toast({ title: "Status Updated", description: `Distribution status changed to ${newStatus}.` })
    } catch (error) {
      // Revert on error
      setDistributions(originalDistributions);
      handleApiError(error)
      toast({ title: "Error updating status", description: "Failed to update distribution status.", variant: "destructive" })
    }
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

  const getAvailableStatuses = (currentStatus: Distribution["status"]) => {
    const allStatuses = [
      { value: "pending", label: "Pending" },
      { value: "confirmed", label: "Confirmed" },
      { value: "sent", label: "Sent" },
      { value: "delivered", label: "Delivered" }
    ];

    // Always allow reset to pending
    const availableStatuses = [allStatuses[0]]; // pending

    switch (currentStatus) {
      case "pending":
        // From pending, can go to confirmed, sent, or delivered
        availableStatuses.push(allStatuses[1], allStatuses[2], allStatuses[3]);
        break;
      case "confirmed":
        // From confirmed, can go to sent or delivered
        availableStatuses.push(allStatuses[1], allStatuses[2], allStatuses[3]);
        break;
      case "sent":
        // From sent, can go to delivered
        availableStatuses.push(allStatuses[1], allStatuses[2], allStatuses[3]);
        break;
      case "delivered":
        // From delivered, can only reset to pending or stay delivered
        availableStatuses.push(allStatuses[3]);
        break;
    }

    return availableStatuses;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-electric-pink" />
        <p className="ml-2">Loading distributions...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Distribute Keys Form */}
      {/* <Card className="border-0 bg-gradient-to-br from-electric-orange/5 to-electric-pink/5">
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
              onClick={() => setIsDistributingFormVisible(!isDistributingFormVisible)}
              size="sm"
              className="bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isDistributingFormVisible ? "Cancel" : "New Distribution"}
            </Button>
          </CardTitle>
        </CardHeader>
        {isDistributingFormVisible && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="retailer">Select Retailer</Label>
                <Select
                  value={newDistribution.retailerId}
                  onValueChange={(value) => setNewDistribution({ ...newDistribution, retailerId: value })}
                  disabled={isSubmitting || isLoading} // Also disable if loading retailers
                >
                  <SelectTrigger id="retailer">
                    <SelectValue placeholder="Select a retailer" />
                  </SelectTrigger>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem value="loading-retailers" disabled>Loading retailers...</SelectItem>
                    ) : retailers.length === 0 ? (
                      <SelectItem value="no-retailers" disabled>No retailers found</SelectItem>
                    ) : (
                      retailers.map((retailer) => (
                        <SelectItem key={retailer.id} value={retailer.id}>
                          {retailer.name} ({retailer.region})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="e.g., 100"
                  value={newDistribution.quantity}
                  onChange={(e) => setNewDistribution({ ...newDistribution, quantity: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="e.g., BN-2024-001"
                  value={newDistribution.batchNumber}
                  onChange={(e) => setNewDistribution({ ...newDistribution, batchNumber: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button onClick={handleDistribute} disabled={isSubmitting} className="w-full md:w-auto bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Distribute Keys
            </Button>
          </CardContent>
        )}
      </Card> */}

      {/* Recent Distributions Table */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-purple">
              <Users className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
              Recent Distributions
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentDistributions.length === 0 && !isLoading ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No distributions found.</p>
          ) : (
            <Table>              
              <TableHeader>
                <TableRow>
                  <TableHead>Retailer</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Batch No.</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentDistributions.map((dist) => (
                  <TableRow key={dist.id}>
                    <TableCell className="font-medium">{dist.retailerName}</TableCell>
                    <TableCell>{dist.region}</TableCell>
                    <TableCell className="text-right">{dist.quantity.toLocaleString()}</TableCell>
                    <TableCell>{new Date(dist.distributedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{dist.batchNumber}</TableCell>                    <TableCell>
                      <Badge className={getStatusColor(dist.status)}>
                        {getStatusIcon(dist.status)}
                        <span className="ml-1.5">{dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {totalPages > 1 && (
            <Pagination
              className="mt-6"
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
