
import AdminImportGuide from "@/features/admin/trail-import/AdminImportGuide";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOProvider from "@/components/SEOProvider";

const AdminImportGuidePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="Trail Import Guide - GreenTrails Admin" 
        description="Administrator's guide for managing trail data imports"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <AdminImportGuide />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminImportGuidePage;
