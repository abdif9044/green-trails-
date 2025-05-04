
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mountain, TrendingUp } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface TrailElevationProfileProps {
  trailId: string;
  geojson?: any;
  elevation?: number;
  elevationGain?: number;
}

interface ElevationPoint {
  distance: number;
  elevation: number;
}

const TrailElevationProfile: React.FC<TrailElevationProfileProps> = ({
  trailId,
  geojson,
  elevation = 0,
  elevationGain = 0
}) => {
  const [elevationData, setElevationData] = useState<ElevationPoint[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const processGeoJson = async () => {
      if (!geojson) {
        // Generate sample data if no GeoJSON
        generateSampleElevationData();
        return;
      }
      
      setLoading(true);
      
      try {
        // In a real implementation, we would extract coordinates from GeoJSON
        // and fetch elevation data from a service or compute it from the GeoJSON
        
        // For now, we'll generate some data based on the provided elevation metrics
        generateSampleElevationData();
      } catch (error) {
        console.error('Error processing trail elevation data:', error);
        generateSampleElevationData();
      } finally {
        setLoading(false);
      }
    };
    
    processGeoJson();
  }, [trailId, geojson, elevation, elevationGain]);
  
  // Generate sample data based on available metrics
  const generateSampleElevationData = () => {
    const baseElevation = elevation || 100;
    const totalGain = elevationGain || 50;
    const pointCount = 20;
    
    const data: ElevationPoint[] = [];
    
    // Create a natural-looking elevation profile
    for (let i = 0; i < pointCount; i++) {
      const progress = i / (pointCount - 1);
      // Create a curve with a peak around 60-80% of the way
      const elevationFactor = Math.sin(progress * Math.PI) * 0.7 + Math.sin(progress * Math.PI * 2) * 0.3;
      
      data.push({
        distance: parseFloat((progress * 100).toFixed(1)),
        elevation: parseFloat((baseElevation + elevationFactor * totalGain).toFixed(1))
      });
    }
    
    setElevationData(data);
  };
  
  // Format distance for tooltip
  const formatDistance = (distance: number) => {
    return `${distance}%`;
  };
  
  // Format elevation for tooltip
  const formatElevation = (elevation: number) => {
    return `${elevation} m`;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Mountain className="h-5 w-5 text-greentrail-600" />
          <span>Elevation Profile</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-pulse text-gray-500">Loading elevation data...</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Elevation</p>
                <p className="text-lg font-semibold">{elevation} m</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-xs text-muted-foreground">Gain</p>
                <p className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1 text-greentrail-500" /> 
                  {elevationGain} m
                </p>
              </div>
            </div>
            
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={elevationData}
                  margin={{
                    top: 5,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="distance" 
                    tickFormatter={formatDistance}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#E0E0E0' }}
                  />
                  <YAxis 
                    domain={['dataMin - 10', 'dataMax + 10']} 
                    tickFormatter={formatElevation}
                    tick={{ fontSize: 12 }}
                    axisLine={{ stroke: '#E0E0E0' }}
                  />
                  <Tooltip 
                    formatter={(value) => [`${value} m`, 'Elevation']}
                    labelFormatter={(label) => `Distance: ${label}%`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="elevation" 
                    stroke="#4CAF50" 
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TrailElevationProfile;
