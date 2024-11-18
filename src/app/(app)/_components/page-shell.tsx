import React, { type ElementType } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

type AppPageShellProps = {
    children: React.ReactNode;
    as?: ElementType;
    title: string;
    description: string;
    buttons?: React.ReactNode[];
    breadcrumbs?: string[];
};

export function AppPageShell({
    as,
    children,
    title,
    buttons,
    breadcrumbs,
}: AppPageShellProps) {
    const Container = as ?? "main";

    return (
        <div className="flex h-full w-full flex-col space-y-4">
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="#">{title}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {breadcrumbs?.map((crumb, index) => (
                            <>
                                <BreadcrumbSeparator className="hidden md:block" />
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage>{crumb}</BreadcrumbPage>
                                </BreadcrumbItem>
                            </>
                        ))}
                        {/* <BreadcrumbSeparator className="hidden md:block" /> */}
                        <BreadcrumbItem>
                            {/* <BreadcrumbPage>Portals</BreadcrumbPage> */}
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                {buttons && (
                    <div className="flex flex-1 justify-end">{buttons}</div>
                )}
            </div>
            <Container className=" space-y-8 pb-8">{children}</Container>
        </div>
    );
}
