
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LoginForm } from '@/components/auth/LoginForm';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { Leaf, Mountain, Users, Shield } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-greentrail-50 via-white to-greentrail-100 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-greentrail-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-greentrail-600 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-greentrail-300 rounded-full blur-3xl"></div>
        </div>

        <motion.div 
          className="w-full max-w-lg space-y-8 relative z-10"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex items-center justify-center w-12 h-12 bg-greentrail-600 rounded-xl shadow-lg">
                <Leaf className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-greentrail-700 to-greentrail-900 bg-clip-text text-transparent">
                GreenTrails
              </h1>
            </div>
            <p className="text-lg text-greentrail-700 font-medium">Your hiking social network</p>
            
            {/* Feature highlights */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="w-10 h-10 bg-greentrail-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mountain className="w-5 h-5 text-greentrail-600" />
                </div>
                <p className="text-xs text-greentrail-600 font-medium">Discover Trails</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-greentrail-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-greentrail-600" />
                </div>
                <p className="text-xs text-greentrail-600 font-medium">Join Community</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-greentrail-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-5 h-5 text-greentrail-600" />
                </div>
                <p className="text-xs text-greentrail-600 font-medium">21+ Verified</p>
              </div>
            </div>
          </motion.div>
          
          {/* Auth Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-greentrail-200 shadow-2xl">
            <CardContent className="p-6">
              {/* Tab Switcher */}
              <motion.div 
                className="flex bg-greentrail-50 rounded-xl p-1 mb-6"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Button
                  variant={isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 relative transition-all duration-300 ${
                    isLogin 
                      ? 'bg-greentrail-600 text-white shadow-lg hover:bg-greentrail-700' 
                      : 'text-greentrail-700 hover:bg-greentrail-100'
                  }`}
                >
                  Sign In
                </Button>
                <Button
                  variant={!isLogin ? "default" : "ghost"}
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 relative transition-all duration-300 ${
                    !isLogin 
                      ? 'bg-greentrail-600 text-white shadow-lg hover:bg-greentrail-700' 
                      : 'text-greentrail-700 hover:bg-greentrail-100'
                  }`}
                >
                  Sign Up
                </Button>
              </motion.div>
              
              {/* Form Container */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isLogin ? 'login' : 'signup'}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    custom={isLogin ? -1 : 1}
                    transition={{
                      x: { type: "spring", stiffness: 300, damping: 30 },
                      opacity: { duration: 0.2 }
                    }}
                  >
                    {isLogin ? (
                      <LoginForm />
                    ) : (
                      <SignUpForm onSuccess={() => setIsLogin(true)} />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <motion.div 
            className="text-center text-sm text-greentrail-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <p>Join thousands of hikers exploring the great outdoors</p>
          </motion.div>
        </motion.div>
      </div>
    </AuthGuard>
  );
};

export default AuthPage;
