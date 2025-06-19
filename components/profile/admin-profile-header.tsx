'use client'
import { Card, CardContent } from "@/components/ui/card"
import { User, Shield, AlertCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getDbProfile, DbProfile } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export function AdminProfileHeader() {
    const [profile, setProfile] = useState<DbProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getDbProfile()
                setProfile(data)
            } catch (err) {
                setError("Failed to load profile data.")
                console.error(err)
            }
            setLoading(false)
        }
        fetchProfile()
    }, [])

    if (loading) {
        return (
            <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-purple via-electric-blue to-electric-cyan animate-gradient-shift">
                <CardContent className="p-6 text-white">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full bg-white/20" />
                            <div>
                                <Skeleton className="h-7 w-48 bg-white/20" />
                                <Skeleton className="h-4 w-64 mt-2 bg-white/20" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card className="overflow-hidden border-0 bg-red-500">
                <CardContent className="p-6 text-white">
                    <div className="flex items-center gap-4">
                        <AlertCircle className="h-8 w-8 text-white" />
                        <div>
                            <h2 className="text-2xl font-bold">Error</h2>
                            <p className="mt-1 text-white/90">{error}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (!profile) {
        return (
            <Card className="overflow-hidden border-0 bg-gray-500">
                <CardContent className="p-6 text-white">
                    <div className="flex items-center gap-4">
                        <User className="h-8 w-8 text-white" />
                        <div>
                            <h2 className="text-2xl font-bold">Profile Not Loaded</h2>
                            <p className="mt-1 text-white/90">Profile data could not be retrieved.</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-purple via-electric-blue to-electric-cyan animate-gradient-shift">
            <CardContent className="p-6 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <User className="h-6 w-6 text-white" />
                        </div>                        
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-2xl font-bold">
                                    {profile.personalInformation?.firstName 
                                        ? `${profile.personalInformation.firstName}'s Profile` 
                                        : "Distributor Profile"}
                                </h2>
                                <Shield className="h-5 w-5 text-electric-yellow" />
                            </div>
                            <p className="mt-1 text-white/90">Manage your Distributor account and settings</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
