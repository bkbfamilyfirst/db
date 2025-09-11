"use client"

import type React from "react"
import { Loader2 } from "lucide-react"
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
  onOpenChangeAction: (open: boolean) => void
  onRetailerAdded?: () => void
}

export function AddRetailerDialog({ open, onOpenChangeAction, onRetailerAdded }: AddRetailerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    status: "active",
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

    // Client-side validation
    if (!formData.name.trim() || !formData.username.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.address.trim() || !formData.password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide name, username, email, phone, address, and password.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    const retailerData: AddRetailerData = {
      name: formData.name,
      username: formData.username,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      password: formData.password,
      status: formData.status as 'active' | 'inactive' | 'blocked',
      assignedKeys: parseInt(formData.assignedKeys) || 0,
    }

    try {
      const response = await addRetailer(retailerData)
      
      // Store the new retailer data and password
      setNewRetailer(response.retailer)
      setDefaultPassword(response.password || "")
        // Reset form
      setFormData({
        name: "",
        username: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        status: "active",
        assignedKeys: "0",
      })
      
      // Close add dialog and show success dialog
      onOpenChangeAction(false)
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
      <Dialog open={open} onOpenChange={onOpenChangeAction}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label htmlFor="username" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter username"
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
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter location/address"
                  required
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password"
                    required
                    disabled={isSubmitting}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="blocked">Blocked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignedKeys">Initial Keys (Optional)</Label>
                <Input
                  id="assignedKeys"
                  type="number"
                  placeholder="e.g., 100"
                  value={formData.assignedKeys}
                  onChange={(e) => handleInputChange("assignedKeys", e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-medium"
              disabled={isSubmitting || !formData.name || !formData.username || !formData.email || !formData.phone || !formData.address || !formData.password}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding Retailer...
                </>
              ) : (
                'Add Retailer'
              )}
            </Button>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Store Name</Label>
                    <p className="text-sm font-semibold">{newRetailer.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                    <p className="text-sm">{newRetailer.username}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                    <p className="text-sm">{newRetailer.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                    <p className="text-sm">{newRetailer.phone}</p>
                  </div>
                  
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Password</Label>
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
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-row gap-4 w-full mt-2">
                <Button
                  type="button"
                  variant="default"
                  className="flex-1"
                  onClick={() => {
                    const creds = `Store Name: ${newRetailer.name}\nUsername: ${newRetailer.username}\nEmail: ${newRetailer.email}\nPhone: ${newRetailer.phone}\nAddress: ${newRetailer.address || ''}\nAssigned Keys: ${newRetailer.assignedKeys}\nStatus: ${newRetailer.status}\nPassword: ${defaultPassword}`;
                    copyToClipboard(creds);
                    toast({ title: "Copied", description: "All credentials copied to clipboard." });
                  }}
                >
                  Copy All Credentials
                </Button>
                <Button 
                  type="button"
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  onClick={handleSuccessDialogClose}
                >
                  Close
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            {/* Buttons moved above for side-by-side layout */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}