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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Store, Mail, Phone, MapPin } from "lucide-react"

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

interface EditRetailerDialogProps {
  retailer: Retailer | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (retailer: Retailer) => void
}

export function EditRetailerDialog({ retailer, open, onOpenChange, onUpdate }: EditRetailerDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
  })

  useEffect(() => {
    if (retailer) {
      setFormData({
        name: retailer.name,
        email: retailer.email,
        phone: retailer.phone,
        region: retailer.region,
      })
    }
  }, [retailer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!retailer) return

    const updatedRetailer: Retailer = {
      ...retailer,
      ...formData,
    }

    onUpdate(updatedRetailer)
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!retailer) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
              <Edit className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              Edit Retailer Details
            </span>
          </DialogTitle>
          <DialogDescription>Update retailer information and contact details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Store Name
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter store name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="edit-phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-region" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Region
              </Label>
              <Select value={formData.region} onValueChange={(value) => handleInputChange("region", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="North">North</SelectItem>
                  <SelectItem value="South">South</SelectItem>
                  <SelectItem value="East">East</SelectItem>
                  <SelectItem value="West">West</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-electric-orange to-electric-pink hover:from-electric-orange/80 hover:to-electric-pink/80 text-white"
            >
              Update Retailer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
