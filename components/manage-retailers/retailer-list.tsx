"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Key, Shield, ShieldOff, Trash2, Store, Phone, Mail } from "lucide-react"
import { EditRetailerDialog } from "./edit-retailer-dialog"
import { AssignKeysDialog } from "./assign-keys-dialog"

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

const mockRetailers: Retailer[] = [
  {
    id: "1",
    name: "Tech Store Mumbai",
    email: "contact@techstore.com",
    phone: "+91 98765 43210",
    region: "West",
    status: "active",
    keysAssigned: 500,
    activations: 487,
    joinDate: "2024-01-15",
  },
  {
    id: "2",
    name: "Digital Hub Delhi",
    email: "info@digitalhub.com",
    phone: "+91 87654 32109",
    region: "North",
    status: "active",
    keysAssigned: 750,
    activations: 623,
    joinDate: "2024-02-20",
  },
  {
    id: "3",
    name: "Cyber Solutions Chennai",
    email: "sales@cybersolutions.com",
    phone: "+91 76543 21098",
    region: "South",
    status: "blocked",
    keysAssigned: 300,
    activations: 156,
    joinDate: "2024-03-10",
  },
  {
    id: "4",
    name: "Smart Electronics Kolkata",
    email: "hello@smartelectronics.com",
    phone: "+91 65432 10987",
    region: "East",
    status: "active",
    keysAssigned: 425,
    activations: 398,
    joinDate: "2024-01-28",
  },
]

interface RetailerListProps {
  searchTerm: string
  filterStatus: string
}

export function RetailerList({ searchTerm, filterStatus }: RetailerListProps) {
  const [retailers, setRetailers] = useState<Retailer[]>(mockRetailers)
  const [editingRetailer, setEditingRetailer] = useState<Retailer | null>(null)
  const [assigningKeysRetailer, setAssigningKeysRetailer] = useState<Retailer | null>(null)

  const filteredRetailers = retailers.filter((retailer) => {
    const matchesSearch =
      retailer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      retailer.region.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFilter = filterStatus === "all" || retailer.status === filterStatus

    return matchesSearch && matchesFilter
  })

  const handleStatusToggle = (retailerId: string) => {
    setRetailers((prev) =>
      prev.map((retailer) =>
        retailer.id === retailerId
          ? { ...retailer, status: retailer.status === "active" ? "blocked" : "active" }
          : retailer,
      ),
    )
  }

  const handleDeleteRetailer = (retailerId: string) => {
    setRetailers((prev) => prev.filter((retailer) => retailer.id !== retailerId))
  }

  const handleUpdateRetailer = (updatedRetailer: Retailer) => {
    setRetailers((prev) => prev.map((retailer) => (retailer.id === updatedRetailer.id ? updatedRetailer : retailer)))
  }

  const handleAssignKeys = (retailerId: string, keyCount: number) => {
    setRetailers((prev) =>
      prev.map((retailer) =>
        retailer.id === retailerId ? { ...retailer, keysAssigned: retailer.keysAssigned + keyCount } : retailer,
      ),
    )
  }

  return (
    <>
      <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-full p-2 bg-gradient-to-r from-electric-orange to-electric-pink">
              <Store className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-electric-orange to-electric-pink bg-clip-text text-transparent">
              Retailer Directory ({filteredRetailers.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-electric-purple/5 to-electric-blue/5">
                  <TableHead>Retailer Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Keys</TableHead>
                  <TableHead>Activations</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRetailers.map((retailer) => (
                  <TableRow key={retailer.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <div className="font-medium">{retailer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Joined: {new Date(retailer.joinDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-3 w-3" />
                          {retailer.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-3 w-3" />
                          {retailer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-gradient-to-r from-electric-blue/10 to-electric-purple/10">
                        {retailer.region}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{retailer.keysAssigned}</div>
                        <div className="text-xs text-muted-foreground">assigned</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium text-electric-green">{retailer.activations}</div>
                        <div className="text-xs text-muted-foreground">
                          {((retailer.activations / retailer.keysAssigned) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingRetailer(retailer)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setAssigningKeysRetailer(retailer)}>
                            <Key className="h-4 w-4 mr-2" />
                            Assign Keys
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusToggle(retailer.id)}>
                            {retailer.status === "active" ? (
                              <>
                                <ShieldOff className="h-4 w-4 mr-2" />
                                Block Retailer
                              </>
                            ) : (
                              <>
                                <Shield className="h-4 w-4 mr-2" />
                                Unblock Retailer
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteRetailer(retailer.id)} className="text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Retailer Dialog */}
      <EditRetailerDialog
        retailer={editingRetailer}
        open={!!editingRetailer}
        onOpenChange={(open) => !open && setEditingRetailer(null)}
        onUpdate={handleUpdateRetailer}
      />

      {/* Assign Keys Dialog */}
      <AssignKeysDialog
        retailer={assigningKeysRetailer}
        open={!!assigningKeysRetailer}
        onOpenChange={(open) => !open && setAssigningKeysRetailer(null)}
        onAssign={handleAssignKeys}
      />
    </>
  )
}
