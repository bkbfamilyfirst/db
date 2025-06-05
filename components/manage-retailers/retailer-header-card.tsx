import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export default function RetailerHeaderCard() {
    return (
        <Card className="overflow-hidden border-0 bg-gradient-to-r from-electric-purple via-electric-blue to-electric-cyan animate-gradient-shift">
            <CardContent className="p-6 text-white">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                            <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold"> Manage Retailers</h2>
                            <p className="mt-0 text-white/90 text-md"> Overview of your Retailers network</p>
                        </div>
                    </div>
                    {/* Optional button can go here */}
                </div>
            </CardContent>
        </Card>
    )
}
