
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

const SettingsHeader = () => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Settings
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default SettingsHeader;
