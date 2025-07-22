import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Download, Star, Apple, PlayCircle, X } from 'lucide-react';

const AppInstallPrompt: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handlePWAInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const result = await installPrompt.userChoice;
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
        setIsVisible(false);
      }
    }
  };

  const handleAppStoreRedirect = (store: 'ios' | 'android') => {
    // In production, these would be actual app store URLs
    const urls = {
      ios: 'https://apps.apple.com/app/greentrails',
      android: 'https://play.google.com/store/apps/details?id=com.greentrails.app'
    };
    window.open(urls[store], '_blank');
  };

  if (!isVisible) return null;

  return (
    <Card className="w-full bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
      >
        <X className="w-4 h-4" />
      </Button>

      <CardContent className="p-6 relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1">
                Get the GreenTrails Mobile App
              </h3>
              <p className="text-sm text-muted-foreground">
                Access offline maps, GPS tracking, and exclusive mobile features. Available on all platforms.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-500/10 text-yellow-700 border-yellow-200">
                <Star className="w-3 h-3 mr-1 fill-current" />
                4.8 Rating
              </Badge>
              <Badge variant="secondary">
                <Download className="w-3 h-3 mr-1" />
                100K+ Downloads
              </Badge>
              <Badge variant="outline">
                Free
              </Badge>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {installPrompt && (
                <Button 
                  onClick={handlePWAInstall}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install App
                </Button>
              )}
              
              <Button 
                variant="outline"
                onClick={() => handleAppStoreRedirect('ios')}
                className="flex items-center gap-2"
              >
                <Apple className="w-4 h-4" />
                App Store
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => handleAppStoreRedirect('android')}
                className="flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4" />
                Google Play
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-primary/20">
              <div className="text-center">
                <div className="font-semibold text-sm text-primary">Offline Maps</div>
                <div className="text-xs text-muted-foreground">No signal? No problem</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-primary">GPS Tracking</div>
                <div className="text-xs text-muted-foreground">Real-time location</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-sm text-primary">Safety Features</div>
                <div className="text-xs text-muted-foreground">Emergency SOS</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppInstallPrompt;