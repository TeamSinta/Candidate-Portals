"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sendEventToTinybird } from "@/server/tinybird/client";
import { Card } from "@/components/ui/card";
// import NotionEditorComponent from "@/components/NotionEditorComponent";
// import LinkComponent from "@/components/LinkComponent";
// import DocumentComponent from "@/components/DocumentComponent";
// import PdfViewer from "@/components/PdfViewer";
import { SectionContentType } from "@/server/db/schema";
import CardNavigatorMenu from "./card-navigator-nenu";
import YooptaReader from "./yoopta-reader";

type Section = {
  sectionId: string;
  title: string;
  content: any;
  contentType: SectionContentType;
};

type PortalData = {
  candidateName: string;
  candidateEmail: string | null;
  roleTitle: string;
  orgName: string;
  userName: string;
  portalId: string;
  linkId: string;
  customContent: object | string | null;
  sections: Section[];
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

  const { sections, portalId, linkId, candidateName, roleTitle, orgName, userName } = portalData;
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
        user_id: portalData.userId,
        portal_id: portalId,
        link_id: linkId,
        section_title: currentSection.title,
        duration: cumulativeDurationRef.current,
        timestamp: new Date().toISOString(),
        session_id: sessionIdRef.current,
      });
    }
  };

  // useEffect(() => {
  //   const handleVisibilityChange = async () => {
  //     if (document.visibilityState === "hidden") {
  //       await sendDurationData();
  //     } else {
  //       startTimeRef.current = Date.now();
  //     }
  //   };

  //   document.addEventListener("visibilitychange", handleVisibilityChange);
  //   return () => {
  //     document.removeEventListener("visibilitychange", handleVisibilityChange);
  //   };
  // }, []);

  // useEffect(() => {
  //   if (isInitialMountRef.current) {
  //     isInitialMountRef.current = false;
  //     setTimeout(() => {
  //       startTimeRef.current = Date.now();
  //     }, 100);
  //   } else {
  //     sendDurationData();
  //     startTimeRef.current = Date.now();
  //   }

  //   sectionIndexRef.current = selectedSectionIndex;
  //   cumulativeDurationRef.current = 0;
  // }, [selectedSectionIndex]);

  const handleSectionSelect = (index: number) => {
    setSelectedSectionIndex(index);
    setIsCardCollapsed(false);
  };

  const renderSectionContent = (section: Section) => {
    switch (section.contentType) {
      case SectionContentType.YOOPTA:
        return <YooptaReader
        portalData={portalData}
        sectionId={section.sectionId}
        content={section.content}
      />
      // case SectionContentType.URL:
      //   return <LinkComponent url={section.content} />;
      // case SectionContentType.DOC:
      //   return <DocumentComponent documentData={section.content} />;
      // case SectionContentType.NOTION:
      //   return <NotionEditorComponent content={section.content} />;
      // case SectionContentType.PDF:
      //   return <PdfViewer pdfData={section.content} />;
      default:
        return <p>Content not available</p>;
    }
  };

  return (
    <div className="my-2 flex flex-1 flex-col">
      <div className="flex-1 p-6">
        {selectedSection ? (
          <>
            {/* <h1 className="text-lg font-bold">{selectedSection.title}</h1> */}
            {renderSectionContent(selectedSection)}
          </>
        ) : (
          <p>No content available</p>
        )}
      </div>

      {/* Collapsible Card Navigator */}

          {/* Card Navigator Menu */}
          <CardNavigatorMenu
            portalData={portalData}
            selectedSectionIndex={selectedSectionIndex}
            isCardCollapsed={isCardCollapsed}
            onSectionSelect={handleSectionSelect}
            toggleCardCollapse={toggleCardCollapse}
          />


    </div>
  );
}
