import { Skeleton } from "@/components/ui/skeleton";

export const SkeletonRow = () => (
    <tr>
      <td className="px-6 py-4"><Skeleton className="w-8 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-32 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="h-4 w-28" /></td>
      <td className="px-6 py-4"><Skeleton className="w-40 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-24 h-4" /></td>
      <td className="px-6 py-4"><Skeleton className="w-32 h-6 rounded-full" /></td>
    </tr>
  );