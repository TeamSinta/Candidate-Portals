// app/view/[token]/PortalContent.tsx

"use client";

import React, { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { HelpCircle, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Sintalogo from "../../../../../../public/SintaLogoCircle.png";
import Image from "next/image";

type Section = {
  id: string;
  title: string;
  content: any;
};

type PortalContentProps = {
  sections: Section[];
};

export default function PortalContent({ sections }: PortalContentProps) {
  const [selectedSection, setSelectedSection] = useState(sections[0]);
  const { setTheme, theme } = useTheme();

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
  };

  const getRandomIcon = () => {
    const icons = [<Sun />, <Moon />, <HelpCircle />, <Sun />];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div className="px-4 py-2 text-lg font-bold">Portal Sections</div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {sections.map((section) => (
                <SidebarMenuItem key={section.id}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => handleSectionSelect(section)}
                      className="flex items-center gap-2 font-semibold"
                    >
                      {getRandomIcon()}
                      {section.title}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
              <HelpCircle className="h-5 w-5" />
              Help & Getting Started
            </button>
            <span className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 px-2 py-0.5 rounded-full">
              8
            </span>
          </div>

          <div className="flex items-center justify-center mt-4 w-full">
            <div className="relative flex items-center w-full h-8 bg-gray-200 dark:bg-gray-800 rounded-full p-1">
              <button
                onClick={() => setTheme("light")}
                className="flex items-center justify-center w-full h-full rounded-full transition-all duration-300"
              >
                <Sun className={`h-5 w-5 ${theme === "light" ? "text-yellow-500" : "text-gray-500"}`} />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className="flex items-center justify-center w-full h-full rounded-full transition-all duration-300"
              >
                <Moon className={`h-5 w-5 ${theme === "dark" ? "text-purple-500" : "text-gray-500"}`} />
              </button>

              {/* Toggle Indicator */}
              <div
                className={`absolute top-0.5 bottom-0.5 left-0.5 w-1/2 h-7 rounded-full bg-white dark:bg-gray-600 shadow-md transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-full" : ""
                }`}
              />
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <div>
        <header className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {/* Left side: Logo and Brand */}
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-semibold">Sinta Candidate Portals - MVP</span>
            </div>

            {/* Right side: Icon and Action Buttons */}
            <div className="flex items-center gap-2">
              <button className="flex items-center px-2 py-1 text-xs text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 gap-1">
                Made with
                <div className="flex items-center">
                  <Image src={Sintalogo} alt="Brand Logo" className="h-3 w-3 mr-1" /> {/* Replace with actual logo path */}
                  <span className="font-medium">Sinta</span>
                </div>
              </button>
            </div>
          </header>


          <div className="flex flex-1 flex-col gap-4 p-4">
            <div>
              <h1 className="text-lg font-bold">{selectedSection.title}</h1>
              <p>
                {typeof selectedSection.content === "object" && "text" in selectedSection.content
                  ? selectedSection.content.text
                  : selectedSection.content}
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </>
  );
}
