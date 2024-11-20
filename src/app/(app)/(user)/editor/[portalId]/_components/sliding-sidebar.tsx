// SlidingSidebar.jsx
"use client";

import React, { createContext, useContext, useState, useEffect, Dispatch, SetStateAction } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarInset } from "@/components/ui/sidebar"; // Adjust the import path
import { usePathname } from "next/navigation"; // Use usePathname from next/navigation
import { SectionContentType } from "@/server/db/schema"; // Import SectionContentType
import UrlInput from "./url-input";
import EditorWrapper from "../../content/[sectionId]/_components/editor-wrapper";
import { getSectionQuery } from "@/server/actions/portal/queries";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateSectionContent } from "@/server/actions/portal/mutations";
import { toast } from "sonner";

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
};

// Create the context with a default value
const SlidingSidebarContext = createContext<SlidingSidebarContextType | undefined>(undefined);

export const useSlidingSidebar = () => {
  const context = useContext(SlidingSidebarContext);
  if (!context) {
    throw new Error("useSlidingSidebar must be used within SlidingSidebarProvider");
  }
  return context;
};

// Provider component
export const SlidingSidebarProvider = ({ children }) => {
  const [isSlidingSidebarOpen, setSlidingSidebarOpen] = useState(false);
  const [contentType, setContentType] = useState<SectionContentType | undefined>(undefined);
  const [title, setTitle] = useState<string>("");
  const [urlContentData, setUrlContentData] = useState<{ url: string }>({ url: "" });
  const [sectionId, setSectionId ] = useState<string | null>(null); // Add state for sectionId
  const [portalId, setPortalId ] = useState<string | null>(null); // Add state for sectionId

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
      setPortalId

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
  } = useSlidingSidebar();

  const [sectionData, setSectionData] = useState<any>(null); // Replace `any` with the appropriate type
  const [portalData, setPortalData] = useState<any>(null); // Replace `any` with the appropriate type
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSectionData = async () => {
      if (sectionId && isSlidingSidebarOpen && contentType === SectionContentType.YOOPTA) {
        setLoading(true);
        try {
          const [data] = await getSectionQuery(sectionId);
          if (data) {
            setSectionData(data.section);
            setPortalData(data.portal);
          } else {
            console.warn("No data found for Section ID:", sectionId);
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




  return (
    <AnimatePresence>
      {isSlidingSidebarOpen && (

        <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.5, ease: "easeInOut" }} // Smooth transition
        className="flex" // Use flex to make it push content
      >
        <SidebarInset className="border my-2 mr-1 min-h-[0px] max-w-[80rem] min-w-[78rem] rounded-lg p-6 dark:bg-gray-900">
        <ScrollArea style={{ height: "calc(100vh - 4.5rem)", overflow:"scroll" }}>

    {/* Render content based on contentType */}
    {loading && <p>Loading...</p>}
            {!loading && contentType === SectionContentType.URL && (
              <UrlInput
                title={title}
                url={urlContentData.url}
                onChange={(key, value) => setUrlContentData({ ...urlContentData, [key]: value })}
                onTitleChange={setTitle}
                editable={true}
                portalId={portalId}
                sectionId={sectionId}
                isSlidingSidebarOpen={isSlidingSidebarOpen}
                setSlidingSidebarOpen={setSlidingSidebarOpen}
              />

            )}
            {!loading && contentType === SectionContentType.YOOPTA && sectionData && portalData && (
                sectionData.content ? (

              <EditorWrapper section={sectionData} portal={portalData} />
            ) : (
              <p>Error: Content is missing or improperly formatted</p>
            )
            )}
                </ScrollArea>

          </SidebarInset>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlidingSidebar;
