"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    ChevronDown,
    ChevronUp,
    Circle,
    GalleryVerticalEnd,
} from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types/portal";
import { replaceText } from "@/app/(app)/(user)/editor/utils/yoopta-config";
import Link from "next/link";

type PortalData = {
    candidateName: string;
    roleTitle?: string;
    orgName: string;
    email: string;
    userName: string;
    sections: Section[];
};

type CardNavigatorMenuProps = {
    portalData: PortalData;
    selectedSectionIndex: number;
    isCardCollapsed: boolean;
    onSectionSelect: (index: number) => void;
    toggleCardCollapse: () => void;
    customData: Record<string, string>;
};

const CardNavigatorMenu: React.FC<CardNavigatorMenuProps> = ({
    portalData,
    selectedSectionIndex,
    isCardCollapsed,
    onSectionSelect,
    toggleCardCollapse,
    customData,
}) => {
    const { candidateName, roleTitle, orgName, userName, sections } =
        portalData;

    return (
        <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
            className="fixed bottom-4 left-4  "
        >
            <Card className="w-[350px] bg-slate-50 shadow-lg">
                <CardHeader className="flex w-full items-center justify-between !pb-0">
                    <div className="flex w-full justify-between">
                        <div className="flex gap-2">
                            <div className="flex aspect-square size-8 items-center justify-center rounded bg-black text-sidebar-primary-foreground">
                                <GalleryVerticalEnd className="h-4 w-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <CardTitle>{candidateName}</CardTitle>
                                <CardDescription>
                                    {orgName}
                                    {roleTitle && ` - ${roleTitle}`}
                                </CardDescription>
                            </div>
                        </div>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleCardCollapse}
                            aria-label="Toggle Collapse"
                        >
                            {isCardCollapsed ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                    </div>
                </CardHeader>

                {!isCardCollapsed && (
                    <CardContent>
                        <h3 className="mt-4 text-xs font-medium text-muted-foreground">
                            Review
                        </h3>
                        <div className="mt-2 space-y-2">
                            {sections.map((section, index) => (
                                <div
                                    key={section.sectionId}
                                    className={`flex cursor-pointer items-center justify-between space-x-2 ${
                                        index === selectedSectionIndex
                                            ? "font-semibold text-blue-600"
                                            : "text-gray-700"
                                    }`}
                                    onClick={() => onSectionSelect(index)}
                                >
                                    <div className="flex items-center gap-2">
                                        <Circle className="h-4 w-4 text-gray-300" />
                                        <span className="text-sm">
                                            {replaceText(
                                                section.title,
                                                customData,
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                )}

                <CardFooter>
                    <div className="flex w-full flex-col">
                        {!isCardCollapsed && (
                            <Link href={`mailto:${portalData.email}`}>
                                <Button className="w-full rounded">
                                    Message {userName}
                                </Button>
                            </Link>
                        )}
                        <p className="mt-2 text-center text-xs text-gray-400 underline">
                            Powered by Sinta
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default CardNavigatorMenu;
