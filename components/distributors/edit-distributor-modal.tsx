"use client"

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
import { Textarea } from "@/components/ui/textarea"
import { Edit, Save, X } from "lucide-react"

interface Distributor {
    id: string
    name: string
    location: string
    contact: string
    email: string
    phone: string
    status: string
    keysAssigned: number
    keysActivated: number
    balance: number
    notes?: string
}

interface EditDistributorModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onEditDistributor: (distributor: Distributor) => void
    distributor: Distributor | null
}

export function EditDistributorModal({
    open,
    onOpenChange,
    onEditDistributor,
    distributor,
}: EditDistributorModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        location: "",
        contact: "",
        email: "",
        phone: "",
        status: "active",
        keysAssigned: "0",
        notes: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (distributor) {
            setFormData({
                name: distributor.name,
                location: distributor.location,
                contact: distributor.contact,
                email: distributor.email,
                phone: distributor.phone,
                status: distributor.status,
                keysAssigned: distributor.keysAssigned.toString(),
                notes: distributor.notes || "",
            })
        }
    }, [distributor])

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }))
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) newErrors.name = "Company name is required"
        if (!formData.location.trim()) newErrors.location = "Location is required"
        if (!formData.contact.trim()) newErrors.contact = "Contact person is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (isNaN(Number(formData.keysAssigned)) || Number(formData.keysAssigned) < 0) {
            newErrors.keysAssigned = "Keys assigned must be a valid number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (!validateForm() || !distributor) return

        const updatedDistributor: Distributor = {
            ...distributor,
            name: formData.name,
            location: formData.location,
            contact: formData.contact,
            email: formData.email,
            phone: formData.phone,
            status: formData.status,
            keysAssigned: Number(formData.keysAssigned),
            balance: Number(formData.keysAssigned) - distributor.keysActivated,
            notes: formData.notes,
        }

        onEditDistributor(updatedDistributor)
        handleClose()
    }

    const handleClose = () => {
        setErrors({})
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="rounded-full p-2 bg-gradient-to-r from-electric-blue to-electric-cyan">
                            <Edit className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-electric-blue to-electric-cyan bg-clip-text text-transparent">
                            Edit Distributor
                        </span>
                    </DialogTitle>
                    <DialogDescription>Update the details for {distributor?.name || "this distributor"}.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Company Information
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name" className="text-sm font-medium">
                                    Company Name *
                                </Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange("name", e.target.value)}
                                    className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 ${errors.name ? "border-red-500" : ""
                                        }`}
                                    placeholder="e.g., TechGuard Solutions"
                                />
                                {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-location" className="text-sm font-medium">
                                    Location *
                                </Label>
                                <Input
                                    id="edit-location"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                    className={`border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20 ${errors.location ? "border-red-500" : ""
                                        }`}
                                    placeholder="e.g., New York, USA"
                                />
                                {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Contact Information
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-contact" className="text-sm font-medium">
                                    Contact Person *
                                </Label>
                                <Input
                                    id="edit-contact"
                                    value={formData.contact}
                                    onChange={(e) => handleInputChange("contact", e.target.value)}
                                    className={`border-electric-green/30 focus:border-electric-green focus:ring-electric-green/20 ${errors.contact ? "border-red-500" : ""
                                        }`}
                                    placeholder="e.g., John Smith"
                                />
                                {errors.contact && <p className="text-xs text-red-500">{errors.contact}</p>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="edit-email" className="text-sm font-medium">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="edit-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        className={`border-electric-cyan/30 focus:border-electric-cyan focus:ring-electric-cyan/20 ${errors.email ? "border-red-500" : ""
                                            }`}
                                        placeholder="john@company.com"
                                    />
                                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-phone" className="text-sm font-medium">
                                        Phone Number *
                                    </Label>
                                    <Input
                                        id="edit-phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange("phone", e.target.value)}
                                        className={`border-electric-orange/30 focus:border-electric-orange focus:ring-electric-orange/20 ${errors.phone ? "border-red-500" : ""
                                            }`}
                                        placeholder="+1 (555) 123-4567"
                                    />
                                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Account Settings
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="edit-status" className="text-sm font-medium">
                                    Status
                                </Label>
                                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                                    <SelectTrigger id="edit-status" className="border-electric-pink/30">
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
                                <Label htmlFor="edit-keysAssigned" className="text-sm font-medium">
                                    Keys Assigned
                                </Label>
                                <Input
                                    id="edit-keysAssigned"
                                    type="number"
                                    min="0"
                                    value={formData.keysAssigned}
                                    onChange={(e) => handleInputChange("keysAssigned", e.target.value)}
                                    className={`border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 ${errors.keysAssigned ? "border-red-500" : ""
                                        }`}
                                    placeholder="0"
                                />
                                {errors.keysAssigned && <p className="text-xs text-red-500">{errors.keysAssigned}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-2">
                        <Label htmlFor="edit-notes" className="text-sm font-medium">
                            Additional Notes (Optional)
                        </Label>
                        <Textarea
                            id="edit-notes"
                            value={formData.notes}
                            onChange={(e) => handleInputChange("notes", e.target.value)}
                            className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20 resize-none"
                            rows={3}
                            placeholder="Any additional information about this distributor..."
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={handleClose} className="border-gray-300 text-gray-700 hover:bg-gray-50">
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="bg-gradient-to-r from-electric-blue to-electric-cyan hover:opacity-90 text-white"
                    >
                        <Save className="mr-2 h-4 w-4" />
                        Update Distributor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
