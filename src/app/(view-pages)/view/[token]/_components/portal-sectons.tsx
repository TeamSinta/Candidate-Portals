"use client";

import React, { useState } from "react";
import BottomToolbar from "./bottom-toolbar";
import Sidebar from "./side-menu";


type Section = {
  id: string;
  title: string;
  content: any;
  type: string;
};

type PortalContentProps = {
  sections: Section[];
};

export default function PortalContent({ sections }: PortalContentProps) {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedSection = sections[selectedSectionIndex];

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

  return (
    <div className="flex flex-col flex-1 my-2 bg-white shadow rounded border">
      <header className="flex h-16 items-center justify-between px-4 border-b border-gray-200" />

      <div className="flex-1 p-6">
        {selectedSection ? (
          <>
            <h1 className="text-lg font-bold">{selectedSection.title}</h1>
            <p>{selectedSection.content}</p>
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
