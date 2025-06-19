'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Calendar, Clock, Users, Key, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { getDbProfile, DbProfile } from "@/lib/api"; // Assuming getDbProfile and DbProfile are in lib/api
import { Skeleton } from "@/components/ui/skeleton";

export function AdminCard() {
    const [profile, setProfile] = useState<DbProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getDbProfile();
                setProfile(data);
            } catch (err) {
                setError("Failed to load profile data.");
                console.error(err);
            }
            setLoading(false);
        }
        fetchProfile();
    }, []);

    if (loading) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
                <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">
                        <Skeleton className="h-24 w-24 rounded-full" />
                    </div>
                    <Skeleton className="h-6 w-32 mx-auto" />
                    <Skeleton className="h-4 w-40 mx-auto mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-20" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <Skeleton className="h-5 w-24 mb-3" />
                        <div className="grid grid-cols-2 gap-3">
                            {[...Array(2)].map((_, i) => (
                                <div key={i} className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                                    <Skeleton className="h-5 w-5 mx-auto mb-1" />
                                    <Skeleton className="h-6 w-10 mx-auto" />
                                    <Skeleton className="h-3 w-16 mx-auto mt-1" />
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
                <CardHeader className="text-center pb-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <CardTitle className="text-xl font-bold mt-2">Error</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-red-500">{error}</p>
                </CardContent>
            </Card>
        );
    }

    if (!profile) {
        return (
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
                <CardHeader className="text-center pb-4">
                    <CardTitle className="text-xl font-bold">No Profile Data</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p>Profile information could not be loaded.</p>
                </CardContent>
            </Card>
        );
    }    const initials = profile.personalInformation?.firstName && profile.personalInformation?.lastName 
        ? `${profile.personalInformation.firstName[0]}${profile.personalInformation.lastName[0]}`.toUpperCase() 
        : "DB";
    const joinedDate = profile.profileStats?.joined 
        ? new Date(profile.profileStats.joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) 
        : 'N/A';
    const fullName = profile.personalInformation?.firstName && profile.personalInformation?.lastName
        ? `${profile.personalInformation.firstName} ${profile.personalInformation.lastName}`
        : "Distributor";

    return (
        <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-md sticky top-4">
            <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">                    <div className="relative">
                        <Avatar className="h-24 w-24 ring-4 ring-electric-purple/30">
                            <AvatarImage src="/placeholder-user.jpg" alt={fullName} />
                            <AvatarFallback className="bg-gradient-to-r from-electric-purple to-electric-blue text-white text-2xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-electric-green to-electric-cyan rounded-full p-2">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                    </div>
                </div>                <CardTitle className="text-xl font-bold">{fullName}</CardTitle>
                <Badge className="bg-gradient-to-r from-electric-purple to-electric-blue text-white mx-auto">
                    Distributor
                </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-purple/10 to-electric-blue/10">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-electric-purple" />
                            <span className="text-sm font-medium">Joined</span>
                        </div>
                        <span className="text-sm font-bold text-electric-purple">{joinedDate}</span>
                    </div>                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-electric-green" />
                            <span className="text-sm font-medium">Email</span>
                        </div>
                        <span className="text-sm font-bold text-electric-green">{profile.personalInformation?.email || 'N/A'}</span>
                    </div>
                </div>

                {/* Quick Stats - These would ideally come from another API or be aggregated if not in DbProfile */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">Quick Stats</h4>
                    <div className="grid grid-cols-2 gap-3">                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                            <Users className="h-5 w-5 text-electric-blue mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-blue to-electric-purple bg-clip-text text-transparent">
                                {profile.profileStats?.quickStats?.retailers || 0}
                            </div>
                            <div className="text-xs text-gray-500">Retailers</div>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-gradient-to-r from-electric-green/10 to-electric-cyan/10">
                            <Key className="h-5 w-5 text-electric-green mx-auto mb-1" />
                            <div className="text-lg font-bold bg-gradient-to-r from-electric-green to-electric-cyan bg-clip-text text-transparent">
                                {profile.profileStats?.quickStats?.keysManaged || 0}
                            </div>
                            <div className="text-xs text-gray-500">Keys Managed</div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
