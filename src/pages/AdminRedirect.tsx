
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

/**
 * This component automatically redirects users to the Admin Trail Import page
 * where the bulk import process will be triggered.
 * Used when accessing the /admin route.
 */
const AdminRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the Admin Trail Import page after a short delay
    const redirectTimer = setTimeout(() => {
      navigate('/admin/trails/import');
    }, 1500);
    
    return () => clearTimeout(redirectTimer);
  }, [navigate]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-green-50 dark:bg-green-900">
      <Loader2 className="h-16 w-16 animate-spin text-green-600 dark:text-green-400 mb-4" />
      <h1 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">
        Redirecting to Admin Dashboard
      </h1>
      <p className="text-green-600 dark:text-green-300">
        You'll be redirected to the trail import dashboard...
      </p>
    </div>
  );
};

export default AdminRedirect;
