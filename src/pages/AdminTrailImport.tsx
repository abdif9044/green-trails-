
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import MassiveImportButton from '@/components/trails/MassiveImportButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Database, Users, Zap } from 'lucide-react';

const AdminTrailImport: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <SEOProvider 
        title="Trail Data Import - GreenTrails Admin"
        description="Import massive trail datasets to build the ultimate hiking database"
      />
      
      <Navbar />
      
      <div className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
              Trail Data Import Center
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Build the most comprehensive trail database with real data from multiple trusted sources
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card>
              <CardHeader className="text-center">
                <MapPin className="h-8 w-8 text-greentrail-600 mx-auto mb-2" />
                <CardTitle className="text-lg">50K+ Trails</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Import over 50,000 real trails from verified sources
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Database className="h-8 w-8 text-greentrail-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Multiple Sources</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Hiking Project, OpenStreetMap, and USGS data integration
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-8 w-8 text-greentrail-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Real Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  Trails with existing ratings, photos, and community data
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Zap className="h-8 w-8 text-greentrail-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Instant Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  One-click import with automatic data normalization
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Import Component */}
          <div className="flex justify-center">
            <MassiveImportButton />
          </div>

          {/* Information Section */}
          <div className="mt-12 max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>What gets imported?</CardTitle>
                <CardDescription>
                  Details about the trail data that will be added to your database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-greentrail-700 mb-2">Hiking Project</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Detailed trail descriptions</li>
                      <li>• Difficulty ratings</li>
                      <li>• Length and elevation data</li>
                      <li>• Community photos</li>
                      <li>• User ratings and reviews</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-greentrail-700 mb-2">OpenStreetMap</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Precise GPS coordinates</li>
                      <li>• Trail surface types</li>
                      <li>• Access restrictions</li>
                      <li>• Trail conditions</li>
                      <li>• Network connectivity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-greentrail-700 mb-2">USGS/NPS</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• National park trails</li>
                      <li>• Official trail names</li>
                      <li>• Park information</li>
                      <li>• Safety guidelines</li>
                      <li>• Seasonal access</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminTrailImport;
