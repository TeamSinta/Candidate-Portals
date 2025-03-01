// SlidingSidebar.jsx
"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
    useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarInset } from "@/components/ui/sidebar"; // Adjust the import path
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation
import { SectionContentType } from "@/server/db/schema"; // Import SectionContentType
import UrlInput from "./url-input";
import { getSectionQuery } from "@/server/actions/portal/queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateSectionContent } from "@/server/actions/portal/mutations";
import { toast } from "sonner";
import EditorWrapperHeaders from "../../content/[sectionId]/_components/editor-wrapper-headers";

type SlidingSidebarContextType = {
    isSlidingSidebarOpen: boolean;
    setSlidingSidebarOpen: Dispatch<SetStateAction<boolean>>;
    toggleSlidingSidebar: () => void;
    contentType: SectionContentType | undefined;
    setContentType: Dispatch<SetStateAction<SectionContentType | undefined>>;
    title: string;
    setTitle: Dispatch<SetStateAction<string>>;
    urlContentData: { url: string };
    setUrlContentData: Dispatch<SetStateAction<{ url: string }>>;
    sectionId: string | null; // Add sectionId
    setSectionId: Dispatch<SetStateAction<string | null>>; // Function to set sectionId
    portalId: string | null; // Add sectionId
    setPortalId: Dispatch<SetStateAction<string | null>>;
    editorContentChanged: boolean;
    setEditorContentChanged: Dispatch<SetStateAction<boolean>>;
};

// Create the context with a default value
const SlidingSidebarContext = createContext<
    SlidingSidebarContextType | undefined
>(undefined);

export const useSlidingSidebar = () => {
    const context = useContext(SlidingSidebarContext);
    if (!context) {
        throw new Error(
            "useSlidingSidebar must be used within SlidingSidebarProvider",
        );
    }
    return context;
};

// Provider component
export const SlidingSidebarProvider = ({ children }) => {
    const [isSlidingSidebarOpen, setSlidingSidebarOpen] = useState(false);
    const [contentType, setContentType] = useState<
        SectionContentType | undefined
    >(undefined);
    const [title, setTitle] = useState<string>("");
    const [urlContentData, setUrlContentData] = useState<{ url: string }>({
        url: "",
    });
    const [sectionId, setSectionId] = useState<string | null>(null); // Add state for sectionId
    const [portalId, setPortalId] = useState<string | null>(null); // Add state for sectionId
    const [editorContentChanged, setEditorContentChanged] = useState(false);
    const pathname = usePathname(); // Get the current pathname

    const toggleSlidingSidebar = () => {
        setSlidingSidebarOpen((prev) => !prev);
    };

    // Close the sidebar on pathname change
    useEffect(() => {
        setSlidingSidebarOpen(false); // Close the sidebar when the pathname changes
    }, [pathname]);

    return (
        <SlidingSidebarContext.Provider
            value={{
                isSlidingSidebarOpen,
                setSlidingSidebarOpen,
                toggleSlidingSidebar,
                contentType,
                setContentType,
                title,
                setTitle,
                urlContentData,
                setUrlContentData,
                sectionId,
                setSectionId,
                portalId,
                setPortalId,
                editorContentChanged,
                setEditorContentChanged,
            }}
        >
            <div className="flex w-full">{children}</div>
        </SlidingSidebarContext.Provider>
    );
};

// SlidingSidebar component
const SlidingSidebar = () => {
    const {
        isSlidingSidebarOpen,
        setSlidingSidebarOpen,
        contentType,
        title,
        setTitle,
        urlContentData,
        setUrlContentData,
        portalId,
        sectionId, // Assuming sectionId is passed to the context
        setEditorContentChanged,
    } = useSlidingSidebar();

    const [sectionData, setSectionData] = useState<any>(null); // Replace `any` with the appropriate type
    const [portalData, setPortalData] = useState<any>(null); // Replace `any` with the appropriate type
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchSectionData = async () => {
            if (
                sectionId &&
                isSlidingSidebarOpen &&
                contentType === SectionContentType.YOOPTA
            ) {
                setLoading(true);
                try {
                    const [data] = await getSectionQuery(sectionId);
                    if (data) {
                        setSectionData(data.section);
                        setPortalData(data.portal);
                    } else {
                        console.warn(
                            "No data found for Section ID:",
                            sectionId,
                        );
                    }
                } catch (error) {
                    console.error("Error fetching section data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchSectionData();
    }, [sectionId, isSlidingSidebarOpen, contentType]);

    const [sidebarWidth, setSidebarWidth] = useState(640); // Initial width in px (40rem)
    const sidebarRef = useRef<HTMLDivElement | null>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        const startX = e.clientX;
        const startWidth = sidebarRef.current?.offsetWidth || sidebarWidth;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const newWidth = Math.max(
                320,
                startWidth - (startX - moveEvent.clientX),
            ); // Min width: 320px (20rem)
            setSidebarWidth(newWidth);
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <AnimatePresence>
            {isSlidingSidebarOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
                    className="" // Use flex to make it push content
                    style={{ width: "100%", marginRight: "1rem" }} // Dynamic width
                >
                    <SidebarInset className="my-2 min-h-[0px]  w-full rounded-lg border p-6 dark:bg-neutral-800 sm:max-w-[30vw] md:max-w-[40vw] lg:min-w-[50vw] lg:max-w-[55vw] xl:min-w-[65vw]">
                        <ScrollArea
                            style={{
                                height: "calc(100vh - 4.5rem)",
                                overflow: "scroll",
                            }}
                        >
                            {/* Render content based on contentType */}
                            {loading && <p>Loading...</p>}
                            {!loading &&
                                contentType === SectionContentType.URL && (
                                    <UrlInput
                                        title={title}
                                        url={urlContentData.url}
                                        onChange={(key, value) =>
                                            setUrlContentData({
                                                ...urlContentData,
                                                [key]: value,
                                            })
                                        }
                                        onTitleChange={setTitle}
                                        editable={true}
                                        portalId={portalId}
                                        sectionId={sectionId}
                                        isSlidingSidebarOpen={
                                            isSlidingSidebarOpen
                                        }
                                        setSlidingSidebarOpen={
                                            setSlidingSidebarOpen
                                        }
                                    />
                                )}
                            {!loading &&
                                contentType === SectionContentType.YOOPTA &&
                                sectionData &&
                                portalData &&
                                (sectionData.content ? (
                                    <EditorWrapperHeaders
                                        section={sectionData}
                                        portal={portalData}
                                        setEditorContentChanged={
                                            setEditorContentChanged
                                        }
                                    />
                                ) : (
                                    <p>
                                        Error: Content is missing or improperly
                                        formatted
                                    </p>
                                ))}
                        </ScrollArea>
                    </SidebarInset>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SlidingSidebar;
