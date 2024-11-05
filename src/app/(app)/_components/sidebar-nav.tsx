"use client";

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronRight, ExternalLinkIcon } from "lucide-react";
import { sidebarConfig } from "@/config/sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { usePathname } from "next/navigation";

type SidebarNavProps = {
    sidebarNavIncludeIds?: string[];
    sidebarNavRemoveIds?: string[];
};

export function SidebarNav({ sidebarNavIncludeIds, sidebarNavRemoveIds }: SidebarNavProps) {
    const pathname = usePathname();
    const sidebarNavItems = sidebarConfig.filteredNavItems({
        removeIds: sidebarNavRemoveIds,
        includedIds: sidebarNavIncludeIds,
    });

    return (
        <SidebarGroup>
            {sidebarNavItems.map((nav) => (
                <div key={nav.id} className="mb-4">
                    {nav.showLabel && (
                        <SidebarGroupLabel className="px-2">{nav.label}</SidebarGroupLabel>
                    )}
                    <SidebarMenu>
                        {nav.items.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                {item.subMenu ? (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value={item.label}>
                                            {/* Accordion Trigger to handle dropdown items */}
                                            <AccordionTrigger className="flex items-center gap-2 w-full">
                                                <item.icon className="h-5 w-5 flex-shrink-0" />
                                                <span className="flex-grow truncate">{item.label}</span>
                                                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200" />
                                            </AccordionTrigger>
                                            <AccordionContent className="pl-6">
                                                {item.subMenu.map((subItem) => (
                                                    <SidebarMenuItem key={subItem.label}>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <NavLink
                                                                    {...subItem}
                                                                    active={pathname === subItem.href}
                                                                />
                                                            </TooltipTrigger>
                                                            <TooltipContent side="right">
                                                                {subItem.label}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </SidebarMenuItem>
                                                ))}
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                ) : (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="w-full">
                                                <NavLink
                                                    {...item}
                                                    active={pathname === item.href}
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">
                                            {item.label}
                                        </TooltipContent>
                                    </Tooltip>
                                )}
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </div>
            ))}
        </SidebarGroup>
    );
}

type NavLinkProps = {
    href: string;
    label: string;
    icon: React.ComponentType<React.HTMLAttributes<SVGElement>>;
    active?: boolean;
};

function NavLink({ href, label, icon: Icon, active }: NavLinkProps) {
    return (
        <Link
            href={href}
            className={cn("flex items-center gap-3 px-2 py-2 rounded transition-colors", {
                "bg-border text-blue-600 font-semibold bg-blue-100": active,
                "hover:bg-blue-100": !active,
            })}
        >
            <Icon className="h-4 w-4 flex-shrink-0" />
            <span className="flex-grow truncate text-sm font-heading">{label}</span>
            {href.startsWith("http") && (
                <ExternalLinkIcon className="ml-2 h-4 w-4 text-muted-foreground" />
            )}
        </Link>
    );
}
