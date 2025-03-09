import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface TopEarnersSkeletonProps {
  count?: number;
}

const TopEarnersSkeleton: React.FC<TopEarnersSkeletonProps> = ({ 
  count = 5 
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="grid items-center grid-cols-10 gap-4 p-4 mb-3 bg-white rounded-2xl animate-pulse"
        >
          {/* Number column */}
          <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-xl">
            <Skeleton className="w-5 h-5" />
          </div>
          
          {/* Location column */}
          <div className="col-span-2">
            <Skeleton className="w-full h-8 rounded-lg" />
          </div>
          
          {/* Merchant count column */}
          <div className="col-span-2">
            <Skeleton className="w-full h-8 rounded-lg" />
          </div>
          
          {/* Expected amount column */}
          <div className="col-span-3">
            <Skeleton className="w-full h-8 rounded-lg" />
          </div>
          
          {/* Percentage column */}
          <div className="col-span-2">
            <Skeleton className="w-full h-8 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
};

export default TopEarnersSkeleton;