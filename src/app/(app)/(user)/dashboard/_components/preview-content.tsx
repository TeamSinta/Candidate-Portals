"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { SectionContentType } from "@/server/db/schema";
import LinkComponent from "@/app/(view-pages)/view/[token]/_components/url-reader";
import YooptaReader from "@/app/(view-pages)/view/[token]/_components/yoopta-reader";
import CardNavigatorMenu from "@/app/(view-pages)/view/[token]/_components/card-navigator-nenu";
import { Badge } from "@/components/ui/badge";


type Section = {
    contentType: string;
    title: string;
    section_id: string;
    content?: any; // Adjusted to handle Yoopta content
};

type PortalContentPreviewProps = {
    portalData: {
        portal: {
            portalId: string;
            title: string;
        };
        sections: Section[];
        links: any[];
        candidates: any[];
    };
};

export default function PortalContentPreview({ portalData }: PortalContentPreviewProps) {
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [isCardCollapsed, setIsCardCollapsed] = useState(false);

    const toggleCardCollapse = () => {
        setIsCardCollapsed(!isCardCollapsed);
    };

    if (!portalData) {
        return <div>Loading...</div>;
    }

    const { sections } = portalData;
    console.log(sections)
    const selectedSection = sections[selectedSectionIndex];

    const handleSectionSelect = (index: number) => {
        setSelectedSectionIndex(index);
        setIsCardCollapsed(false);
    };

    const renderSectionContent = (section: Section) => {
        switch (section.contentType) {
            case "Link":
                return (

                <LinkComponent urlData={section.content} />
                );
            case "Yoopta":
                return (
                  <div className="max-h-[55%] overflow-scroll w-full rounded">

                    <YooptaReader
                        sectionId={section.section_id}
                        content={section.content}
                        portalData={portalData}
                    />
                     </div>
                );
            case "Notion Editor":
              return (
                <div className="max-h-[45rem] overflow-scroll w-full rounded">
                <YooptaReader
                    sectionId={section.section_id}
                    content={section.content}
                    portalData={portalData}
                />
                </div>
              )
                ;
            default:
                return <p>Content not available</p>;
        }
    };

    return (
        <div className="h-full pb-4 rounded">
            <div className="h-full w-full rounded">
                {selectedSection ? (
                    <>
                    <div className="flex gap-2 items-center pb-2">
                    <Badge className="text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 rounded-full px-3 py-1 tracking-wide hover:bg-blue-100 hover:text-blue-700">
                    Preview Mode
</Badge><h1 className="text-lg font-bold">{selectedSection.title} </h1>

                        </div>

                        {renderSectionContent(selectedSection)}
                    </>
                ) : (
                    <p>No content available</p>
                )}
            </div>

            {/* Collapsible Card Navigator */}
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
