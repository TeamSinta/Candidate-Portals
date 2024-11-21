"use client";

import React, { useState } from "react";
import LinkComponent from "@/app/(view-pages)/view/[token]/_components/url-reader";
import CardNavigatorMenu from "@/app/(view-pages)/view/[token]/_components/card-navigator-nenu";
import { Badge } from "@/components/ui/badge";
import Editor from "@/components/editor";
import {
    replaceText,
    sampleDictionary,
} from "../../editor/utils/yoopta-config";
import { useSidebar } from "@/components/ui/sidebar";
import { YooptaContentValue } from "@yoopta/editor";

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

export default function PortalContentPreview({
    portalData,
}: PortalContentPreviewProps) {
    const [selectedSectionIndex, setSelectedSectionIndex] = useState(0);
    const [isCardCollapsed, setIsCardCollapsed] = useState(false);
    const [isPreviewing, setIsPreviewing] = useState<boolean>(false);
    const sidebar = useSidebar();

    const toggleCardCollapse = () => {
        setIsCardCollapsed(!isCardCollapsed);
    };

    if (!portalData) {
        return <div>Loading...</div>;
    }

    const { sections } = portalData;
    console.log(sections);
    const selectedSection = sections[selectedSectionIndex];
    const [title, setTitle] = useState<string>(selectedSection?.title ?? "");
    const [sectionContent, setSectionContent] = useState<YooptaContentValue>(
        selectedSection?.content as YooptaContentValue,
    );
    const handleSectionSelect = (index: number) => {
        setSelectedSectionIndex(index);
        setIsCardCollapsed(false);
    };

    function handleTogglePreview() {
        sidebar.setOpen(isPreviewing);
        setIsPreviewing(!isPreviewing);
    }

    const renderSectionContent = (section: Section) => {
        switch (section.contentType) {
            case "Link":
                console.log(section, "section");
                return <LinkComponent urlData={section.content} />;
            case "Yoopta":
                console.log(section, "section");

                return (
                    <div className="max-h-[55%] w-full overflow-scroll rounded">
                        <Editor
                            content={
                                isPreviewing
                                    ? JSON.parse(
                                          replaceText(
                                              JSON.stringify(section.content),
                                              sampleDictionary,
                                          ),
                                      )
                                    : section.content
                            }
                            editable={false}
                            onChange={setSectionContent}
                            onTitleChange={(newTitle: string) => {
                                setTitle(newTitle);
                            }}
                            title={
                               (section.title ?? "")
                            }
                        />
                    </div>
                );
            case "Notion Editor":
                console.log(section, "section");

                return (
                    <div className="max-h-[45rem] w-full overflow-scroll rounded">
                        <Editor
                            content={
                                isPreviewing
                                    ? JSON.parse(
                                          replaceText(
                                              JSON.stringify(section.content),
                                              sampleDictionary,
                                          ),
                                      )
                                    : section.content
                            }
                            editable={false}
                            onChange={setSectionContent}
                            onTitleChange={(newTitle: string) => {
                                setTitle(newTitle);
                            }}
                            title={
                               (section.title ?? "")
                            }
                        />
                    </div>
                );
            default:
                return <p>Content not available</p>;
        }
    };

    return (
        <div className="h-full rounded pb-4">
            <div className="h-full w-full rounded">
                {selectedSection ? (
                    <>
                        <div className="flex items-center gap-2 pb-2">
                            <Badge className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium tracking-wide text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                Preview Mode
                            </Badge>
                            <h1 className="text-lg font-bold">
                                {selectedSection.title}{" "}
                            </h1>
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
