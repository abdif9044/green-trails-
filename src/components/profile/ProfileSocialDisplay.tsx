
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileWithSocial } from '@/types/profiles';
import { Globe, Twitter, Instagram } from 'lucide-react';

interface ProfileSocialDisplayProps {
  profile: ProfileWithSocial;
}

const ProfileSocialDisplay: React.FC<ProfileSocialDisplayProps> = ({ profile }) => {
  const { website_url, twitter_url, instagram_url } = profile;
  
  const hasSocialLinks = website_url || twitter_url || instagram_url;

  if (!hasSocialLinks) {
    return null;
  }

  return (
    <Card className="shadow-md border-greentrail-100 dark:border-greentrail-800">
      <CardContent className="p-4">
        <h3 className="text-base font-medium mb-3 text-greentrail-800 dark:text-greentrail-300">
          Connect
        </h3>
        
        <div className="flex flex-wrap gap-2">
          {website_url && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              asChild
            >
              <a href={website_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Globe className="h-4 w-4 mr-1" />
                Website
              </a>
            </Button>
          )}
          
          {twitter_url && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              asChild
            >
              <a href={twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Twitter className="h-4 w-4 mr-1" />
                Twitter
              </a>
            </Button>
          )}
          
          {instagram_url && (
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
              asChild
            >
              <a href={instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Instagram className="h-4 w-4 mr-1" />
                Instagram
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSocialDisplay;
