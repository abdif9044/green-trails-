
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, CloudSun, Shield, Clock, Shirt, Loader2 } from 'lucide-react';
import { useWeatherProphet } from '@/hooks/use-weather-prophet';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherProphetProps {
  coordinates: [number, number];
  trailData?: {
    name?: string;
    difficulty?: string;
    elevation?: number;
    length?: number;
  };
  className?: string;
}

const WeatherProphet: React.FC<WeatherProphetProps> = ({ 
  coordinates, 
  trailData,
  className = ''
}) => {
  const [activeAnalysis, setActiveAnalysis] = useState<'comprehensive' | 'safety' | 'optimal_timing' | 'gear_recommendations'>('comprehensive');
  
  const { 
    data: prophetData, 
    isLoading, 
    error, 
    refetch 
  } = useWeatherProphet(coordinates, trailData, activeAnalysis);

  const handleAnalysisChange = (type: typeof activeAnalysis) => {
    setActiveAnalysis(type);
  };

  const formatAnalysis = (analysis: string) => {
    // Simple formatting to make the AI response more readable
    return analysis.split('\n').map((line, index) => {
      if (line.trim().startsWith('##') || line.trim().startsWith('**')) {
        return <h3 key={index} className="font-semibold text-lg mt-4 mb-2 text-greentrail-700">{line.replace(/[#*]/g, '')}</h3>;
      }
      if (line.trim().startsWith('-') || line.trim().startsWith('•')) {
        return <li key={index} className="ml-4 mb-1">{line.replace(/^[-•]\s*/, '')}</li>;
      }
      if (line.trim()) {
        return <p key={index} className="mb-2">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2 mb-2">
          <Brain className="h-6 w-6 text-purple-600" />
          <CardTitle className="text-xl">AI Weather Prophet</CardTitle>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Powered by AI
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm">
          Intelligent weather analysis and hiking recommendations
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeAnalysis} onValueChange={handleAnalysisChange}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="comprehensive" className="text-xs">
              <CloudSun className="h-4 w-4 mr-1" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="safety" className="text-xs">
              <Shield className="h-4 w-4 mr-1" />
              Safety
            </TabsTrigger>
            <TabsTrigger value="optimal_timing" className="text-xs">
              <Clock className="h-4 w-4 mr-1" />
              Timing
            </TabsTrigger>
            <TabsTrigger value="gear_recommendations" className="text-xs">
              <Shirt className="h-4 w-4 mr-1" />
              Gear
            </TabsTrigger>
          </TabsList>

          <div className="mt-4">
            {isLoading && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing weather patterns with AI...
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            )}

            {error && (
              <div className="text-center py-6">
                <p className="text-red-600 mb-4">Failed to get weather analysis</p>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            )}

            {prophetData && !isLoading && (
              <TabsContent value={activeAnalysis} className="mt-0">
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border">
                    {formatAnalysis(prophetData.analysis)}
                  </div>
                  
                  <div className="mt-4 text-xs text-muted-foreground">
                    Analysis generated at {new Date(prophetData.timestamp).toLocaleString()}
                  </div>
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>

        {prophetData && !isLoading && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              onClick={() => refetch()} 
              variant="outline" 
              size="sm"
              className="w-full"
            >
              <Brain className="h-4 w-4 mr-2" />
              Refresh Analysis
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherProphet;
