
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/AuthForm';

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('railAppAuthUser');
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rail-blue-100 to-white flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="h-12 w-12 rounded-full bg-rail-blue-500 flex items-center justify-center">
              <div className="h-6 w-6 rounded-full bg-rail-yellow-500"></div>
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-rail-blue-700">RailEye</h1>
          <p className="mt-2 text-xl text-rail-blue-600">
            Railway Track Crack Detection System
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-xl border">
          <AuthForm />
        </div>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>A secure platform for railway track monitoring and maintenance</p>
          <p className="mt-1">© {new Date().getFullYear()} Railway Inspection Technologies</p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
