
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, User, LogOut, Map, Heart, Settings, Camera } from "lucide-react";

export const NavbarAuth = () => {
  const { user, signOut, loading, isInitialized } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await signOut();
      if (result.success) {
        toast({
          title: "Signed out successfully",
          description: "You have been signed out of your account.",
        });
        navigate('/auth');
      } else {
        toast({
          title: "Sign out failed",
          description: result.message || "There was an error signing out. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading && !isInitialized) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-greentrail-500" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 hover:text-greentrail-800 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800 dark:hover:text-greentrail-100"
          onClick={() => navigate('/auth')}
        >
          Sign In
        </Button>
        <Button 
          className="bg-greentrail-600 hover:bg-greentrail-700 text-white"
          onClick={() => navigate('/auth?signup=true')}
        >
          Join Now
        </Button>
      </div>
    );
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user.email) return 'GT';
    return user.email.charAt(0).toUpperCase();
  };

  // Get user metadata
  const userMetadata = user.user_metadata || {};
  const isDemo = userMetadata.is_demo_account === true;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userMetadata.avatar_url || ''} alt="User avatar" />
            <AvatarFallback className={`${isDemo ? 'bg-amber-100 text-amber-800' : 'bg-greentrail-100 text-greentrail-800'}`}>
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex flex-col gap-1 p-2">
          <div className="text-xs text-muted-foreground">
            Signed in as
          </div>
          <div className="text-sm font-medium">
            {userMetadata.username || user.email}
            {isDemo && (
              <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800">
                Demo
              </span>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/profile')}>
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/discover')}>
          <Map className="h-4 w-4" />
          Discover Trails
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/social')}>
          <Camera className="h-4 w-4" />
          Photo Albums
        </DropdownMenuItem>
        
        <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/favorites')}>
          <Heart className="h-4 w-4" />
          Saved Trails
        </DropdownMenuItem>
        
        {!isDemo && (
          <DropdownMenuItem className="flex items-center gap-2" onClick={() => navigate('/settings')}>
            <Settings className="h-4 w-4" />
            Settings
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500 dark:text-red-400 dark:focus:text-red-400" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
