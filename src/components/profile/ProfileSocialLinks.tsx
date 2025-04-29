
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileWithSocial } from '@/types/profiles';
import { useUpdateProfile } from '@/hooks/use-profile';
import { Link, Globe, Twitter, Instagram } from 'lucide-react';

interface ProfileSocialLinksProps {
  profile: ProfileWithSocial;
}

const ProfileSocialLinks: React.FC<ProfileSocialLinksProps> = ({ profile }) => {
  const [websiteUrl, setWebsiteUrl] = useState(profile.website_url || '');
  const [twitterUrl, setTwitterUrl] = useState(profile.twitter_url || '');
  const [instagramUrl, setInstagramUrl] = useState(profile.instagram_url || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateProfile = useUpdateProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile.mutateAsync({
        website_url: websiteUrl || null,
        twitter_url: twitterUrl || null,
        instagram_url: instagramUrl || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="shadow-md border-greentrail-100 dark:border-greentrail-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-greentrail-800 dark:text-greentrail-300 flex items-center gap-2">
          <Link className="h-5 w-5" />
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="https://yourwebsite.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="font-normal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter" className="flex items-center gap-2">
              <Twitter className="h-4 w-4" />
              Twitter
            </Label>
            <Input
              id="twitter"
              placeholder="https://twitter.com/username"
              value={twitterUrl}
              onChange={(e) => setTwitterUrl(e.target.value)}
              className="font-normal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              Instagram
            </Label>
            <Input
              id="instagram"
              placeholder="https://instagram.com/username"
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="font-normal"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting || updateProfile.isPending}
            className="w-full bg-greentrail-600 hover:bg-greentrail-700"
          >
            Save Social Links
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileSocialLinks;
