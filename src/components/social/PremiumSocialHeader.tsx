
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Users, MapPin, Trophy, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

interface PremiumSocialHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const PremiumSocialHeader: React.FC<PremiumSocialHeaderProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden bg-luxury-gradient">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 luxury-pattern opacity-10"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl animate-luxury-pulse"></div>
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-greentrail-500/10 rounded-full blur-3xl animate-luxury-pulse delay-1000"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header Content */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl luxury-heading text-white mb-4">
            Nature's
          </h1>
          <h1 className="text-4xl md:text-6xl luxury-heading bg-gold-gradient bg-clip-text text-transparent mb-6">
            Community
          </h1>
          <p className="text-xl luxury-text text-luxury-200 max-w-2xl mx-auto leading-relaxed">
            Connect with fellow adventurers, share your journey, and discover extraordinary trails together
          </p>
        </div>

        {/* Search and Actions */}
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-8">
            {/* Enhanced Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search trails, adventurers, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-luxury-300 focus:border-gold-500/50 rounded-full"
              />
            </div>
            
            {/* Action Buttons */}
            {user && (
              <div className="flex gap-3">
                <Link to="/create-album">
                  <Button className="gold-button rounded-full">
                    <Plus className="mr-2 h-4 w-4" />
                    Share Adventure
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Social Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-4 rounded-xl">
                <Users className="h-6 w-6 text-gold-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white luxury-text mb-1">12.5K</div>
                <div className="text-sm text-luxury-300 luxury-text">Adventurers</div>
              </div>
            </div>
            <div className="text-center">
              <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-4 rounded-xl">
                <MapPin className="h-6 w-6 text-greentrail-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white luxury-text mb-1">8.2K</div>
                <div className="text-sm text-luxury-300 luxury-text">Trails Shared</div>
              </div>
            </div>
            <div className="text-center">
              <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-4 rounded-xl">
                <Trophy className="h-6 w-6 text-gold-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white luxury-text mb-1">156</div>
                <div className="text-sm text-luxury-300 luxury-text">Challenges</div>
              </div>
            </div>
            <div className="text-center">
              <div className="luxury-card bg-white/5 backdrop-blur-luxury border-white/10 p-4 rounded-xl">
                <Star className="h-6 w-6 text-gold-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white luxury-text mb-1">4.9</div>
                <div className="text-sm text-luxury-300 luxury-text">Community Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSocialHeader;
