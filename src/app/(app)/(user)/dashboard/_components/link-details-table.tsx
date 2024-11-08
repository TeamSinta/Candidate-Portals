import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NotionLogoIcon } from "@radix-ui/react-icons";

type VisitorsAccordionProps = {
  linkId: string;
};

const VisitorsAccordion: React.FC<VisitorsAccordionProps> = ({ linkId }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const isSectionExpanded = (section: string) => expandedSections.includes(section);

  return (
    <>
      {/* First Section */}
      <TableRow className="cursor-pointer rounded-full border-none" onClick={() => toggleSection("section-1")}>
        <TableCell className="pl-8 my-6 font-medium rounded flex">
          {isSectionExpanded("section-1") ? (
            <ChevronDown className="h-4 w-4 mr-2 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 text-gray-600" />
          )}
        <NotionLogoIcon className="w-4 h-4 mr-2"/> Perks and Benefits
        </TableCell>
        <TableCell className="py-5 my-6 text-start rounded"></TableCell>
        <TableCell className="py-5 my-6 text-center rounded"></TableCell>
        <TableCell className="py-2 my-6 text-center rounded">
          <p>August 19, 2024</p>
          <p>Viewed for 3 min</p>
        </TableCell>
      </TableRow>
      {isSectionExpanded("section-1") && (
        <TableRow>
          <TableCell colSpan={4} className="p-6 bg-gray-50 rounded">
            Detailed information about perks and benefits goes here.
          </TableCell>
        </TableRow>
      )}

      {/* Second Section */}
      <TableRow className="cursor-pointer" onClick={() => toggleSection("section-2")}>
      <TableCell className="pl-8 my-6 font-medium rounded flex">
      {isSectionExpanded("section-2") ? (
            <ChevronDown className="h-4 w-4 mr-2 text-gray-600" />
          ) : (
            <ChevronRight className="h-4 w-4 mr-2 text-gray-600" />
          )}
          Our Values
        </TableCell>
        <TableCell className="py-2 my-6 text-start rounded"></TableCell>
        <TableCell className="py-2 my-6 text-center rounded"></TableCell>
        <TableCell className="py-2 my-6 text-center rounded">
          <p>August 19, 2024</p>
          <p>Viewed for 3 min</p>
        </TableCell>
      </TableRow>
      {isSectionExpanded("section-2") && (
        <TableRow>
          <TableCell colSpan={4} className="p-6 bg-gray-50 rounded">
            Detailed information about our values goes here.
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default VisitorsAccordion;
