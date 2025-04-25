
import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Auth = () => {
  const { search } = useLocation();
  const [activeTab, setActiveTab] = useState("signin");
  const { toast } = useToast();

  // Email and password for sign in
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Additional fields for registration
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Check if the URL contains signup parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    if (searchParams.get("signup") === "true") {
      setActiveTab("signup");
    }
  }, [search]);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    
    // This will be replaced with Supabase auth later
    toast({
      title: "Sign-in Attempted",
      description: "Supabase authentication will be implemented soon. For now, this is a placeholder.",
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isAdult) {
      toast({
        title: "Age Verification Required",
        description: "You must be 21 or older to use GreenTrails.",
        variant: "destructive",
      });
      return;
    }

    if (!agreeTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "You must agree to our Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The passwords you entered do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // This will be replaced with Supabase auth later
    toast({
      title: "Sign-up Attempted",
      description: "Supabase authentication will be implemented soon. For now, this is a placeholder.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 bg-greentrail-50 dark:bg-greentrail-950">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 text-center">
            <img 
              src="/lovable-uploads/0c2a9cc4-4fdb-4d4a-965c-47b406e4ec4e.png" 
              alt="GreenTrails Logo" 
              className="h-12 mx-auto mb-4" 
            />
            <h1 className="text-2xl font-bold text-greentrail-800 dark:text-greentrail-200">
              Welcome to GreenTrails
            </h1>
            <p className="text-greentrail-600 dark:text-greentrail-400">
              Your journey to cannabis-friendly trails starts here
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <Card>
                <CardHeader>
                  <CardTitle>Sign In</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignIn}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link to="/forgot-password" className="text-xs text-greentrail-600 hover:text-greentrail-800 dark:text-greentrail-400 dark:hover:text-greentrail-200">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-greentrail-600 hover:bg-greentrail-700">
                      Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup">
              <Card>
                <CardHeader>
                  <CardTitle>Create an Account</CardTitle>
                  <CardDescription>
                    Join our community of trail explorers
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignUp}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        placeholder="johntrails" 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input 
                        id="signup-email" 
                        type="email" 
                        placeholder="your@email.com" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input 
                        id="signup-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input 
                        id="confirm-password" 
                        type="password" 
                        placeholder="••••••••" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="age-verification" 
                          checked={isAdult}
                          onCheckedChange={(checked) => setIsAdult(checked as boolean)}
                        />
                        <label 
                          htmlFor="age-verification" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-greentrail-700 dark:text-greentrail-300"
                        >
                          I confirm that I am 21 years of age or older
                        </label>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="terms" 
                          checked={agreeTerms}
                          onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                        />
                        <label 
                          htmlFor="terms" 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-greentrail-700 dark:text-greentrail-300"
                        >
                          I agree to the <Link to="/terms" className="text-greentrail-600 hover:underline dark:text-greentrail-400">Terms of Service</Link> and <Link to="/privacy" className="text-greentrail-600 hover:underline dark:text-greentrail-400">Privacy Policy</Link>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" className="w-full bg-greentrail-600 hover:bg-greentrail-700">
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-6 text-center text-sm text-greentrail-600 dark:text-greentrail-400">
            <p>
              By continuing, you acknowledge that GreenTrails is intended for adults 21 and older in jurisdictions where cannabis is legal.
            </p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
