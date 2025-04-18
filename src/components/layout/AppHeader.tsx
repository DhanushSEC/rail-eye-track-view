
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

export function AppHeader() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("railAppAuthUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    // Will be replaced with actual Supabase auth when connected
    localStorage.removeItem("railAppAuthUser");
    toast({
      title: "Signed out successfully",
      description: "You have been logged out of the system",
    });
    navigate('/');
  };

  if (!user) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="lg:hidden">
              <nav className="grid gap-4 py-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                  Dashboard
                </Link>
                <Link to="/record" className="flex items-center gap-2 text-lg font-semibold">
                  Record
                </Link>
                <Link to="/map" className="flex items-center gap-2 text-lg font-semibold">
                  Map
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-rail-blue-500"></div>
            <span className="font-bold text-xl hidden sm:inline-block">RailEye</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 ml-6">
            <Link to="/dashboard" className="text-sm font-medium hover:text-primary">Dashboard</Link>
            <Link to="/record" className="text-sm font-medium hover:text-primary">Record</Link>
            <Link to="/map" className="text-sm font-medium hover:text-primary">Map</Link>
          </nav>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block text-sm text-muted-foreground">
            {user.email}
          </div>
          <Button variant="ghost" size="icon" onClick={handleSignOut}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
