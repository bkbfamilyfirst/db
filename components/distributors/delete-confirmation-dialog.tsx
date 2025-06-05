"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Trash2, X } from "lucide-react"

interface DeleteConfirmationDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    distributorName: string
}

export function DeleteConfirmationDialog({
    open,
    onOpenChange,
    onConfirm,
    distributorName,
}: DeleteConfirmationDialogProps) {
    const handleConfirm = () => {
        onConfirm()
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <div className="rounded-full p-2 bg-gradient-to-r from-electric-red to-electric-pink">
                            <AlertTriangle className="h-5 w-5 text-white" />
                        </div>
                        <span className="bg-gradient-to-r from-electric-red to-electric-pink bg-clip-text text-transparent">
                            Delete Distributor
                        </span>
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        Are you sure you want to delete <span className="font-semibold text-electric-red">{distributorName}</span>?
                        This action cannot be undone and will permanently remove all associated data.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-electric-red/10 to-electric-pink/10 border border-electric-red/20">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-electric-red mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-electric-red">Warning: This action is irreversible</p>
                                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                                    <li>• All distributor data will be permanently deleted</li>
                                    <li>• Associated key assignments will be removed</li>
                                    <li>• Historical reports may be affected</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        className="bg-gradient-to-r from-electric-red to-electric-pink hover:opacity-90 text-white"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Distributor
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
