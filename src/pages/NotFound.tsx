
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPin, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const isTrailRoute = location.pathname.startsWith('/trail/');
  const trailId = isTrailRoute ? location.pathname.split('/trail/')[1] : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-greentrail-50 to-white dark:from-greentrail-950 dark:to-gray-900">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="text-8xl mb-6">🗺️</div>
        
        <h1 className="text-4xl font-bold mb-4 text-greentrail-800 dark:text-greentrail-200">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
          Trail Not Found
        </h2>
        
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isTrailRoute ? (
            <>
              The trail you're looking for doesn't exist or may have been removed. 
              {trailId && (
                <span className="block mt-2 text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                  Trail ID: {trailId}
                </span>
              )}
            </>
          ) : (
            "Oops! The page you're looking for doesn't exist. Let's get you back on the right trail."
          )}
        </p>
        
        <div className="space-y-3">
          <Link to="/discover">
            <Button className="w-full bg-greentrail-600 hover:bg-greentrail-700">
              <Search className="mr-2 h-4 w-4" />
              Discover Trails
            </Button>
          </Link>
          
          <Link to="/">
            <Button variant="outline" className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Try browsing our featured trails or use the search function.</p>
        </div>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-6 p-3 bg-red-50 dark:bg-red-900/20 rounded border text-left">
            <strong className="text-red-700 dark:text-red-400">Debug Info:</strong>
            <div className="text-xs mt-1 text-red-600 dark:text-red-300">
              <div>Route: {location.pathname}</div>
              <div>Search: {location.search}</div>
              <div>Hash: {location.hash}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotFound;
