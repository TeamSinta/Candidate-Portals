"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, setOrgCookie } from "@/lib/utils";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Fragment, useState } from "react";
import { CreateOrgForm } from "@/app/(app)/_components/create-org-form";
import { type organizations } from "@/server/db/schema";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";
import { useRouter } from "next/navigation";
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandSeparator,
} from "@/components/ui/command";
import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { switchOrgPendingState } from "./org-switch-loading";
import { ChevronsUpDown, GalleryVerticalEnd, SquareTerminalIcon } from "lucide-react";

export type UserOrgs = {
    heading: string;
    items: (typeof organizations.$inferSelect)[];
};

type OrgSelectDropdownProps = {
    currentOrg: typeof organizations.$inferSelect;
    userOrgs: UserOrgs[];
};

export function OrgSelectDropdown({
    currentOrg,
    userOrgs,
}: OrgSelectDropdownProps) {
    const router = useRouter();
    const { setIsPending } = switchOrgPendingState();
    const [, startAwaitableTransition] = useAwaitableTransition();
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const onOrgChange = async (orgId: string) => {
        setIsPending(true);
        setOrgCookie(orgId);
        await startAwaitableTransition(() => {
            router.refresh();
        });
        setIsPending(false);
    };

    const filteredOrgs = userOrgs.map((group) => ({
        ...group,
        items: group.items.filter((org) =>
            org.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
    }));

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <CreateOrgForm open={modalOpen} setOpen={setModalOpen} />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground flex items-center gap-2"
                        >
                      <Avatar className="h-8 w-8 rounded-sm">
    {currentOrg?.image ? (
        <AvatarImage src={currentOrg.image} />
    ) : (
        <AvatarFallback>
            <div className="flex aspect-square size-8 items-center justify-center rounded-sm bg-sidebar-primary text-sidebar-primary-foreground">
                {/* Default fallback icon or text */}
                <GalleryVerticalEnd className="size-4" />
                           </div>
        </AvatarFallback>
    )}
</Avatar>

                            <div className="grid flex-1 text-left text-md leading-tight">
                                <span className="truncate text-lg font-semibold">{currentOrg?.name}</span>
                                <span className="truncate text-xs">{currentOrg?.plan}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side="bottom"
                        sideOffset={4}
                    >
                        <Command>
                            <CommandInput
                                placeholder="Search team..."
                                onValueChange={setSearchTerm}
                                value={searchTerm}
                            />
                            <CommandList>
                                {filteredOrgs.map((group) => (
                                    <Fragment key={group.heading}>
                                        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground px-2 py-1">
                                            {group.heading}
                                        </DropdownMenuLabel>
                                        {group.items.length > 0 ? (
                                            group.items.map((org) => (
                                                <CommandItem
                                                    key={org.id}
                                                    onSelect={async () => {
                                                        setModalOpen(false);
                                                        await onOrgChange(org.id);
                                                    }}
                                                    className="flex items-center gap-2 text-sm"
                                                >
                                                    <Avatar className="h-5 w-5 mr-2">
                                                        <AvatarImage src={org.image ?? ""} />
                                                        <AvatarFallback>
                                                        {currentOrg?.name?.charAt(0).toUpperCase() ?? "N/A"}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    {org.name}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            currentOrg.id === org.id
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))
                                        ) : (
                                            <p className="px-2 pb-2 text-xs font-light text-muted-foreground">
                                                No organization found.
                                            </p>
                                        )}
                                    </Fragment>
                                ))}
                            </CommandList>
                            <CommandSeparator />
                            <CommandList>
                                <CommandGroup>
                                    <CommandItem>
                                        <button
                                            onClick={() => setModalOpen(true)}
                                            className="flex w-full cursor-pointer items-center justify-start gap-2"
                                        >
                                            <PlusCircledIcon className="h-4 w-4" />
                                            <span className="font-medium">
                                                Create Organization
                                            </span>
                                        </button>
                                    </CommandItem>
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
