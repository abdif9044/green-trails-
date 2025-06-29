
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SEOProvider from '@/components/SEOProvider';
import MinnesotaDenverImport from '@/components/trails/MinnesotaDenverImport';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TreePine, Mountain, Zap } from 'lucide-react';

const MinnesotaDenverImportPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider 
        title="666 Trails Import - Minnesota & Denver - GreenTrails"
        description="Import exactly 666 trails from Minnesota and Denver areas using production API keys"
      />
      
      <Navbar />
      
      <div className="flex-grow bg-slate-50 dark:bg-greentrail-950 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-4">
              666 Trails Import
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Precisely import 666 trails from Minnesota and Denver areas using production API keys and targeted geographic selection
            </p>
          </div>

          {/* Import Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <TreePine className="h-5 w-5 text-green-600" />
                  Minnesota Trails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">333</div>
                <CardDescription>
                  From Minneapolis metro, Boundary Waters, and state parks
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Mountain className="h-5 w-5 text-blue-600" />
                  Denver Trails
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">333</div>
                <CardDescription>
                  From Rocky Mountain National Park and Front Range
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-greentrail-600" />
                  Total Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-greentrail-600 mb-2">666</div>
                <CardDescription>
                  Exactly 666 trails with production API integration
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Main Import Component */}
          <MinnesotaDenverImport />

          {/* Additional Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Import Details</CardTitle>
              <CardDescription>
                Technical specifications for the 666 trails import
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 text-green-700">Minnesota Sources</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Minnesota DNR Trail Database</li>
                    <li>• Superior Hiking Trail Association</li>
                    <li>• Twin Cities Metro Trails</li>
                    <li>• Boundary Waters trail data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-3 text-blue-700">Denver/Colorado Sources</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Colorado Trail Database</li>
                    <li>• Rocky Mountain National Park</li>
                    <li>• Front Range trail systems</li>
                    <li>• Denver Mountain Parks</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default MinnesotaDenverImportPage;
