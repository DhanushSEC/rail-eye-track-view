
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppHeader } from './AppHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("railAppAuthUser");
      if (!user) {
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <div className="container py-6">
          {children}
        </div>
      </main>
      <footer className="border-t py-4 bg-background">
        <div className="container flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div>
            RailEye Track Monitoring System
          </div>
          <div>
            © {new Date().getFullYear()} Railway Inspection Technologies
          </div>
        </div>
      </footer>
    </div>
  );
}
