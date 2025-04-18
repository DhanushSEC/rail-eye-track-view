
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem('railAppAuthUser');
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 rounded-full bg-rail-blue-500 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-rail-yellow-500"></div>
        </div>
        <h1 className="mt-4 text-2xl font-bold">Loading RailEye...</h1>
      </div>
    </div>
  );
};

export default Index;
