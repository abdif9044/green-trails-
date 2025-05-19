
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BadgesList } from "@/components/badges/BadgesList";
import { useAuth } from '@/hooks/use-auth';
import { useBadges } from '@/hooks/use-badges';
import { Skeleton } from '@/components/ui/skeleton';
import SEOProvider from '@/components/SEOProvider';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Badges = () => {
  const { user } = useAuth();
  const { badges, loading } = useBadges();

  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(badge => badge.unlocked).length;
  const progressPercentage = totalBadges > 0 
    ? Math.round((unlockedBadges / totalBadges) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <SEOProvider
        title="My Achievements - GreenTrails"
        description="View your earned badges and achievements from hiking with GreenTrails."
        type="website"
      />
      
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-6 lg:py-8">
        <div className="mb-6">
          <Button variant="outline" asChild className="mb-4">
            <Link to="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Link>
          </Button>
          
          <h1 className="text-3xl font-bold text-greentrail-800 dark:text-greentrail-200 mb-2">
            My Achievements
          </h1>
          
          <div className="flex items-baseline justify-between">
            <p className="text-muted-foreground">
              Collect badges as you explore trails and reach milestones
            </p>
            
            {!loading && (
              <p className="text-sm font-medium">
                {unlockedBadges} of {totalBadges} badges earned ({progressPercentage}%)
              </p>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-28 w-full" />
              ))}
            </div>
          </div>
        ) : (
          <BadgesList badges={badges} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Badges;
