"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { X, FileText, File, YoutubeIcon, ChevronDown, ChevronUp, Circle, GalleryVerticalEnd } from "lucide-react";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import { sendEventToTinybird } from "@/server/tinybird/client";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Section = {
  sectionId: string;
  title: string;
  content: any;
  contentType: string;
  type?: string;
};

type PortalData = {
  candidateName: string;
  companyName: string;
  role: string;
  recruiterName: string;
  sections: Section[];
  userId: string;
  portalId: string;
  linkId: string;
};

type PortalContentProps = {
  portalData?: PortalData;
};

export default function PortalContent({ portalData }: PortalContentProps) {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [isCardCollapsed, setIsCardCollapsed] = useState(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const startTimeRef = useRef<number | null>(null);
  const cumulativeDurationRef = useRef<number>(0);
  const sectionIndexRef = useRef<number>(selectedSectionIndex);
  const isInitialMountRef = useRef<boolean>(true);

  const toggleCardCollapse = () => {
    setIsCardCollapsed(!isCardCollapsed);
  };

  if (!portalData) {
    return <div>Loading...</div>;
  }

  const { sections, userId, portalId, linkId, candidateName, companyName, role, recruiterName } = portalData;
  const selectedSection = sections[selectedSectionIndex];

  // Function to send duration data to Tinybird
  const sendDurationData = async () => {
    const currentSection = sections[sectionIndexRef.current];
    if (!currentSection || startTimeRef.current === null) return;

    const endTime = Date.now();
    const duration = Math.round(endTime - startTimeRef.current);

    if (duration >= 100) {
      cumulativeDurationRef.current += duration;
      await sendEventToTinybird({
        event_name: "Section Duration",
        section_id: currentSection.sectionId,
        user_id: userId,
        portal_id: portalId,
        link_id: linkId,
        section_title: currentSection.title,
        duration: cumulativeDurationRef.current,
        timestamp: new Date().toISOString(),
        session_id: sessionIdRef.current,
      });
    }
  };

  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await sendDurationData();
      } else {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      setTimeout(() => {
        startTimeRef.current = Date.now();
      }, 100);
    } else {
      sendDurationData();
      startTimeRef.current = Date.now();
    }

    sectionIndexRef.current = selectedSectionIndex;
    cumulativeDurationRef.current = 0;
  }, [selectedSectionIndex]);

  const handleSectionSelect = (index: number) => {
    setSelectedSectionIndex(index);
    setIsCardCollapsed(false);
  };

  const renderContent = (content: any) => {
    if (typeof content === "string") {
      return <p>{content}</p>;
    } else if (typeof content === "object" && "text" in content) {
      return <p>{content.text}</p>;
    } else if (Array.isArray(content)) {
      return content.map((item, index) => (
        <p key={index}>{typeof item === "object" && "text" in item ? item.text : item}</p>
      ));
    } else {
      return <p>Content not available</p>;
    }
  };

  const renderIcon = (type: string) => {
    switch (type) {
      case "website":
        return <FileText className="h-4 w-4" />;
      case "notion":
        return <NotionLogoIcon className="h-4 w-4" />;
      case "pdf":
        return <File className="h-4 w-4" />;
      case "video":
        return <YoutubeIcon className="h-4 w-4" />;
      default:
        return <NotionLogoIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="my-2 flex flex-1 flex-col">
      <div className="flex-1 p-6">
        {selectedSection ? (
          <>
            <h1 className="text-lg font-bold">{selectedSection.title}</h1>
            {renderContent(selectedSection.content)}
          </>
        ) : (
          <p>No content available</p>
        )}
      </div>

      {/* Collapsible Card Navigator */}
      <motion.div
        initial={{ y: 200, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="fixed left-4 bottom-4 w-80 rounded-lg shadow-lg"
      >
        <Card className="w-[350px] shadow bg-slate-50">
          <CardHeader className="flex items-center justify-between w-full">
            <div className="flex w-full justify-between">
              <div className="flex gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded bg-black text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <CardTitle>{candidateName}</CardTitle>
                  <CardDescription>
                    [companyName] - [role]
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
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </CardHeader>

          {!isCardCollapsed && (
            <CardContent>
              <h3 className="text-xs font-medium text-muted-foreground">Review</h3>
              <div className="mt-2 space-y-2">
                {sections.map((section, index) => (
                  <div
                    key={section.sectionId}
                    className={`flex items-center justify-between space-x-2 cursor-pointer ${
                      index === selectedSectionIndex ? "text-blue-600 font-semibold" : "text-gray-700"
                    }`}
                    onClick={() => handleSectionSelect(index)}
                  >
<div className="flex items-center gap-2">
                    <Circle className="text-gray-300 h-4 w-4"/>
                    <span className="text-sm">{section.title}</span>
                    </div>
                    {/* {renderIcon(section.type || "")} */}

                  </div>
                ))}
              </div>
            </CardContent>
          )}

          <CardFooter >
            <div className="w-full">
            <Button className="w-full rounded">Message [recruiterName]</Button>
            <p className="mt-2 text-center text-xs text-gray-400 underline">Powered by Sinta</p>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
