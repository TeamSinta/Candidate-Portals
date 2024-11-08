"use client";

import { ChevronLeft, ChevronRight, Menu } from "lucide-react";

type BottomToolbarProps = {
    handlePrevious: () => void;
    handleNext: () => void;
    selectedSectionIndex: number;
    totalSections: number;
    onMenuClick: () => void;
};

export default function BottomToolbar({
    handlePrevious,
    handleNext,
    selectedSectionIndex,
    totalSections,
    onMenuClick,
}: BottomToolbarProps) {
    return (
        <div className="fixed bottom-6 left-1/2 flex -translate-x-1/2 transform items-center gap-4 rounded-md border border-gray-300 bg-white/50 px-4 py-2 shadow-lg backdrop-blur-lg transition-all hover:bg-opacity-100 hover:shadow-2xl">
            <button
                onClick={onMenuClick}
                className="flex items-center rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-600"
            >
                <Menu className="h-5 w-5" />
            </button>
            <button
                onClick={handlePrevious}
                disabled={selectedSectionIndex === 0}
                className="flex items-center rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-600 disabled:opacity-50"
            >
                <ChevronLeft className="h-5 w-5" />
            </button>
            <button
                onClick={handleNext}
                disabled={selectedSectionIndex === totalSections - 1}
                className="flex items-center rounded-md p-2 text-gray-600 transition-colors hover:bg-gray-200 hover:text-blue-600 disabled:opacity-50"
            >
                <ChevronRight className="h-5 w-5" />
            </button>
        </div>
    );
}
