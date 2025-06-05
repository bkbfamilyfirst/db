"use client"

import { useState } from "react"
import { DistributorsHeader } from "@/components/distributors/distributors-header"
import { DistributorsTable } from "@/components/distributors/distributors-table"
import { DistributorsStats } from "@/components/distributors/distributors-stats"
import { KeyAssignmentCard } from "@/components/distributors/key-assignment-card"
import { AddDistributorModal } from "@/components/distributors/add-distributor-modal"
import { EditDistributorModal } from "@/components/distributors/edit-distributor-modal"
import { DeleteConfirmationDialog } from "@/components/distributors/delete-confirmation-dialog"

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

// Initial sample data with more distributors for pagination testing
const initialDistributors: Distributor[] = [
  {
    id: "ND001",
    name: "TechGuard Solutions",
    location: "New York, USA",
    contact: "John Smith",
    email: "john@techguard.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    keysAssigned: 2500,
    keysActivated: 2100,
    balance: 400,
  },
  {
    id: "ND002",
    name: "SecureFamily Networks",
    location: "London, UK",
    contact: "Emma Johnson",
    email: "emma@securefamily.com",
    phone: "+44 20 1234 5678",
    status: "active",
    keysAssigned: 1800,
    keysActivated: 1650,
    balance: 150,
  },
  {
    id: "ND003",
    name: "KidSafe Technologies",
    location: "Sydney, Australia",
    contact: "Michael Wong",
    email: "michael@kidsafe.com",
    phone: "+61 2 9876 5432",
    status: "inactive",
    keysAssigned: 1200,
    keysActivated: 950,
    balance: 250,
  },
  {
    id: "ND004",
    name: "ParentControl Systems",
    location: "Toronto, Canada",
    contact: "Sarah Miller",
    email: "sarah@parentcontrol.com",
    phone: "+1 (416) 987-6543",
    status: "active",
    keysAssigned: 3000,
    keysActivated: 2750,
    balance: 250,
  },
  {
    id: "ND005",
    name: "FamilyShield Inc.",
    location: "Berlin, Germany",
    contact: "Hans Schmidt",
    email: "hans@familyshield.com",
    phone: "+49 30 1234 5678",
    status: "blocked",
    keysAssigned: 1500,
    keysActivated: 1200,
    balance: 300,
  },
  {
    id: "ND006",
    name: "SafeKids Digital",
    location: "Tokyo, Japan",
    contact: "Yuki Tanaka",
    email: "yuki@safekids.jp",
    phone: "+81 3 1234 5678",
    status: "active",
    keysAssigned: 2200,
    keysActivated: 1800,
    balance: 400,
  },
  {
    id: "ND007",
    name: "Guardian Tech Solutions",
    location: "Mumbai, India",
    contact: "Raj Patel",
    email: "raj@guardiantech.in",
    phone: "+91 22 1234 5678",
    status: "active",
    keysAssigned: 1600,
    keysActivated: 1400,
    balance: 200,
  },
  {
    id: "ND008",
    name: "ProtectFamily Corp",
    location: "São Paulo, Brazil",
    contact: "Maria Silva",
    email: "maria@protectfamily.br",
    phone: "+55 11 1234 5678",
    status: "inactive",
    keysAssigned: 1000,
    keysActivated: 750,
    balance: 250,
  },
]

export default function DistributorsPage() {
  const [distributors, setDistributors] = useState<Distributor[]>(initialDistributors)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null)

  const handleAddDistributor = (newDistributor: Distributor) => {
    setDistributors((prev) => [...prev, newDistributor])
  }

  const handleEditDistributor = (updatedDistributor: Distributor) => {
    setDistributors((prev) =>
      prev.map((distributor) => (distributor.id === updatedDistributor.id ? updatedDistributor : distributor)),
    )
    setSelectedDistributor(null)
  }

  const handleDeleteDistributor = () => {
    if (selectedDistributor) {
      setDistributors((prev) => prev.filter((distributor) => distributor.id !== selectedDistributor.id))
      setSelectedDistributor(null)
    }
  }

  const handleStatusChange = (distributorId: string, newStatus: string) => {
    setDistributors((prev) =>
      prev.map((distributor) =>
        distributor.id === distributorId ? { ...distributor, status: newStatus } : distributor,
      ),
    )
  }

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (distributor: Distributor) => {
    setSelectedDistributor(distributor)
    setIsEditModalOpen(true)
  }

  const handleOpenDeleteDialog = (distributor: Distributor) => {
    setSelectedDistributor(distributor)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <DistributorsHeader onAddDistributor={handleOpenAddModal} />

      {/* Stats Overview */}
      <div className="mt-8">
        <DistributorsStats />
      </div>

      {/* Main Content */}
      <div className="mt-8 grid gap-6 grid-cols-1 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <DistributorsTable
            distributors={distributors}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenDeleteDialog}
            onStatusChange={handleStatusChange}
          />
        </div>
        <div className="xl:col-span-1">
          <KeyAssignmentCard />
        </div>
      </div>

      {/* Modals and Dialogs */}
      <AddDistributorModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddDistributor={handleAddDistributor}
      />

      <EditDistributorModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onEditDistributor={handleEditDistributor}
        distributor={selectedDistributor}
      />

      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteDistributor}
        distributorName={selectedDistributor?.name || ""}
      />
    </div>
  )
}
