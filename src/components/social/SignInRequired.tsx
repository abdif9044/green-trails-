
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const SignInRequired = () => {
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Sign in to Follow Trailblazers</h3>
      <p className="text-muted-foreground mb-4">
        Create an account to connect with other members and see their adventures
      </p>
      <Button asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
    </div>
  );
};

export default SignInRequired;
