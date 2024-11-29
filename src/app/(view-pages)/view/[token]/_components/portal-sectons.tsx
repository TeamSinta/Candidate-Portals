"use client";

import { useEffect, useRef, useState } from "react";
// import NotionEditorComponent from "@/components/NotionEditorComponent";
// import LinkComponent from "@/components/LinkComponent";
// import DocumentComponent from "@/components/DocumentComponent";
// import PdfViewer from "@/components/PdfViewer";
import {
    plugins,
    replaceText,
    getExtendedImage,
} from "@/app/(app)/(user)/editor/utils/yoopta-config";
import Editor from "@/components/editor";
import { SectionContentType } from "@/server/db/schema";
import { PortalReaderData } from "@/types/portal";
import CardNavigatorMenu from "./card-navigator-nenu";
import LinkComponent from "./url-reader";
import { getUploadFunction } from "@/lib/utils";
type Section = {
    sectionId: string;
    title: string;
    content: any;
    contentType: SectionContentType;
};

type PortalContentProps = {
    portalData?: PortalReaderData;
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

    const { sections, portalId, linkId } = portalData;
    const selectedSection = sections[selectedSectionIndex];

    const sendDurationData = () => {
        const currentSection = sections[sectionIndexRef.current];
        if (!currentSection || startTimeRef.current === null) return;

        const endTime = Date.now();
        const duration = Math.round(endTime - startTimeRef.current);

        if (duration >= 100) {
            cumulativeDurationRef.current += duration;

            // Construct the payload
            const payload = {
                eventData: {
                    event_name: "Section Duration",
                    section_id: currentSection.sectionId,
                    user_id: portalData.userId,
                    portal_id: portalId,
                    link_id: linkId,
                    section_title: currentSection.title,
                    duration: cumulativeDurationRef.current,
                    timestamp: new Date().toISOString(),
                    session_id: sessionIdRef.current,
                },
            };

            // Use sendBeacon for reliable background sending (more reliable than fetch)
            const endpoint = "/api/tinybird";
            const success = navigator.sendBeacon(
                endpoint,
                JSON.stringify(payload),
            );

            if (!success) {
                console.error("Failed to send duration data using sendBeacon.");
                // Optionally, implement a retry mechanism or local storage fallback here
            } else {
                console.log(
                    "Duration data sent to Tinybird successfully via sendBeacon!",
                );
            }
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                sendDurationData();
            } else {
                startTimeRef.current = Date.now();
            }
        };
        const handleBeforeUnload = () => {
            if (document.visibilityState === "visible") {
                sendDurationData(); // Ensure the final session is captured before the window/tab is closed
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            window.removeEventListener("beforeunload", handleBeforeUnload);
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

    if (!portalData) {
        return <div>Loading...</div>;
    }
    const handleSectionSelect = (index: number) => {
        setSelectedSectionIndex(index);
        setIsCardCollapsed(false);
    };
    const replaceData = {
        name: portalData.candidateName,
        email: portalData.candidateEmail,
    } as Record<string, string>;
    const renderSectionContent = (section: Section) => {
        const uploadFunction = getUploadFunction(portalId, section.sectionId);
        switch (section.contentType) {
            case SectionContentType.YOOPTA:
                return (
                    <Editor
                        content={JSON.parse(
                            replaceText(
                                JSON.stringify(section.content),
                                replaceData,
                            ),
                        )}
                        editable={false}
                        onChange={() => {
                            return null;
                        }}
                        onTitleChange={() => {
                            return null;
                        }}
                        title={replaceText(section.title, replaceData)}
                        plugins={[
                            ...plugins,
                            getExtendedImage(getUploadFunction),
                        ]}
                    />
                );
            case SectionContentType.URL:
                return (
                    <div className="h-screen">
                        <LinkComponent urlData={section.content} />
                    </div>
                );
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
        <div className="">
            <div className="">
                {selectedSection ? (
                    <>
                        {/* <h1 className="text-lg font-bold">{selectedSection.title}</h1> */}
                        {renderSectionContent(
                            sections[selectedSectionIndex] as Section,
                        )}
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
                customData={replaceData}
            />
        </div>
    );
}
