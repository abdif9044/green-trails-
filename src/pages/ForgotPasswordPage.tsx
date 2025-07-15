import { PasswordResetForm } from '@/components/auth/PasswordResetForm';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-greentrail-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-greentrail-800 mb-2">Reset Password</h1>
            <p className="text-greentrail-600">Enter your email to receive a password reset link</p>
          </div>
          
          <PasswordResetForm onBack={() => navigate('/auth')} />
          
          <div className="text-center">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-greentrail-600 hover:text-greentrail-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default ForgotPasswordPage;