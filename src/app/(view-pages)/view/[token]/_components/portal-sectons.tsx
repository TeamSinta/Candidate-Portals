"use client";
import React, { useState, useEffect, useRef } from "react";
import BottomToolbar from "./bottom-toolbar";
import Sidebar from "./side-menu";
import { sendEventToTinybird } from "@/lib/utils";

type Section = {
  sectionId: string;
  title: string;
  content: any;
  contentType: string;
  type?: string;
};

type PortalData = {
  candidateName: string;
  candidateEmail: string;
  userId: string;
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sessionIdRef = useRef<string>(crypto.randomUUID()); // Generate a session ID

  const startTimeRef = useRef<number | null>(null);
  const cumulativeDurationRef = useRef<number>(0);
  const sectionIndexRef = useRef<number>(selectedSectionIndex);

  const minimumDurationThreshold = 100; // Minimum duration in ms to log an event

  // **Ref to track if it's the initial mount**
  const isInitialMountRef = useRef<boolean>(true);

  if (!portalData) {
    return <div>Loading...</div>;
  }

  const { sections, userId, portalId, linkId } = portalData;
  const selectedSection = sections[selectedSectionIndex];

  // Function to send duration data to Tinybird
  const sendDurationData = async () => {
    const currentSection = sections[sectionIndexRef.current];
    if (!currentSection || startTimeRef.current === null) return;

    const endTime = Date.now();
    const duration = Math.round(endTime - startTimeRef.current);

    // Only log if duration exceeds the minimum threshold
    if (duration >= minimumDurationThreshold) {
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

  // Handle visibility changes for tab switching
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === "hidden") {
        await sendDurationData(); // Send cumulative duration when tab becomes hidden
      } else {
        startTimeRef.current = Date.now(); // Reset start time when tab is visible again
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Track section changes, reset start time, and ignore first mount duration
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false; // Mark initial mount as complete
      setTimeout(() => {
        startTimeRef.current = Date.now(); // Start tracking after initial delay
      }, 100); // Delay to avoid first-mount glitches
    } else {
      sendDurationData(); // Send duration for previous section
      startTimeRef.current = Date.now(); // Reset start time for the new section
    }

    sectionIndexRef.current = selectedSectionIndex; // Update section reference
    cumulativeDurationRef.current = 0; // Reset cumulative duration
  }, [selectedSectionIndex]);

  // Function to handle click events
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    const clickTarget = event.target as HTMLElement;
    sendEventToTinybird({
      event_name: "Click",
      section_id: selectedSection.sectionId,
      user_id: userId,
      portal_id: portalId,
      link_id: linkId,
      section_title: selectedSection?.title,
      click_target: clickTarget.id || clickTarget.tagName,
      timestamp: new Date().toISOString(),
      session_id: sessionIdRef.current,
    });
  };

  const handleNext = () => {
    if (selectedSectionIndex < sections.length - 1) {
      setSelectedSectionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedSectionIndex > 0) {
      setSelectedSectionIndex((prev) => prev - 1);
    }
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSectionIndex(sections.indexOf(section));
    setIsSidebarOpen(false);
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

  return (
    <div className="my-2 flex flex-1 flex-col rounded border bg-white shadow">
      <header className="flex h-16 items-center justify-between border-b border-gray-200 px-4" />

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

      <BottomToolbar
        handlePrevious={handlePrevious}
        handleNext={handleNext}
        selectedSectionIndex={selectedSectionIndex}
        totalSections={sections.length}
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        sections={sections}
        handleSectionSelect={handleSectionSelect}
      />
    </div>
  );
}
