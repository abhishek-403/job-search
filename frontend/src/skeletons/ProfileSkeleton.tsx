import { cn } from "@/lib/utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const ProfileCustomSkeleton = () => {
  return (
    <div className="w-[90%] md:w-full md:max-w-4xl mt-8 rounded-lg  min-h-[88vh] mx-auto bg-neutral-90 p-4 mb-4 border ">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 my-auto">
          <div className="rounded-full">
            <CustomSkeleton circle={true} width={52} height={52} />
          </div>
          <div className="my-auto">
            <CustomSkeleton width={120} height={20} />
            <CustomSkeleton width={100} height={12} />
          </div>
        </div>
        <div className="flex items-center">
          <CustomSkeleton width={80} height={36} />
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <CustomSkeleton width={100} height={30} />
        <CustomSkeleton width={100} height={30} />
      </div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
        <div>
          <div className="mb-4">
            <label className="block text-sm font- rounded-none text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
        </div>
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-80 mb-1">
              <CustomSkeleton width={80} />
            </label>
            <div className="border border-neutral-85 rounded-md p-2">
              <CustomSkeleton width="100%" height={40} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <CustomSkeleton width={150} height={40} />
        <CustomSkeleton width={150} height={40} />
      </div>
    </div>
  );
};

export function CustomSkeleton({
  count,
  height,
  width,
  className,
  circle,
}: {
  count?: number;
  height?: number | string;
  width?: number | string;
  className?: string;
  circle?: boolean;
}) {
  return (
    <Skeleton
      circle={circle}
      count={count}
      height={height}
      width={width}
      baseColor="#212121"
      highlightColor="#313131"
      className={cn("rounded-sm", className)}
    />
  );
}

export default ProfileCustomSkeleton;
