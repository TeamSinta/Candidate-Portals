"use client";

import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarGroup,
    SidebarGroupLabel,
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
                <div key={nav.id}>
                    {nav.showLabel && <SidebarGroupLabel>{nav.label}</SidebarGroupLabel>}
                    <SidebarMenu>
                        {nav.items.map((item) => (
                            <SidebarMenuItem key={item.label}>
                                {item.subMenu ? (
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value={item.label}>
                                            {/* Single arrow on dropdown to avoid double arrow issue */}
                                            <AccordionTrigger className="flex items-center gap-2">
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
                                            <NavLink {...item} active={pathname === item.href} />
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
                "bg-border text-black font-bold": active,
                "hover:bg-muted": !active,
            })}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            <span className="flex-grow truncate">{label}</span>
            {href.startsWith("http") && <ExternalLinkIcon className="ml-2 h-4 w-4 text-muted-foreground" />}
        </Link>
    );
}
