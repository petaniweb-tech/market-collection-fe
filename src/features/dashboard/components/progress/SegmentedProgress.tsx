import { BarChart3, CircleDotDashed } from "lucide-react";
import React from "react";

interface SegmentedProgressProps {
  total: number;
  current: number;
  segments?: number;
  className?: string;
  percentage?: number;
}

const SegmentedProgress = ({
  total,
  current,
  segments = 36,
  className = "",
  percentage = Math.min(100, Math.max(0, (current / total) * 100))
}: SegmentedProgressProps) => {
  // Calculate percentage for visual display
  // const percentage = Math.min(100, Math.max(0, (current / total) * 100));

  // Calculate how many segments should be filled
  const filledSegments = Math.round((percentage / 100) * segments);

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center">
        <div className="flex mb-10 mr-20">
          <div className="p-5 mr-7 text-sm text-white bg-gradient-to-b from-[#FE8300] to-[#ED3400] rounded-xl">
            <BarChart3 className="w-10 h-10" />
          </div>
          <div className="flex flex-col text-5xl font-semibold">
            <span className="mb-2 text-sm font-medium text-[#5B5B5B]">
              Statistik Target Harian
            </span>
            {formatNumber(total)}
          </div>
        </div>

        <div className="flex mb-10">
          <div className="p-5 mr-7 text-sm text-white bg-gradient-to-b from-[#FE8300] to-[#ED3400] rounded-xl">
            <CircleDotDashed className="w-10 h-10" />
          </div>
          <div className="flex flex-col text-5xl font-semibold">
            <span className="mb-2 text-sm font-medium text-[#5B5B5B]">Pendapatan saat ini</span>
            {formatNumber(current)}
          </div>
        </div>
      </div>

      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, index) => (
          <div
            key={index}
            className={`h-10 flex-1 rounded-full transition-all duration-300 ${
              index < filledSegments
                ? getSegmentColor(index, segments)
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Helper function to determine segment color based on position
const getSegmentColor = (index: number, totalSegments: number) => {
  const position = index / totalSegments;

  if (position < 0.3) {
    return "bg-red-400";
  } else if (position < 0.6) {
    return "bg-yellow-400";
  } else {
    return "bg-green-400";
  }
};

export default SegmentedProgress;
