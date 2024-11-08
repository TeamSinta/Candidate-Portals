"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { X, FileText, File, YoutubeIcon } from "lucide-react";
import { NotionLogoIcon } from "@radix-ui/react-icons";
import { Section } from "@/types/portal";

type SidebarProps = {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
    sections: Section[];
    handleSectionSelect: (section: Section) => void;
};

export default function Sidebar({
    isSidebarOpen,
    setIsSidebarOpen,
    sections,
    handleSectionSelect,
}: SidebarProps) {
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (!isSidebarOpen && event.clientX < 50) {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isSidebarOpen, setIsSidebarOpen]);

    const renderIcon = (type: string) => {
        switch (type) {
            case "website":
                return <FileText className="h-5 w-5" />;
            case "notion":
                return <NotionLogoIcon className="h-5 w-5" />;
            case "pdf":
                return <File className="h-5 w-5" />;
            case "video":
                return <YoutubeIcon className="h-5 w-5" />;
            default:
                return <FileText className="h-5 w-5" />;
        }
    };

    return (
        <motion.div
            onMouseEnter={() => setIsSidebarOpen(true)}
            onMouseLeave={() => setIsSidebarOpen(false)}
            initial={{ x: "-100%" }}
            animate={{ x: isSidebarOpen ? "0%" : "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-1/3 z-50 w-56 -translate-y-1/2 transform rounded-r-xl border border-gray-200 bg-white shadow-xl"
        >
            {isSidebarOpen && (
                <motion.button
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute right-2 top-2 p-1 text-gray-400 transition-opacity hover:text-gray-600"
                >
                    <X className="h-5 w-5" />
                </motion.button>
            )}
            <motion.div
                className="p-4 pt-6 text-lg font-semibold text-gray-800"
                initial={{ opacity: 0, y: -10 }}
                animate={{
                    opacity: isSidebarOpen ? 1 : 0,
                    y: isSidebarOpen ? 0 : -10,
                }}
                transition={{ duration: 0.4 }}
            >
                {isSidebarOpen && "Navigation"}
            </motion.div>

            <motion.div className="h-full space-y-1 overflow-y-auto p-2">
                {sections.map((section) => (
                    <motion.div
                        key={section.id} // Ensure this is a unique identifier
                        onClick={() => handleSectionSelect(section)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-gray-200"
                    >
                        <div className="text-gray-600">
                            {renderIcon(section.type)}
                        </div>
                        {isSidebarOpen && (
                            <span className="flex-1 text-sm font-medium text-gray-700">
                                {section.title}
                            </span>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </motion.div>
    );
}
