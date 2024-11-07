"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { siteUrls } from "@/config/urls";
import { ChevronDown, CircleUser, LineChart, LucideArrowDownUp, Share, Share2Icon, TrendingUp,  } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import CircleProgressLoader from "@/app/(app)/_components/circle-progress-loader";

interface LinksCardProps {
  portalData: {
    links: { url: string; candidateId: string }[];
    candidates: { candidateId: string; name?: string; email?: string }[];
  };
}

export default function LinksCard({ portalData }: LinksCardProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const progress = 0.75; // Example progress amount (75%)

  return (
    <Card className="mt-6 rounded shadow-none">
      <CardHeader>
        <CardTitle>All Links</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Link</th>
              <th className="py-2">Views</th>
              <th className="py-2">View Duration</th>
            </tr>
          </thead>
          <tbody>
            {portalData.links && portalData.links.length > 0 ? (
              portalData.links.map((link, index) => {
                const candidate = portalData.candidates.find(
                  (c) => c.candidateId === link.candidateId
                );
                const displayName = candidate?.name || candidate?.email || "Untitled";

                return (
                  <tr key={index} className="border-b items-center font-heading ">
                    <td className="py-4 flex gap-2 items-center"><Image className="rounded-sm" width={26} height={30} alt="user pic" src={`https://avatar.vercel.sh/${displayName}`}/> {displayName}</td>
                    <td className="py-2">
                      <div
                        className="relative group cursor-pointer"
                        onClick={() => handleCopy(link.url)}
                      >

                        <div className="p-2 rounded-full bg-blue-50 group-hover:bg-white group-hover:border hover:border-blue-400 transition w-[400px] overflow-hidden text-center">
                          <span className="text-black text-sm group-hover:hidden">
                            {siteUrls.publicUrl + siteUrls.view + link.url}
                          </span>
                          <span className="hidden text-blue-600 group-hover:inline ">
                            Copy to Clipboard
                          </span>
                        </div>
                      </div>
                    </td>
                    <HoverCard>
      <HoverCardTrigger className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-blue-600 cursor-pointer">
        <Badge className="border-gray-300 bg-gray-50 text-gray-700 transition-all hover:bg-gray-200 rounded border text-muted-foreground gap-2">
         <TrendingUp className="h-4 w-4" /> 5 Views <Separator className="h-3 " orientation="vertical"/> <LucideArrowDownUp className="h-4 w-4"/>
        </Badge>
      </HoverCardTrigger>
      <HoverCardContent className="p-4 rounded-sm shadow-lg bg-white border border-gray-200">
        <div className="text-sm font-semibold text-gray-800">
          4
        </div>
        <div className="text-xs text-gray-500 mb-3" suppressHydrationWarning>
          Last clicked 3
        </div>
        <button className="px-3 py-1 text-xs font-medium text-white bg-black rounded hover:bg-gray-800">
          Edit sharing
        </button>
        <button className="ml-2 p-1 text-gray-600 bg-gray-100 rounded-sm hover:bg-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2h2M12 1v4m8 4l-8-8-8 8"
            />
          </svg>
        </button>
      </HoverCardContent>
    </HoverCard>
    <td className="py-2">  <CircleProgressLoader progress={progress} /></td> {/* Use the progress loader */}
    </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={4} className="py-2 text-center text-muted-foreground">
                  No links available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
