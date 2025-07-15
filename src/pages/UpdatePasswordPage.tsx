import { UpdatePasswordForm } from '@/components/auth/UpdatePasswordForm';
import { AuthGuard } from '@/components/auth/AuthGuard';

const UpdatePasswordPage = () => {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-greentrail-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-greentrail-800 mb-2">Update Password</h1>
            <p className="text-greentrail-600">Enter your new password</p>
          </div>
          
          <UpdatePasswordForm />
        </div>
      </div>
    </AuthGuard>
  );
};

export default UpdatePasswordPage;