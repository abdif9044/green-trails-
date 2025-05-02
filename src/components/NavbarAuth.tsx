
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export const NavbarAuth = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <Link to="/auth">
          <Button variant="outline" className="border-greentrail-500 text-greentrail-700 hover:bg-greentrail-100 hover:text-greentrail-800 dark:border-greentrail-400 dark:text-greentrail-200 dark:hover:bg-greentrail-800 dark:hover:text-greentrail-100">
            Sign In
          </Button>
        </Link>
        <Link to="/auth?signup=true">
          <Button className="bg-greentrail-600 hover:bg-greentrail-700 text-white">
            Join Now
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-greentrail-100 text-greentrail-800">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem className="flex-col items-start">
          <div className="text-xs text-muted-foreground">
            Signed in as
          </div>
          <div className="text-sm font-medium">
            {user.email}
          </div>
        </DropdownMenuItem>
        <Link to="/profile">
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>
        </Link>
        <Link to="/social">
          <DropdownMenuItem>
            Social Feed
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem onClick={handleSignOut}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
