"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { siteUrls } from "@/config/urls";
import { SignoutTrigger } from "@/components/signout-trigger";
import {
    LogOut,
    Sparkles,
    BadgeCheck,
    CreditCard,
    Bell,
    ChevronsUpDown,
} from "lucide-react";
import { Fragment } from "react";
import Link from "next/link";
import {
    type UserDropdownNavItems,
    userDropdownConfig,
} from "@/config/user-dropdown";
import { type User } from "next-auth";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { usersRoleEnum } from "@/server/db/schema";
import { z } from "zod";

/**
 * to @add more navigation items to the user dropdown, you can add more items to the `userDropdownConfig` object in the
 * @see /src/config/user-dropdown.ts file
 */

type UserDropdownProps = {
    user: User | null;
};

const userRoles = z.enum(usersRoleEnum.enumValues);

export function UserDropdown({ user }: UserDropdownProps) {
    const navItems =
        user?.role === userRoles.Values.Admin ||
        user?.role === userRoles.Values["Super Admin"]
            ? userDropdownConfig.navigation
            : userDropdownConfig.filterNavItems({
                  removeIds: [userDropdownConfig.navIds.admin],
              });

    return <UserDropdownContent user={user} navItems={navItems} />;
}

type UserDropdownContentProps = {
    user: User | null;
    navItems: UserDropdownNavItems[];
};

function UserDropdownContent({ user, navItems }: UserDropdownContentProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                    size="lg"
                    className="flex items-center gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    aria-label="user dropdown"
                >
                    <Avatar className="h-8 w-8 rounded-sm">
                        <AvatarImage src={user?.image ?? ""} />
                        <AvatarFallback className="rounded-sm">
                            {user?.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                            {user?.name ?? "Name not found"}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
            >
                {/* User Details */}
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-sm">
                            <AvatarImage src={user?.image ?? ""} />
                            <AvatarFallback className="rounded-sm">
                                {user?.email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                                {user?.name ?? "Name not found"}
                            </span>
                            <span className="truncate text-xs">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Upgrade Section */}
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Upgrade to Pro
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Account Settings */}
                <DropdownMenuGroup>
                    {navItems.map((group) => (
                        <Fragment key={group.id}>
                            <DropdownMenuLabel>{group.label}</DropdownMenuLabel>
                            {group.items.map((item) => (
                                <DropdownMenuItem key={item.label} asChild>
                                    <Link
                                        href={item.href}
                                        className="flex w-full cursor-pointer items-center gap-2"
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </Link>
                                </DropdownMenuItem>
                            ))}
                        </Fragment>
                    ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Logout Button */}
                <SignoutTrigger callbackUrl={siteUrls.home} asChild>
                    <DropdownMenuItem className="text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </DropdownMenuItem>
                </SignoutTrigger>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
