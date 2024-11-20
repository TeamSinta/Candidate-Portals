import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PanelRight, Pencil, AlertCircle } from "lucide-react";
import { toast } from "sonner"; // Assuming you're using the 'sonner' toast library
import { updateSectionContent } from "@/server/actions/portal/mutations";
import { SectionContentType } from "@/server/db/schema";

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

  const handleTitleSave = () => {
    onTitleChange(newTitle);
    setIsEditingTitle(false);
  };

  // Save function moved into UrlInput
  const handleSave = async () => {
    try {
      await updateSectionContent({
        id: sectionId,
        portalId: portalId,
        title: newTitle,
        content: { url }, // Assuming content is just the URL for this section
        contentType: SectionContentType.URL,
        index: 0, // Adjust index based on your needs
      });
      toast.success("Section saved successfully");
      setSlidingSidebarOpen(false);
    } catch {
      toast.error("Failed to save section");
    }
  };

  return (
    <div className="flex flex-col space-y-8">
      {/* Header Bar with Title and Buttons */}
      <div className="flex items-center bg-gray-100 p-4 rounded-lg shadow-sm justify-between">
        {/* Title Editing on the Left */}
        <div className="flex items-center space-x-2">
          {isEditingTitle ? (
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onBlur={handleTitleSave}
              className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          ) : (
            <h1
              className="text-xl font-semibold cursor-pointer"
              onClick={() => setIsEditingTitle(true)}
            >
              {title}
            </h1>
          )}
          {editable && !isEditingTitle && (
            <Pencil
              size={20}
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
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
            className="w-[600px] border-gray-300 rounded text-center"
            placeholder="Enter a URL"
          />
        </div>

        {/* Buttons on the Right */}
        <div className="flex items-center space-x-2">
          {/* Publish Button */}
          <Button
            onClick={handleSave}
            variant="outline"
            className="border-indigo-500 hover:bg-indigo-500 hover:text-white text-indigo-600 border-2 rounded"
          >
            Publish
          </Button>

          {/* Close Sidebar Button */}
          <button
            className={`p-2 rounded transition-colors duration-200 ${
              isSlidingSidebarOpen
                ? "bg-gray-200 text-black-600"
                : "hover:bg-gray-200 text-gray-500 hover:text-black-600"
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
          className="w-full h-[80vh] border rounded-lg"
          onError={() => setIframeError(true)}
        ></iframe>
      ) : (
        <div className="flex flex-col items-center justify-center mt-6 h-[80vh] border border-dashed border-gray-300 rounded-lg">
          <AlertCircle size={32} className="text-gray-400 mb-2" />
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
