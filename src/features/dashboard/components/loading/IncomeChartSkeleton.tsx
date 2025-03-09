import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const IncomeChartSkeleton = () => {
  return (
    <div className="h-[500px] w-full">
      {/* Y-axis skeleton */}
      <div className="absolute top-0 bottom-0 left-0 flex flex-col justify-between w-16 py-6">
        <Skeleton className="w-12 h-4" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="w-10 h-4" />
        <Skeleton className="w-16 h-4" />
        <Skeleton className="w-12 h-4" />
      </div>
      
      {/* Chart area skeleton */}
      <div className="flex flex-col justify-end w-full h-full pl-16">
        {/* Area chart skeleton with gradient */}
        <div className="relative w-full overflow-hidden rounded-md h-3/4">
          <div 
            className="absolute inset-0 bg-gradient-to-t from-orange-100 to-transparent"
            style={{ clipPath: "polygon(0 100%, 5% 85%, 10% 70%, 15% 80%, 20% 60%, 25% 65%, 30% 45%, 35% 60%, 40% 30%, 45% 40%, 50% 20%, 55% 30%, 60% 45%, 65% 35%, 70% 50%, 75% 45%, 80% 55%, 85% 40%, 90% 60%, 95% 50%, 100% 30%, 100% 100%, 0 100%)" }}
          />
          <div 
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-orange-400"
            style={{ clipPath: "polygon(0 100%, 5% 85%, 10% 70%, 15% 80%, 20% 60%, 25% 65%, 30% 45%, 35% 60%, 40% 30%, 45% 40%, 50% 20%, 55% 30%, 60% 45%, 65% 35%, 70% 50%, 75% 45%, 80% 55%, 85% 40%, 90% 60%, 95% 50%, 100% 30%, 100% 100%, 0 100%)" }}
          />
        </div>
        
        {/* X-axis skeleton */}
        <div className="flex items-center justify-between h-10 mt-2">
          {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
            <Skeleton key={index} className="w-12 h-4" />
          ))}
        </div>
      </div>
      
      {/* Horizontal grid lines */}
      <div className="absolute top-0 right-0 flex flex-col justify-between pointer-events-none left-16 bottom-10">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div 
            key={index} 
            className="w-full h-[1px] bg-gray-200"
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeChartSkeleton;