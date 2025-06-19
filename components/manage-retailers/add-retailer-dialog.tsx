"use client"

import type React from "react"

import { useState } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserPlus, Store, Mail, Phone, MapPin, CheckCircle, Copy, Eye, EyeOff } from "lucide-react"
import { addRetailer, type AddRetailerData, type Retailer } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface AddRetailerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRetailerAdded?: () => void
}

export function AddRetailerDialog({ open, onOpenChange, onRetailerAdded }: AddRetailerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    assignedKeys: "0",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [newRetailer, setNewRetailer] = useState<Retailer | null>(null)
  const [defaultPassword, setDefaultPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const retailerData: AddRetailerData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location || undefined,
        assignedKeys: parseInt(formData.assignedKeys) || 0,
      }

      const response = await addRetailer(retailerData)
      
      // Store the new retailer data and password
      setNewRetailer(response.retailer)
      setDefaultPassword(response.defaultPassword || "")
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        location: "",
        assignedKeys: "0",
      })
      
      // Close add dialog and show success dialog
      onOpenChange(false)
      setShowSuccessDialog(true)
      
      // Trigger refresh of retailer list
      if (onRetailerAdded) {
        onRetailerAdded()
      }

      toast({
        title: "Success",
        description: "Retailer added successfully!",
      })
    } catch (error: any) {
      console.error("Error adding retailer:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add retailer. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied",
        description: "Password copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy password",
        variant: "destructive",
      })
    }
  }

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false)
    setNewRetailer(null)
    setDefaultPassword("")
    setShowPassword(false)
  }
  return (
    <>
      {/* Add Retailer Dialog */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-gradient-to-r from-electric-green to-electric-cyan">
                <UserPlus className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                Add New Retailer
              </span>
            </DialogTitle>
            <DialogDescription>Create a new retailer account and assign initial keys if needed.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Store Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter store name"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter location (optional)"
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignedKeys">Initial Keys (Optional)</Label>
                <Input
                  id="assignedKeys"
                  type="number"
                  min="0"
                  value={formData.assignedKeys}
                  onChange={(e) => handleInputChange("assignedKeys", e.target.value)}
                  placeholder="Number of keys to assign initially"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Retailer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={handleSuccessDialogClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="rounded-full p-2 bg-gradient-to-r from-green-500 to-emerald-500">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                Retailer Added Successfully
              </span>
            </DialogTitle>
            <DialogDescription>
              The new retailer account has been created. Please share the login credentials with the retailer.
            </DialogDescription>
          </DialogHeader>

          {newRetailer && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Store Name</Label>
                    <p className="text-sm font-semibold">{newRetailer.name}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <p className="text-sm">{newRetailer.email}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                    <p className="text-sm">{newRetailer.phone}</p>
                  </div>
                  
                  {newRetailer.location && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                      <p className="text-sm">{newRetailer.location}</p>
                    </div>
                  )}
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Assigned Keys</Label>
                    <p className="text-sm">{newRetailer.assignedKeys}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                    <p className="text-sm capitalize">{newRetailer.status}</p>
                  </div>
                </div>
              </div>

              {defaultPassword && (
                <div className="space-y-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Default Password
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={defaultPassword}
                      readOnly
                      className="font-mono text-sm bg-white dark:bg-gray-900"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="shrink-0"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(defaultPassword)}
                      className="shrink-0"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    Please share this password with the retailer. They should change it after their first login.
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              onClick={handleSuccessDialogClose}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}