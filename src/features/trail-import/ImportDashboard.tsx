
import React from 'react';
import { ImportStatusCard } from './components/ImportStatusCard';
import { RecoveryActions } from './components/RecoveryActions';
import { JobHistoryTable } from './components/JobHistoryTable';
import { useImportStatus } from './hooks/useImportStatus';
import { useEmergencyRecovery } from './hooks/useEmergencyRecovery';

export const ImportDashboard: React.FC = () => {
  const { progress, recentJobs, loading, refreshData } = useImportStatus();
  const { status: recoveryStatus, executeRecoveryPlan, resetRecovery } = useEmergencyRecovery();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ImportStatusCard progress={progress} onRefresh={refreshData} />
        <RecoveryActions 
          status={recoveryStatus}
          onExecuteRecovery={executeRecoveryPlan}
          onResetRecovery={resetRecovery}
        />
      </div>
      
      <JobHistoryTable jobs={recentJobs} loading={loading} />
    </div>
  );
};
