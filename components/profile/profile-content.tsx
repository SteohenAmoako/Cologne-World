"use client"

import { useState } from "react"
import { ProfileInfo } from "./profile-info"
import { OrderHistory } from "./order-history"
import { AccountSettings } from "./account-settings"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Package, Settings, ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { User as SupabaseUser } from "@supabase/supabase-js"

interface ProfileContentProps {
  user: SupabaseUser
  profile: any
  orders: any[]
}

export function ProfileContent({ user, profile, orders }: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState("profile")

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Order History", icon: Package },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center gap-2 mb-4 sm:mb-6">
        <Link href="/shop" className="text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="grid grid-cols-2 sm:block gap-2 sm:space-y-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    className={`w-full justify-start ${activeTab === tab.id ? "bg-rose-600 hover:bg-rose-700" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "profile" && <ProfileInfo user={user} profile={profile} />}
          {activeTab === "orders" && <OrderHistory orders={orders} />}
          {activeTab === "settings" && <AccountSettings user={user} />}
        </div>
      </div>
    </div>
  )
}
