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
        <div>

            {children}
        </div>
    );
}
