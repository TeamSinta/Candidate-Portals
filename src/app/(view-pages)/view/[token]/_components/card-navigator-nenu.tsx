"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, Circle, GalleryVerticalEnd } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Section } from "@/types/portal";

type PortalData = {
  candidateName: string;
  roleTitle?: string;
  orgName: string;
  userName: string;
  sections: Section[];
};

type CardNavigatorMenuProps = {
  portalData: PortalData;
  selectedSectionIndex: number;
  isCardCollapsed: boolean;
  onSectionSelect: (index: number) => void;
  toggleCardCollapse: () => void;
};

const CardNavigatorMenu: React.FC<CardNavigatorMenuProps> = ({
  portalData,
  selectedSectionIndex,
  isCardCollapsed,
  onSectionSelect,
  toggleCardCollapse,
}) => {
  const { candidateName, roleTitle, orgName, userName, sections } = portalData;

  return (
    <motion.div
      initial={{ y: 200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="fixed left-4 bottom-4  "
    >
      <Card className="w-[350px] shadow-lg bg-slate-50">
        <CardHeader className="flex items-center justify-between w-full !pb-0">
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
            <h3 className="text-xs font-medium text-muted-foreground mt-4">Review</h3>
            <div className="mt-2 space-y-2">
              {sections.map((section, index) => (
                <div
                  key={section.sectionId}
                  className={`flex items-center justify-between space-x-2 cursor-pointer ${
                    index === selectedSectionIndex ? "text-blue-600 font-semibold" : "text-gray-700"
                  }`}
                  onClick={() => onSectionSelect(index)}
                >
                  <div className="flex items-center gap-2">
                    <Circle className="text-gray-300 h-4 w-4" />
                    <span className="text-sm">{section.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        )}

        <CardFooter>
          <div className="w-full flex flex-col">
            {!isCardCollapsed && <Button className="w-full rounded">Message {userName}</Button>}
            <p className="mt-2 text-center text-xs text-gray-400 underline">Powered by Sinta</p>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CardNavigatorMenu;
