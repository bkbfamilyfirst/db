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
import { UserPlus, Store, Mail, Phone, MapPin } from "lucide-react"

interface AddRetailerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddRetailerDialog({ open, onOpenChange }: AddRetailerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    initialKeys: "0",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Adding retailer:", formData)

    // Reset form and close dialog
    setFormData({
      name: "",
      email: "",
      phone: "",
      region: "",
      initialKeys: "0",
    })
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
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
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Region
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="north">North</SelectItem>
                  <SelectItem value="south">South</SelectItem>
                  <SelectItem value="east">East</SelectItem>
                  <SelectItem value="west">West</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialKeys">Initial Keys (Optional)</Label>
              <Input
                id="initialKeys"
                type="number"
                min="0"
                value={formData.initialKeys}
                onChange={(e) => handleInputChange("initialKeys", e.target.value)}
                placeholder="Number of keys to assign initially"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-electric-green to-electric-cyan hover:from-electric-green/80 hover:to-electric-cyan/80 text-white"
            >
              Add Retailer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
