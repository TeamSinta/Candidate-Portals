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
import { Input } from "@/components/ui/input"; // Import your Input component
import { Button } from "@/components/ui/button"; // Import your Button component

interface SectionDialogProps {
  maxWidth: string;
  onAddLink: (url: string) => void; // Callback function to send the URL to the parent
}

function AddNewSectionDialog({ maxWidth, onAddLink }: SectionDialogProps) {
  const [isAddingLink, setIsAddingLink] = useState(false); // State to toggle the view
  const [url, setUrl] = useState(""); // State to store the URL
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage the dialog open/close

  // Function to handle saving the URL and sending it to the parent
  const handleSaveUrl = () => {
    if (url) {
      onAddLink(url); // Call the parent function with the URL
      // Reset the view and URL
      setIsAddingLink(false);
      setUrl("");
      setIsDialogOpen(false); // Close the dialog
    }
  };

  // Reset to initial state when the dialog is closed
  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setIsAddingLink(false); // Reset to the initial state
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <div className="relative group cursor-pointer w-full h-full">
          <Card className="flex flex-col items-center justify-center h-[15rem] max-w-[24rem] rounded-sm shadow-sm border-2 border-dashed border-gray-300 hover:shadow-md transition-transform duration-300 hover:scale-105">
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
            <h1 className="text-2xl font-semibold font-heading">Add Page</h1>
          </DialogTitle>
        </DialogHeader>
        <div className="flex justify-around py-6">
          {/* Conditional Rendering Based on isAddingLink */}
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
                  className="text-gray-600 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 "
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
              {/* Box 1: Link */}
              <div
                className="flex flex-col items-center cursor-pointer"
                onClick={() => setIsAddingLink(true)} // Set the state to show the input
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
              {/* Box 2: Custom Page */}
              <div className="flex flex-col items-center">
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
