"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, Shield, Bell, X, LogOut } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/auth/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const { user, logout } = useAuth()

  const handleMobileSearch = () => {
    setShowMobileSearch(!showMobileSearch)
    if (showMobileSearch) {
      setSearchQuery("")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <header className="header-responsive w-full border-b border-white/20 bg-white/80 backdrop-blur-md dark:bg-gray-900/80 safe-area-top">
        <div className="responsive-container">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3 sm:gap-6">              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md bg-gradient-to-r from-electric-purple to-electric-blue">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="hidden font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent sm:inline-block text-sm sm:text-base">
                  Distributor
                </span>
                <span className="font-bold bg-gradient-to-r from-electric-purple to-electric-blue bg-clip-text text-transparent sm:hidden text-sm">
                  FF Admin
                </span>
              </Link>

              {/* Desktop Search */}
              {/* <div className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-electric-purple" />
                <Input
                  type="search"
                  placeholder="Search distributors, reports..."
                  className="w-48 xl:w-64 pl-8 border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile Search */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="lg:hidden hover:bg-electric-purple/10 h-8 w-8 sm:h-10 sm:w-10"
                onClick={handleMobileSearch}
              >
                {showMobileSearch ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-electric-purple" />
                ) : (
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-electric-purple" />
                )}
                <span className="sr-only">Search</span>
              </Button> */}

              {/* Notifications */}
              {/* <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-electric-blue/10 h-8 w-8 sm:h-10 sm:w-10"
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-electric-blue" />
                <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-electric-orange text-white text-[10px] sm:text-xs p-0 flex items-center justify-center">
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button> */}

              {/* Theme Toggle */}
              <ModeToggle />              {/* Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-7 w-7 sm:h-8 sm:w-8 rounded-full">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-electric-purple/30">
                      <AvatarImage src="/placeholder-user.jpg" alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-gradient-to-r from-electric-pink to-electric-purple text-white text-xs sm:text-sm">
                        {user?.name ? getUserInitials(user.name) : 'DB'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 sm:w-56 z-[100]" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'Distributor'}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="text-sm">
                    <Link href="/profile">Distributor Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-sm text-red-600 focus:text-red-600" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      {showMobileSearch && (
        <div className="lg:hidden fixed top-14 sm:top-16 left-0 right-0 z-[60] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-white/20 p-4">
          <div className="responsive-container">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-electric-purple" />
              <Input
                type="search"
                placeholder="Search distributors, reports..."
                className="w-full pl-8 border-electric-purple/30 focus:border-electric-purple focus:ring-electric-purple/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
            {searchQuery && (
              <div className="mt-3 space-y-2">
                <div className="text-xs text-gray-500 dark:text-gray-400">Search Results:</div>
                <div className="space-y-1">
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-electric-purple">TechGuard Solutions</div>
                    <div className="text-xs text-gray-500">National Distributor - ND001</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <div className="text-sm font-medium text-electric-blue">Monthly Report - January</div>
                    <div className="text-xs text-gray-500">Generated on Jan 15, 2024</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
