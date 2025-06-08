
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/providers/theme-provider';
import { useToast } from '@/hooks/use-toast';
import { Globe, Bell, Shield, MapPin } from 'lucide-react';

const AppSettings = () => {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);
  const [dataUsage, setDataUsage] = useState('wifi');
  const [language, setLanguage] = useState('en');
  const [units, setUnits] = useState('metric');

  const handleSettingChange = (setting: string, value: any) => {
    toast({
      title: "Settings updated",
      description: `${setting} has been updated`
    });
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Appearance & Language
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={(value) => {
              setLanguage(value);
              handleSettingChange('Language', value);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="units">Units</Label>
            <Select value={units} onValueChange={(value) => {
              setUnits(value);
              handleSettingChange('Units', value);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric</SelectItem>
                <SelectItem value="imperial">Imperial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">Push Notifications</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={(checked) => {
                setNotifications(checked);
                handleSettingChange('Notifications', checked ? 'enabled' : 'disabled');
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="location-sharing">Share Location</Label>
            <Switch
              id="location-sharing"
              checked={locationSharing}
              onCheckedChange={(checked) => {
                setLocationSharing(checked);
                handleSettingChange('Location Sharing', checked ? 'enabled' : 'disabled');
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="data-usage">Data Usage</Label>
            <Select value={dataUsage} onValueChange={(value) => {
              setDataUsage(value);
              handleSettingChange('Data Usage', value);
            }}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wifi">WiFi Only</SelectItem>
                <SelectItem value="always">Always</SelectItem>
                <SelectItem value="reduced">Reduced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppSettings;
