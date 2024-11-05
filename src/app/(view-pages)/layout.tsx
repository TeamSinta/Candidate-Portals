// app/layouts/AppLayout.tsx

import React from "react"
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import Sintalogo from "../../../public/SintaLogoCircle.png";
import Image from "next/image"

type AppLayoutProps = {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
       <header className="flex h-16 items-center justify-between px-4 border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">Sinta Candidate Portals - MVP</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-slate-200 rounded-md hover:bg-gray-300 gap-1">
            Made with
            <div className="flex items-center">
            <Image src={Sintalogo} alt="Brand Logo" className="h-3 w-3 mr-1" /> {/* Replace with actual logo path */}
            <span className="font-medium">Sinta</span>
            </div>
          </button>
        </div>
      </header>
      {children}
    </div>
  )
}
