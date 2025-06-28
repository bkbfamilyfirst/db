"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Key, Package, AlertCircle } from "lucide-react"
import { transferKeysToRetailer, type TransferKeysData } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Retailer {
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

interface AssignKeysDialogProps {
  retailer: Retailer | null
  open: boolean
  onOpenChangeAction: (open: boolean) => void
  onAssignAction: (retailerId: string, keyCount: number) => void
}

export function AssignKeysDialog({ retailer, open, onOpenChangeAction, onAssignAction }: AssignKeysDialogProps) {
  const [keyCount, setKeyCount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Clear form and error when dialog opens/closes
  useEffect(() => {
    if (!open) {
      setKeyCount("")
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!retailer || !keyCount) return

    const keysToTransfer = Number.parseInt(keyCount)
    if (isNaN(keysToTransfer) || keysToTransfer <= 0) {
      setError("Please enter a valid number of keys")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const transferData: TransferKeysData = {
        retailerId: retailer.id,
        keysToTransfer: keysToTransfer,
        notes: `Keys assigned to ${retailer.name}`,
      }

      const response = await transferKeysToRetailer(transferData)
        // Success - update the UI and close dialog
      onAssignAction(retailer.id, keysToTransfer)
      setKeyCount("")
      
      toast({
        title: "Success",
        description: `Successfully assigned ${keysToTransfer} keys to ${retailer.name}`,
      })
      
      onOpenChangeAction(false)
    } catch (error: any) {
      console.error('Error assigning keys:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to assign keys'
      setError(errorMessage)
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!retailer) return null

  const availableKeys = 5000 // This would come from your API
  const requestedKeys = Number.parseInt(keyCount) || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
              <Key className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
              Assign Keys
            </span>
          </DialogTitle>
          <DialogDescription>Assign additional keys to {retailer.name}</DialogDescription>
        </DialogHeader>

        {/* Retailer Info */}
        <div className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{retailer.name}</span>
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
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Currently Assigned:</span>
              <div className="font-medium">{retailer.keysAssigned} keys</div>
            </div>
            <div>
              <span className="text-muted-foreground">Activations:</span>
              <div className="font-medium text-electric-green">{retailer.activations}</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyCount" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Number of Keys to Assign
            </Label>            <Input
              id="keyCount"
              type="number"
              min="1"
              max={availableKeys}
              value={keyCount}
              onChange={(e) => {
                setKeyCount(e.target.value)
                setError(null) // Clear error when user starts typing
              }}
              placeholder="Enter number of keys"
              required
              disabled={isLoading}
            />
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Available in inventory: {availableKeys.toLocaleString()}</span>
              {requestedKeys > availableKeys && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>Insufficient inventory</span>
                </div>
              )}
            </div>
          </div>

          {requestedKeys > 0 && (
            <div className="p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
              <div className="text-sm font-medium mb-1">Assignment Summary:</div>
              <div className="text-sm text-muted-foreground">
                {retailer.name} will have {retailer.keysAssigned + requestedKeys} total keys after assignment
              </div>
            </div>          )}

          {/* Error Display */}
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            </div>
          )}

          <DialogFooter>            <Button type="button" variant="outline" onClick={() => onOpenChangeAction(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!keyCount || requestedKeys > availableKeys || isLoading}
              className="bg-gradient-to-r from-electric-purple to-electric-blue hover:from-electric-purple/80 hover:to-electric-blue/80 text-white"
            >
              {isLoading ? "Assigning..." : "Assign Keys"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
