import { useState } from 'react';
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
  const [isActive, setIsActive] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      className={`
        fixed bottom-6 left-1/2 transform -translate-x-1/2
        flex items-center gap-4 w-full max-w-md px-4 py-2 rounded-full
        border border-gray-300 backdrop-blur-lg transition-all duration-300 ease-in-out
        ${isActive ? 'bg-white shadow-lg' : 'bg-white/30'}
      `}
    >
      <button
        onClick={onMenuClick}
        className="flex items-center text-gray-600 hover:text-blue-600 rounded-full p-2 transition-all"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={handlePrevious}
        disabled={selectedSectionIndex === 0}
        className="flex items-center text-gray-600 hover:text-blue-600 rounded-full p-2 disabled:opacity-50 transition-all"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={handleNext}
        disabled={selectedSectionIndex === totalSections - 1}
        className="flex items-center text-gray-600 hover:text-blue-600 rounded-full p-2 disabled:opacity-50 transition-all"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
