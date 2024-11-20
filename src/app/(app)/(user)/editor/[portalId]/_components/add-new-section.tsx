"use client";

import { useState } from "react";
import { FileText, Link, PlusIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SectionDialogProps {
  maxWidth: string;
  onAddLink: (url: string) => void;
  onCreatePage: (title: string) => void; // New callback for creating a page
}

function AddNewSectionDialog({ maxWidth, onAddLink, onCreatePage }: SectionDialogProps) {
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("New Page"); // Default title for a new page
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveUrl = () => {
    if (url) {
      onAddLink(url);
      setIsAddingLink(false);
      setUrl("");
      setIsDialogOpen(false);
    }
  };

  const handleCreatePage = () => {
    onCreatePage(title); // Call the parent function with the title
    setTitle("New Page"); // Reset the title
    setIsDialogOpen(false);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsAddingLink(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer h-[15rem] max-w-[24rem] min-w-[19rem] ">
          <Card className="flex flex-col overflow-hidden items-center justify-center h-[15rem] max-w-[24rem] rounded-sm shadow-sm border-2 border-dashed border-gray-300 hover:shadow-md transition-transform duration-300 hover:scale-105">
            <div className="flex items-center justify-center bg-gray-100 rounded-t h-full w-full">
              <PlusIcon
                size={32}
                className="text-gray-400 group-hover:text-gray-600 transition-colors duration-300"
              />
            </div>
            <CardContent className="text-center justify-center text-sm text-gray-500 sm:pt-8">
              Add Page
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent className={`rounded-lg ${maxWidth}`}>
        <DialogHeader>
          <DialogTitle>
            <h1 className="text-2xl font-semibold font-heading">Add Section</h1>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-around py-6">
          {isAddingLink ? (
            <div className="w-full">
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Enter the URL
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide the full URL to the resource or documentation you
                want to link to.
              </p>
              <div className="relative w-full">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <Link
                  size={20}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  onClick={() => setIsAddingLink(false)}
                  variant={"outline"}
                  className="text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveUrl}
                  className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition-colors"
                >
                  Save URL
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setIsAddingLink(true)}
              >
                <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 bg-gray-50">
                  <Link size={24} className="text-gray-500 mb-2" />
                  <h3 className="font-semibold text-base">Add Link</h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    Attach an external link.
                  </p>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                  You can add links to external resources or documentation.
                </p>
              </div>

              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={handleCreatePage} // Handle creating a new page
              >
                <div className="flex flex-col items-center justify-center border rounded-lg p-16 hover:shadow-lg transition-shadow duration-300 bg-gray-50">
                  <FileText size={24} className="text-gray-500 mb-2" />
                  <h3 className="font-semibold text-base">Create a Page</h3>
                  <p className="text-sm text-gray-500 text-center mt-1">
                    Create a Notion-like page.
                  </p>
                </div>
                <p className="text-xs text-gray-400 text-center mt-4 max-w-64">
                  Build a fully customizable page for your workspace.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSectionDialog;
