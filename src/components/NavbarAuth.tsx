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
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Loader2, User, LogOut, Map, Heart, Settings, Camera } from "lucide-react";

export const NavbarAuth = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
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
          className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100"
          onClick={() => navigate('/auth')}
        >
          Sign In
        </Button>
        <Button 
          className="bg-greentrail-600 hover:bg-greentrail-700 text-white"
          onClick={() => navigate('/auth')}
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User avatar" />
            <AvatarFallback className="bg-greentrail-100 text-greentrail-800">
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
            {user.email}
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
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem className="flex items-center gap-2 text-red-500 focus:text-red-500" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
