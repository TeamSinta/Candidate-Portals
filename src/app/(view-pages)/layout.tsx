// app/layouts/AppLayout.tsx

import React from "react";
import {
    Sidebar,
    SidebarProvider,
    SidebarTrigger,
    SidebarInset,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import Sintalogo from "../../../public/SintaLogoCircle.png";
import Image from "next/image";

type AppLayoutProps = {
    children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col bg-slate-100">
            <header className="flex h-16 items-center justify-between border-gray-200 px-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                        Sinta Candidate Portals - MVP
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1 rounded-md bg-slate-200 px-2 py-1 text-xs text-gray-700 hover:bg-gray-300">
                        Made with
                        <div className="flex items-center">
                            <Image
                                src={Sintalogo}
                                alt="Brand Logo"
                                className="mr-1 h-3 w-3"
                            />{" "}
                            {/* Replace with actual logo path */}
                            <span className="font-medium">Sinta</span>
                        </div>
                    </button>
                </div>
            </header>
            {children}
        </div>
    );
}
