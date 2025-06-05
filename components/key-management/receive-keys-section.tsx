"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Package, CheckCircle, Clock, AlertCircle, Plus } from "lucide-react"

interface KeyBatch {
  id: string
  batchNumber: string
  quantity: number
  receivedDate: string
  status: "pending" | "received" | "verified"
  ssReference: string
  notes?: string
}

const mockBatches: KeyBatch[] = [
  {
    id: "1",
    batchNumber: "SS-2024-001",
    quantity: 2500,
    receivedDate: "2024-01-15",
    status: "received",
    ssReference: "REF-SS-001",
    notes: "Standard batch delivery",
  },
  {
    id: "2",
    batchNumber: "SS-2024-002",
    quantity: 1800,
    receivedDate: "2024-01-20",
    status: "verified",
    ssReference: "REF-SS-002",
  },
  {
    id: "3",
    batchNumber: "SS-2024-003",
    quantity: 3200,
    receivedDate: "2024-01-25",
    status: "pending",
    ssReference: "REF-SS-003",
    notes: "Urgent delivery required",
  },
]

export function ReceiveKeysSection() {
  const [batches, setBatches] = useState<KeyBatch[]>(mockBatches)
  const [isAddingBatch, setIsAddingBatch] = useState(false)
  const [newBatch, setNewBatch] = useState({
    batchNumber: "",
    quantity: "",
    ssReference: "",
    notes: "",
  })

  const handleAddBatch = () => {
    if (!newBatch.batchNumber || !newBatch.quantity || !newBatch.ssReference) return

    const batch: KeyBatch = {
      id: Date.now().toString(),
      batchNumber: newBatch.batchNumber,
      quantity: Number.parseInt(newBatch.quantity),
      receivedDate: new Date().toISOString().split("T")[0],
      status: "pending",
      ssReference: newBatch.ssReference,
      notes: newBatch.notes || undefined,
    }

    setBatches([batch, ...batches])
    setNewBatch({ batchNumber: "", quantity: "", ssReference: "", notes: "" })
    setIsAddingBatch(false)
  }

  const handleStatusUpdate = (batchId: string, newStatus: KeyBatch["status"]) => {
    setBatches((prev) => prev.map((batch) => (batch.id === batchId ? { ...batch, status: newStatus } : batch)))
  }

  const getStatusIcon = (status: KeyBatch["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "received":
        return <Download className="h-4 w-4" />
      case "verified":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: KeyBatch["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gradient-to-r from-electric-orange to-electric-pink text-white"
      case "received":
        return "bg-gradient-to-r from-electric-blue to-electric-purple text-white"
      case "verified":
        return "bg-gradient-to-r from-electric-green to-electric-cyan text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-6">
      {/* Add New Batch */}
      <Card className="border-0 bg-gradient-to-br from-electric-green/5 to-electric-cyan/5">
        <CardHeader>
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
              <Plus className="h-4 w-4 mr-2" />
              New Batch
            </Button>
          </CardTitle>
        </CardHeader>
        {isAddingBatch && (
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  value={newBatch.batchNumber}
                  onChange={(e) => setNewBatch({ ...newBatch, batchNumber: e.target.value })}
                  placeholder="SS-2024-XXX"
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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ssReference">SS Reference</Label>
                <Input
                  id="ssReference"
                  value={newBatch.ssReference}
                  onChange={(e) => setNewBatch({ ...newBatch, ssReference: e.target.value })}
                  placeholder="REF-SS-XXX"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={newBatch.notes}
                  onChange={(e) => setNewBatch({ ...newBatch, notes: e.target.value })}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleAddBatch}
                className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white"
              >
                Add Batch
              </Button>
              <Button variant="outline" onClick={() => setIsAddingBatch(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Batch List */}
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
              <Package className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Recent Key Batches ({batches.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                {batches.map((batch) => (
                  <TableRow key={batch.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{batch.batchNumber}</div>
                        {batch.notes && <div className="text-sm text-muted-foreground">{batch.notes}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{batch.quantity.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">keys</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                        {batch.ssReference}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(batch.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(batch.status)}>
                        {getStatusIcon(batch.status)}
                        <span className="ml-1 capitalize">{batch.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {batch.status === "pending" && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(batch.id, "received")}>
                            Mark Received
                          </Button>
                        )}
                        {batch.status === "received" && (
                          <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(batch.id, "verified")}>
                            Verify
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
