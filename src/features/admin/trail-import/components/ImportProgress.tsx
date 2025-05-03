
import React from "react";
import BulkImportProgressCard from "@/components/admin/BulkImportProgressCard";

interface ImportProgressProps {
  activeBulkJobId: string | null;
  bulkProgress: number;
}

const ImportProgress: React.FC<ImportProgressProps> = ({
  activeBulkJobId,
  bulkProgress,
}) => {
  if (!activeBulkJobId) return null;
  
  return (
    <BulkImportProgressCard progress={bulkProgress} />
  );
};

export default ImportProgress;
