import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Mail, 
  ArrowLeft,
  Send
} from 'lucide-react';

interface PasswordResetFormProps {
  onBack?: () => void;
}

export const PasswordResetForm = ({ onBack }: PasswordResetFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        toast({
          title: "Reset link sent!",
          description: "Check your email for password reset instructions.",
        });
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-greentrail-800 mb-4">Check Your Email</h3>
        <p className="text-greentrail-600 mb-6">We've sent a reset link to {email}</p>
        <Button variant="outline" onClick={() => navigate('/auth')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-greentrail-200 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-greentrail-800">Reset Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={loading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-greentrail-600 hover:bg-greentrail-700"
            disabled={loading || !email}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Reset Link
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PasswordResetForm;