import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PanelRight, Pencil, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming you're using the 'sonner' toast library
import { updateSectionContent } from "@/server/actions/portal/mutations";
import { SectionContentType } from "@/server/db/schema";
import { useRouter } from "next/navigation";
import { useBlockEditor } from "@/app/(app)/_components/block-editor-context";

interface UrlInputProps {
    sectionId: string;
    portalId: string | null; // Add sectionId
    title: string;
    url: string;
    onChange: (key: string, value: string) => void;
    onTitleChange: (newTitle: string) => void;
    editable: boolean;
    isSlidingSidebarOpen: boolean;
    setSlidingSidebarOpen: (open: boolean) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({
    sectionId,
    portalId,
    title,
    url,
    onChange,
    onTitleChange,
    editable,
    isSlidingSidebarOpen,
    setSlidingSidebarOpen,
}) => {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [iframeError, setIframeError] = useState(false);
    const [newTitle, setNewTitle] = useState(title);
    const router = useRouter();
    const { setBlocks } = useBlockEditor();

    const handleTitleSave = () => {
        onTitleChange(newTitle);
        setIsEditingTitle(false);
    };

    // Save function moved into UrlInput
    const handleSave = async () => {
        try {
            const updatedSection = {
                id: sectionId,
                portalId: portalId,
                title: newTitle,
                content: { url }, // Assuming content is just the URL for this section
                contentType: SectionContentType.URL,
                index: 0, // Adjust index based on your needs
            };

            // Update the section in the database
            await updateSectionContent(updatedSection);

            // Update the shared blocks state
            setBlocks((prevBlocks) => {
                const updatedBlocks = prevBlocks.map((block) =>
                    block.id === sectionId
                        ? { ...block, ...updatedSection }
                        : block,
                );
                return updatedBlocks;
            });

            toast.success("Section saved successfully");
            setSlidingSidebarOpen(false);
            router.refresh();
        } catch {
            toast.error("Failed to save section");
        }
    };
    return (
        <div className="flex flex-col space-y-8">
            {/* Header Bar with Title and Buttons */}
            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-4 shadow-sm">
                {/* Title Editing on the Left */}
                <div className="flex items-center space-x-2">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            onBlur={handleTitleSave}
                            className="rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            autoFocus
                        />
                    ) : (
                        <h1
                            className="cursor-pointer text-xl font-semibold"
                            onClick={() => setIsEditingTitle(true)}
                        >
                            {title}
                        </h1>
                    )}
                    {editable && !isEditingTitle && (
                        <Pencil
                            size={20}
                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                            onClick={() => setIsEditingTitle(true)}
                        />
                    )}
                </div>

                {/* URL Input Centered with Smaller Width */}
                <div className="mx-4">
                    <Input
                        type="url"
                        value={url}
                        onChange={(e) => onChange("url", e.target.value)}
                        className="w-full rounded border-gray-300 text-center"
                        placeholder="Enter a URL"
                    />
                </div>

                {/* Buttons on the Right */}
                <div className="flex items-center space-x-2">
                    {/* Publish Button */}
                    <Button
                        onClick={handleSave}
                        variant="outline"
                        className="rounded border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-500 hover:text-white"
                    >
                        Save
                    </Button>

                    {/* Close Sidebar Button */}
                    <button
                        className={`rounded p-2 transition-colors duration-200 ${
                            isSlidingSidebarOpen
                                ? "text-black-600 bg-gray-200"
                                : "hover:text-black-600 text-gray-500 hover:bg-gray-200"
                        }`}
                        onClick={() => setSlidingSidebarOpen(false)}
                        aria-label="Close Sidebar"
                    >
                        <PanelRight size={24} />
                    </button>
                </div>
            </div>

            {/* Iframe Preview */}
            {url && !iframeError ? (
                <iframe
                    src={url}
                    className=" h-[80vh] rounded-lg border"
                    onError={() => setIframeError(true)}
                ></iframe>
            ) : (
                <div className="mt-6 flex h-[80vh] flex-col items-center justify-center rounded-lg border border-dashed border-gray-300">
                    <AlertCircle size={32} className="mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                        {iframeError
                            ? "Failed to load the URL. Please check the link."
                            : "No URL provided. Please enter a valid link."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default UrlInput;
