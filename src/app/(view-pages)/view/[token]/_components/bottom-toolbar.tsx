"use client";

import { ChevronLeft, ChevronRight, Menu } from 'lucide-react';

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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white/50 shadow-lg rounded-md px-4 py-2 flex items-center gap-4 border border-gray-300 backdrop-blur-lg hover:bg-opacity-100 hover:shadow-2xl transition-all">
      <button
        onClick={onMenuClick}
        className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={handlePrevious}
        disabled={selectedSectionIndex === 0}
        className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50 transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        disabled={selectedSectionIndex === totalSections - 1}
        className="flex items-center text-gray-600 hover:text-blue-600 hover:bg-gray-200 rounded-md p-2 disabled:opacity-50 transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
