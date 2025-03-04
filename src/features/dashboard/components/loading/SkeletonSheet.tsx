export const SkeletonSheet = () => (
  <div className="pt-6">
    <div className="h-8 mb-4 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-4 mb-6 bg-gray-200 rounded animate-pulse"></div>
    <div className="h-px mt-4 mb-8 bg-gray-200"></div>
    <div className="space-y-6">
      <div>
        <div className="w-1/4 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div>
        <div className="w-1/4 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div>
        <div className="w-1/4 h-4 mb-2 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  </div>
);
