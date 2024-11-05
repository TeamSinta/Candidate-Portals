"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Menu, Search, X, FileText, BookOpen, File, Video, YoutubeIcon, Circle, CircleDashedIcon } from "lucide-react";
import { NotionLogoIcon } from "@radix-ui/react-icons";

type Section = {
  id: string;
  title: string;
  content: any;
  type: "website" | "notion" | "pdf" | "video"; // Added type to distinguish resource types
};

type PortalContentProps = {
  sections: Section[];
};

export default function PortalContent({ sections }: PortalContentProps) {
  const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const selectedSection = sections[selectedSectionIndex];

  // Possible types and icons
  const types = ["website", "notion", "pdf", "video"];

  // Assign random type to each section on initial load
  const sectionsWithTypes = sections.map((section) => ({
    ...section,
    type: types[Math.floor(Math.random() * types.length)] // Assign random type
  }));

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
    setSelectedSectionIndex(sectionsWithTypes.indexOf(section));
    setIsSidebarOpen(false); // Close sidebar after selection
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

  // Function to render icon based on section type
  const renderIcon = (type: string) => {
    switch (type) {
      case "website":
        return <FileText className="h-5 w-5" />; // Website icon
      case "notion":
        return <NotionLogoIcon className="h-5 w-5" />; // Notion page icon
      case "pdf":
        return <File className="h-5 w-5 " />; // PDF icon
      case "video":
        return <YoutubeIcon className="h-5 w-5 " />; // Video icon
      default:
        return <FileText className="h-5 w-5 " />; // Default icon
    }
  };

  return (
    <div className="flex flex-col h-[91vh] mx-4 my-2 bg-white shadow rounded-md border ">
      {/* Main Header */}
      <header className="flex h-16 items-center justify-between px-4 border-b border-gray-200">

      </header>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        <h1 className="text-lg font-bold">{selectedSection.title}</h1>
        {renderContent(selectedSection.content)}
      </div>

      {/* Bottom Toolbar */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/50 shadow-lg rounded-md px-4 py-2 flex items-center gap-4 border border-gray-300 backdrop-blur-lg hover:bg-opacity-100 hover:shadow-2xl transition-all">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <button
          onClick={handlePrevious}
          disabled={selectedSectionIndex === 0}
          className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={selectedSectionIndex === sections.length - 1}
          className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Sliding Sidebar */}
      <div
        onMouseEnter={() => setIsSidebarOpen(true)}
        onMouseLeave={() => setIsSidebarOpen(false)}
        className={`fixed left-0 top-1/2 transform -translate-y-1/2 w-52 h-1/3 bg-white shadow-lg rounded-r-lg transition-transform duration-300 z-50 border border-gray-200 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Sidebar Header with Search */}
        <div className="flex items-center p-2 border-b border-gray-200">
          <Search className="h-4 w-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Section List */}
        <div className="p-2 overflow-y-auto h-full">
          {sectionsWithTypes.map((section) => (
            <div
              key={section.id}
              onClick={() => handleSectionSelect(section)}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
            >
              {/* Icon based on section type */}
              {renderIcon(section.type)}

              {/* Section Title */}
              <span className="text-sm font-medium text-gray-800 flex-1">{section.title}</span>

              {/* Shortcut Placeholder */}
              <span className="text-xs text-gray-500">
                <CircleDashedIcon className="h-4 w-4"/>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
