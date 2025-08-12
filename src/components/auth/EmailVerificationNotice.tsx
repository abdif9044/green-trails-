import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { motion } from 'framer-motion';

interface EmailVerificationNoticeProps {
  email: string;
  onResendSuccess?: () => void;
}

const EmailVerificationNotice: React.FC<EmailVerificationNoticeProps> = ({ 
  email, 
  onResendSuccess 
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const { user } = useAuth();

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendStatus('idle');

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth?verified=true`
        }
      });

      if (error) {
        console.error('Error resending verification email:', error);
        setResendStatus('error');
      } else {
        setResendStatus('success');
        onResendSuccess?.();
      }
    } catch (error) {
      console.error('Failed to resend verification email:', error);
      setResendStatus('error');
    } finally {
      setIsResending(false);
    }
  };

  const getResendButtonText = () => {
    if (isResending) return 'Sending...';
    if (resendStatus === 'success') return 'Email Sent!';
    if (resendStatus === 'error') return 'Try Again';
    return 'Resend Email';
  };

  const getResendButtonVariant = () => {
    if (resendStatus === 'success') return 'default';
    if (resendStatus === 'error') return 'destructive';
    return 'outline';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-blue-900">
            Check Your Email
          </CardTitle>
          <CardDescription className="text-blue-700">
            We've sent a verification link to:
          </CardDescription>
          <div className="font-semibold text-blue-900 bg-blue-100 px-3 py-2 rounded-lg">
            {email}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-blue-800">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Click the verification link in your email to activate your account</span>
            </div>
            
            <div className="flex items-start gap-3 text-sm text-blue-800">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>Check your spam or junk folder if you don't see the email</span>
            </div>
            
            <div className="flex items-start gap-3 text-sm text-blue-800">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <span>The verification link expires in 24 hours</span>
            </div>
          </div>

          {/* Resend Button */}
          <div className="pt-4 border-t border-blue-200">
            <div className="text-center space-y-3">
              <p className="text-sm text-blue-700">
                Didn't receive the email?
              </p>
              
              <Button
                onClick={handleResendVerification}
                disabled={isResending || resendStatus === 'success'}
                variant={getResendButtonVariant()}
                className="w-full"
              >
                {isResending && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                {resendStatus === 'success' && <CheckCircle className="w-4 h-4 mr-2" />}
                {resendStatus === 'error' && <AlertCircle className="w-4 h-4 mr-2" />}
                {getResendButtonText()}
              </Button>

              {resendStatus === 'success' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-600"
                >
                  Verification email sent successfully!
                </motion.p>
              )}

              {resendStatus === 'error' && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600"
                >
                  Failed to send email. Please try again.
                </motion.p>
              )}
            </div>
          </div>

          {/* Additional Help */}
          <div className="pt-4 border-t border-blue-200">
            <p className="text-xs text-blue-600 text-center">
              Still having trouble? Contact support at{' '}
              <a href="mailto:support@greentrails.app" className="underline hover:text-blue-800">
                support@greentrails.app
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmailVerificationNotice;