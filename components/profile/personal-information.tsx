"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { User, Mail, Phone, MapPin, Save, Edit, AlertCircle } from "lucide-react"
import { getDbProfile, updateDbProfile, UpdateDbProfileData } from "../../lib/api"
import type { DbProfile } from "../../lib/api"
import { useToast } from "@/hooks/use-toast"

export function PersonalInformation() {
    const [isEditing, setIsEditing] = useState(false)
    const [profile, setProfile] = useState<DbProfile | null>(null)
    const [formData, setFormData] = useState<UpdateDbProfileData>({
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        bio: "",
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { toast } = useToast()

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true)
            setError(null)
            try {                const data = await getDbProfile()
                setProfile(data)
                setFormData({
                    firstName: data.personalInformation?.firstName || "",
                    lastName: data.personalInformation?.lastName || "",
                    phone: data.personalInformation?.phone || "",
                    address: data.personalInformation?.address || "",
                    bio: data.personalInformation?.bio || "",
                })
            } catch (err) {
                setError("Failed to load profile information.")
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load profile data.",
                })            
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleInputChange = (field: keyof UpdateDbProfileData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleSave = async () => {
        if (!profile) return
        setLoading(true)
        try {
            const response = await updateDbProfile(formData)
            
            // Update the profile with the returned data, keeping the existing structure
            const updatedProfile: DbProfile = {
                personalInformation: {
                    firstName: response.profile.firstName,
                    lastName: response.profile.lastName,
                    email: response.profile.email,
                    phone: response.profile.phone,
                    address: response.profile.address,
                    bio: response.profile.bio,
                },
                profileStats: profile.profileStats // Keep existing stats
            }
            
            setProfile(updatedProfile)
            setIsEditing(false)
            toast({
                title: "Success",
                description: "Profile updated successfully.",
            })

            // Force page refresh to update all components with new data
            setTimeout(() => {
                window.location.reload()
            }, 1000)
        } catch (err) {
            setError("Failed to save profile information.")
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save profile data.",
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading && !profile) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-40">
                    Loading profile...
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-center items-center h-40 text-red-500">
                    <AlertCircle className="h-8 w-8 mb-2" />
                    {error}
                </CardContent>
            </Card>
        )
    }

    if (!profile) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center h-40">
                    No profile data found.
                </CardContent>
            </Card>
        )
    }    // Use the new nested structure
    const displayFirstName = profile.personalInformation?.firstName || "";
    const displayLastName = profile.personalInformation?.lastName || "";
    const displayEmail = profile.personalInformation?.email || "";
    const displayPhone = profile.personalInformation?.phone || "";
    const displayAddress = profile.personalInformation?.address || "";
    const displayBio = profile.personalInformation?.bio || "";

    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="rounded-full p-2 bg-gradient-to-r from-electric-purple to-electric-blue">
                        <User className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent">
                        Personal Information
                    </span>
                </CardTitle>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-electric-purple/30 text-electric-purple hover:bg-electric-purple/10"
                >
                    <Edit className="mr-2 h-4 w-4" />
                    {isEditing ? "Cancel" : "Edit"}
                </Button>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name
                        </Label>                        <Input
                            id="firstName"
                            value={isEditing ? formData.firstName || "" : displayFirstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            disabled={!isEditing}
                            className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                        </Label>                        <Input
                            id="lastName"
                            value={isEditing ? formData.lastName || "" : displayLastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            disabled={!isEditing}
                            className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                        />
                    </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                            <Mail className="h-4 w-4 text-electric-blue" />
                            Email Address
                        </Label>                        <Input
                            id="email"
                            type="email"
                            value={displayEmail}
                            disabled // Always disabled
                            className="border-electric-blue/30 focus:border-electric-blue focus:ring-electric-blue/20 bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                            <Phone className="h-4 w-4 text-electric-green" />
                            Phone Number
                        </Label>                        <Input
                            id="phone"
                            value={isEditing ? formData.phone || "" : displayPhone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            disabled={!isEditing}
                            className="border-electric-green/30 focus:border-electric-green focus:ring-electric-green/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-electric-orange" />
                            Location / Address
                        </Label>                        <Textarea
                            id="address"
                            value={isEditing ? formData.address || "" : displayAddress}
                            onChange={(e) => handleInputChange("address", e.target.value)}
                            disabled={!isEditing}
                            rows={3}
                            className="border-electric-pink/30 focus:border-electric-pink focus:ring-electric-pink/20 resize-none"
                        />
                    </div>
                </div>                {/* Bio Field */}
                <div className="space-y-2">
                    <Label htmlFor="bio" className="text-sm font-medium">
                        Bio
                    </Label>
                    <Textarea
                        id="bio"
                        value={isEditing ? formData.bio || "" : displayBio}
                        onChange={(e) => handleInputChange("bio", e.target.value)}
                        disabled={!isEditing}
                        rows={3}
                        placeholder="Tell us a bit about yourself..."
                        className="border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 resize-none"
                    />
                </div>

                {isEditing && (
                    <div className="flex justify-end pt-4">
                        <Button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-gradient-to-r from-electric-green to-electric-cyan text-white"
                        >
                            <Save className="mr-2 h-4 w-4" />
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
