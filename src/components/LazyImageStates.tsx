
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { isValidImageSource } from "@/utils/image-validators";

interface LazyImageStatesProps {
  isLoaded: boolean;
  hasError: boolean;
  src: string;
}

export const LazyImageStates: React.FC<LazyImageStatesProps> = ({
  isLoaded,
  hasError,
  src
}) => {
  return (
    <>
      {!isLoaded && <Skeleton className="absolute inset-0" />}
      
      {(hasError || !isValidImageSource(src)) && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
        </div>
      )}
    </>
  );
};
