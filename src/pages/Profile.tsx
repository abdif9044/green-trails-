
import React from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Heart, Image, Compass, User } from "lucide-react";
import { Link } from 'react-router-dom';

const Profile = () => {
  // This is a dummy profile - to be replaced with Supabase auth user data later
  const profile = {
    id: "user123",
    username: "trailblazer",
    name: "Alex Johnson",
    bio: "Outdoor enthusiast, cannabis advocate, and photography lover. Always seeking new trails and adventures.",
    location: "Denver, CO",
    joinDate: "November 2023",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    stats: {
      trails: 47,
      followers: 312,
      following: 128
    }
  };
  
  // Dummy recent activity - to be replaced with Supabase data later
  const recentActivity = [
    {
      id: "act1",
      type: "trail-completed",
      trailId: "trail123",
      trailName: "Emerald Forest Loop",
      date: "2 days ago"
    },
    {
      id: "act2",
      type: "photo-upload",
      trailId: "trail456",
      trailName: "Mountain Creek Trail",
      count: 5,
      date: "1 week ago"
    },
    {
      id: "act3",
      type: "review",
      trailId: "trail789",
      trailName: "Sunrise Mountain Trail",
      rating: 4.5,
      date: "2 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-greentrail-50 dark:bg-greentrail-950 pt-6 pb-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <div className="bg-white dark:bg-greentrail-900 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="h-32 bg-gradient-to-r from-greentrail-600 to-greentrail-400"></div>
            <div className="px-6 pb-6">
              <div className="flex flex-col md:flex-row md:items-end -mt-16 mb-4">
                <Avatar className="h-24 w-24 border-4 border-white dark:border-greentrail-900 shadow-md">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                  <AvatarFallback className="bg-greentrail-200 text-greentrail-600">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-4 md:mt-0 md:ml-4 md:mb-1">
                  <div className="flex items-center flex-wrap gap-2">
                    <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">{profile.name}</h1>
                    <Badge variant="outline" className="text-greentrail-600 border-greentrail-400 dark:border-greentrail-600">
                      @{profile.username}
                    </Badge>
                  </div>
                  <div className="flex items-center mt-1 text-greentrail-600 dark:text-greentrail-400">
                    <MapPin size={14} className="mr-1" />
                    <span className="text-sm">{profile.location}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">Joined {profile.joinDate}</span>
                  </div>
                </div>
                <div className="flex-grow"></div>
                <div className="mt-4 md:mt-0">
                  <Button variant="outline" className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 dark:border-greentrail-400 dark:text-greentrail-300 dark:hover:bg-greentrail-800">
                    Edit Profile
                  </Button>
                </div>
              </div>
              
              <p className="text-greentrail-700 dark:text-greentrail-300 mb-6">
                {profile.bio}
              </p>
              
              <div className="grid grid-cols-3 divide-x divide-greentrail-200 dark:divide-greentrail-700">
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">{profile.stats.trails}</div>
                  <div className="text-sm text-greentrail-600 dark:text-greentrail-400">Trails</div>
                </div>
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">{profile.stats.followers}</div>
                  <div className="text-sm text-greentrail-600 dark:text-greentrail-400">Followers</div>
                </div>
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">{profile.stats.following}</div>
                  <div className="text-sm text-greentrail-600 dark:text-greentrail-400">Following</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Content */}
          <Tabs defaultValue="activity" className="space-y-4">
            <TabsList className="grid grid-cols-4 sm:w-[400px] bg-greentrail-100 dark:bg-greentrail-900 rounded-lg">
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="trails">Trails</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="saved">Saved</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    Recent Activity
                  </h2>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-6">
                      {recentActivity.map(activity => (
                        <div key={activity.id} className="flex gap-4">
                          <div className="bg-greentrail-100 dark:bg-greentrail-800 p-2 rounded-full flex-shrink-0 self-start">
                            {activity.type === 'trail-completed' && <Compass className="h-5 w-5 text-greentrail-600 dark:text-greentrail-400" />}
                            {activity.type === 'photo-upload' && <Image className="h-5 w-5 text-greentrail-600 dark:text-greentrail-400" />}
                            {activity.type === 'review' && <Heart className="h-5 w-5 text-greentrail-600 dark:text-greentrail-400" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-greentrail-800 dark:text-greentrail-200">@{profile.username}</span>
                              <span className="text-greentrail-600 dark:text-greentrail-400">
                                {activity.type === 'trail-completed' && 'completed a trail'}
                                {activity.type === 'photo-upload' && `uploaded ${activity.count} photos`}
                                {activity.type === 'review' && `reviewed a trail (${activity.rating}/5)`}
                              </span>
                            </div>
                            <Link to={`/trail/${activity.trailId}`} className="text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                              {activity.trailName}
                            </Link>
                            <div className="text-sm text-greentrail-500 dark:text-greentrail-500 mt-1">
                              {activity.date}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                        <Compass size={24} />
                      </div>
                      <p className="text-greentrail-600 dark:text-greentrail-400">
                        No activity yet. Start exploring trails to log your adventures!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="trails">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    My Trails
                  </h2>
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                      <MapPin size={24} />
                    </div>
                    <p className="text-greentrail-600 dark:text-greentrail-400 mb-4">
                      Connect with Supabase to view and manage your trail history.
                    </p>
                    <Link to="/discover">
                      <Button>
                        Explore Trails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="photos">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    My Photos
                  </h2>
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                      <Image size={24} />
                    </div>
                    <p className="text-greentrail-600 dark:text-greentrail-400 mb-4">
                      Connect with Supabase to upload and manage your trail photos.
                    </p>
                    <Button disabled>
                      Upload Photos (Coming Soon)
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="saved">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-greentrail-800 dark:text-greentrail-200 mb-4">
                    Saved Trails
                  </h2>
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-greentrail-100 dark:bg-greentrail-800 text-greentrail-600 dark:text-greentrail-400 mb-4">
                      <Heart size={24} />
                    </div>
                    <p className="text-greentrail-600 dark:text-greentrail-400 mb-4">
                      Connect with Supabase to save your favorite trails.
                    </p>
                    <Link to="/discover">
                      <Button>
                        Discover Trails
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
