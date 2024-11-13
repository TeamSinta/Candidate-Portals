"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronDown, Eye, PlusSquare, PlusCircleIcon, MinusCircleIcon } from "lucide-react"; // Importing the Eye icon
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { NotionLogoIcon } from "@radix-ui/react-icons";

type VisitorsAccordionProps = {
  sectionData: any[]; // Array of section data
};

const VisitorsAccordion: React.FC<VisitorsAccordionProps> = ({ sectionData }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]
    );
  };

  const formatDuration = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`; // Format as MM:SS
  };

  return (
    <>
      {sectionData.map((section, index) => {
        const isSectionExpanded = expandedSections.includes(section.section_id);
        const isLastSection = index === sectionData.length - 1; // Check if it's the last section
        const isStartSection = index === 0; // Check if it's the last section

        return (
          <React.Fragment key={section.section_id}>
            <TableRow
              className="cursor-pointer border-none "
              onClick={() => toggleSection(section.section_id)}
            >
              {/* Timeline and Icon */}
              <TableCell className=" text-end rounded">
                <div className="relative flex items-start space-x-5 mx-5">
                  {/* Eye Icon and Timeline Line */}
                  <div className="flex flex-col items-center">
                  {!isStartSection && (
                      <Separator orientation="vertical" className="h-5 text-gray-500"/>
                    )}
                     {isStartSection && (
                      <div className="h-5 text-gray-500">  </div>
                    )}

                  <Eye className="h-5 w-5 text-gray-500 mb-1" />
                    {!isLastSection && (
                      <Separator orientation="vertical" className="h-5 text-gray-500"/>
                    )}

                  </div>

                  {/* Timeline Content */}
                  <div className="flex-1 py-3">
                    <div className="flex flex-col text-start">
                    <div className="flex items-center  gap-2">
                        Viewed  <Badge
      variant="secondary"
      className="px-2  text-sm rounded font-medium "
    > <NotionLogoIcon className="mr-3"/>{section.section_title}</Badge>
    </div>

                      <span className="text-gray-500 text-sm">
                        For {formatDuration(section.total_duration)}
                      </span>
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Empty Table Cells for Alignment */}
              <TableCell className="py-5 text-start rounded"></TableCell>
              <TableCell className="py-5 text-start rounded"></TableCell>

              {/* Chevron Icon */}
              <TableCell className="py-5 text-end rounded">
                {isSectionExpanded ? (
                        <MinusCircleIcon className="h-4 w-4 text-gray-600" />
                      ) : (
                  <PlusCircleIcon className="h-4 w-4 text-gray-600" />
                )}
              </TableCell>
            </TableRow>

            {/* Expanded Section Content */}
            {isSectionExpanded && (
              <TableRow>
                <TableCell colSpan={4} className="p-6 bg-gray-50 rounded">
                  Detailed information about {section.section_title} goes here.
                </TableCell>
              </TableRow>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
};

export default VisitorsAccordion;
