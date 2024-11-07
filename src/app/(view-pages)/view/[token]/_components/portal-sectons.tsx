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

    // Improved renderContent function to handle various content types
    const renderContent = (content: any) => {
        if (typeof content === "string") {
            return <p>{content}</p>;
        } else if (typeof content === "object" && "text" in content) {
            return <p>{content.text}</p>;
        } else if (Array.isArray(content)) {
            return content.map((item, index) => (
                <p key={index}>
                    {typeof item === "object" && "text" in item
                        ? item.text
                        : item}
                </p>
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
                        <h1 className="text-lg font-bold">
                            {selectedSection.title}
                        </h1>
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
