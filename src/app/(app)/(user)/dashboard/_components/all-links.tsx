"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronRight, ChevronDown } from "lucide-react";
import Image from "next/image";
import VisitorsAccordion from "./link-details-table";
import CircleProgressLoader from "@/app/(app)/_components/circle-progress-loader";
import { siteUrls } from "@/config/urls";
import { getSectionDuration } from "@/server/tinybird/pipes/pipes";
import { cn } from "@/lib/utils";
import AnimatedGradientText from "@/components/ui/animated-gradient-text";
import { toast } from "sonner"; // Import the toast function
import { calculateViewCounts } from "@/server/tinybird/utils";
import { PortalData } from "@/types/portal";

interface LinksCardProps {
  portalData: PortalData
}

export default function LinksCard({ portalData }: LinksCardProps) {
  const [expandedLinks, setExpandedLinks] = useState<string[]>([]);
  const [viewCounts, setViewCounts] = useState<{ [key: string]: number }>({});
  const [progressMap, setProgressMap] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { counts, progressData } = await calculateViewCounts(portalData, getSectionDuration);
        setViewCounts(counts);
        setProgressMap(progressData);
      } catch (error) {
        console.error("Error fetching data for links:", error);
      }
    };

    fetchData();
  }, [portalData.links, portalData.sections]);



  const toggleLink = (url: string) => {
    setExpandedLinks((prev) =>
      prev.includes(url) ? prev.filter((link) => link !== url) : [...prev, url]
    );
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Link copied to clipboard!"); // Show success toast
    }).catch((error) => {
      console.error("Failed to copy text: ", error);
      toast.error("Failed to copy link."); // Show error toast
    });
  };

  return (
    <Card className="mt-6 rounded-sm shadow-none">
      <CardHeader>
        <CardTitle>All Links</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="py-2">Name</TableHead>
              <TableHead className="py-2">Link</TableHead>
              <TableHead className="py-2 text-center">Views</TableHead>
              <TableHead className="py-2 text-start">Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portalData.links.map((link) => {
              const candidate = portalData.candidates.find(
                (c) => c.candidateId === link.candidateId
              );
              const displayName = candidate?.name || candidate?.email || "Untitled";
              const isExpanded = expandedLinks.includes(link.url);
              const viewCount = viewCounts[link.linkId] || 0;
              const progress = progressMap[link.linkId] || 0;

              return (
                <React.Fragment key={link.url}>
                  <TableRow
                    className="cursor-pointer border-none justify-center items-center"
                    onClick={() => toggleLink(link.url)}
                  >
                    <TableCell className="py-6 flex gap-2  items-center font-medium">
                      <Image
                        className="rounded-sm"
                        width={26}
                        height={30}
                        alt="user pic"
                        src={`https://avatar.vercel.sh/${displayName}`}
                      />
                      {displayName}
                    </TableCell>
                    <TableCell className="py-2 items-start">
                      <div
                        className="relative group cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyToClipboard(siteUrls.publicUrl + siteUrls.view + link.url); // Call the copy function
                        }}
                      >
                        <div className="p-2 rounded-full bg-blue-50 group-hover:bg-white group-hover:border hover:border-blue-400 transition text-center w-[400px]">
                          <span className="text-black text-sm group-hover:hidden">
                            {siteUrls.publicUrl + siteUrls.view + link.url}
                          </span>
                          <span className="hidden text-blue-600 group-hover:inline">
                            Copy to Clipboard
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-2 justify-center items-center text-center">
                      {viewCount > 0 ? (
                        <AnimatedGradientText>
            <p className="transition-transform duration-300 ease-in-out group-hover:translate-x-0.5">🎉</p> <hr className="mx-2 h-4 w-px shrink-0 bg-gray-300" />{" "}
            <span
              className={cn(
                `inline animate-gradient bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40] bg-[length:var(--bg-size)_100%] bg-clip-text text-transparent`,
              )}
            >

          {viewCount} Views
          </span>

          </AnimatedGradientText>

                      ) : (
                        <span className="text-sm text-gray-500 text-center">0 Views</span>
                      )}
                    </TableCell>

                    <TableCell className="py-2 flex justify-around items-center">
                      <CircleProgressLoader progress={progress} />
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-600" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                      )}
                    </TableCell>
                  </TableRow>
                  {isExpanded && <VisitorsAccordion linkId={link.linkId} />}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
