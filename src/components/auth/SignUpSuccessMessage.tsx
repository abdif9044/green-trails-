
import { CheckCircle } from 'lucide-react';

export const SignUpSuccessMessage = () => {
  return (
    <div className="text-center py-8">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
      <h3 className="text-lg font-semibold text-green-800 mb-2">Account Created!</h3>
      <p className="text-green-600">Welcome to GreenTrails! You can now sign in.</p>
    </div>
  );
};
