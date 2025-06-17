
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import TrailImportRecovery from '@/components/admin/TrailImportRecovery';

const TrailRecovery: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="Trail Import Recovery - GreenTrails"
        description="Diagnose and fix trail import issues"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Trail Import Recovery</h1>
            <p className="text-muted-foreground">
              Diagnose import failures and bootstrap your trail database
            </p>
          </div>

          <TrailImportRecovery />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TrailRecovery;
