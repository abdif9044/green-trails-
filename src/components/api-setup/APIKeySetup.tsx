
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface APIKeySetupProps {
  onKeysConfigured: () => void;
}

export const APIKeySetup: React.FC<APIKeySetupProps> = ({ onKeysConfigured }) => {
  const [apiKeys, setApiKeys] = useState({
    hikingProject: '',
    openWeather: '',
    mapbox: ''
  });
  const [loading, setLoading] = useState(false);
  const [keyStatus, setKeyStatus] = useState({
    hikingProject: false,
    openWeather: false,
    mapbox: false
  });
  const { toast } = useToast();

  useEffect(() => {
    checkExistingKeys();
  }, []);

  const checkExistingKeys = async () => {
    try {
      // Check if keys are already configured in Supabase secrets
      const { data, error } = await supabase.functions.invoke('check-api-keys');
      if (!error && data) {
        setKeyStatus(data);
        if (data.hikingProject && data.openWeather && data.mapbox) {
          onKeysConfigured();
        }
      }
    } catch (error) {
      console.log('API keys not yet configured');
    }
  };

  const handleSaveKeys = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('save-api-keys', {
        body: apiKeys
      });

      if (error) throw error;

      toast({
        title: "API keys saved",
        description: "External API integrations are now configured for trail data import.",
      });

      await checkExistingKeys();
      onKeysConfigured();
    } catch (error) {
      console.error('Error saving API keys:', error);
      toast({
        title: "Failed to save API keys",
        description: "Please check your keys and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (keyStatus.hikingProject && keyStatus.openWeather && keyStatus.mapbox) {
    return (
      <Card className="mb-6 border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="font-medium text-green-800">
              API integrations configured successfully
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-orange-500" />
          Configure API Keys for Production Data
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground mb-4">
          To import real trail data from external sources, please configure these API keys:
        </p>

        <div className="space-y-4">
          <div>
            <Label htmlFor="hiking-project">Hiking Project API Key</Label>
            <Input
              id="hiking-project"
              type="password"
              placeholder="Enter your Hiking Project API key"
              value={apiKeys.hikingProject}
              onChange={(e) => setApiKeys(prev => ({ ...prev, hikingProject: e.target.value }))}
            />
            <a
              href="https://www.hikingproject.com/data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              Get API key <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <Label htmlFor="openweather">OpenWeather API Key</Label>
            <Input
              id="openweather"
              type="password"
              placeholder="Enter your OpenWeather API key"
              value={apiKeys.openWeather}
              onChange={(e) => setApiKeys(prev => ({ ...prev, openWeather: e.target.value }))}
            />
            <a
              href="https://openweathermap.org/api"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              Get API key <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div>
            <Label htmlFor="mapbox">Mapbox Access Token</Label>
            <Input
              id="mapbox"
              type="password"
              placeholder="Enter your Mapbox access token"
              value={apiKeys.mapbox}
              onChange={(e) => setApiKeys(prev => ({ ...prev, mapbox: e.target.value }))}
            />
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1"
            >
              Get access token <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        <Button
          onClick={handleSaveKeys}
          disabled={loading || !apiKeys.hikingProject || !apiKeys.openWeather || !apiKeys.mapbox}
          className="w-full"
        >
          {loading ? 'Saving...' : 'Configure API Keys'}
        </Button>
      </CardContent>
    </Card>
  );
};
