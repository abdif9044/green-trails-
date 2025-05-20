
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Users, Database } from "lucide-react";

const SignInRequired = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">Sign in to Follow Trailblazers</h3>
      <p className="text-muted-foreground mb-4">
        Create an account to connect with other members and see their adventures
      </p>
      <div className="space-y-4">
        <Button onClick={() => navigate('/auth')}>
          Sign In
        </Button>
        <div className="flex items-center justify-center">
          <span className="text-sm text-muted-foreground px-2">or</span>
        </div>
        <Button variant="outline" onClick={() => navigate('/admin/import')}>
          <Database className="mr-2 h-4 w-4" />
          Access Admin Import
        </Button>
      </div>
    </div>
  );
};

export default SignInRequired;
