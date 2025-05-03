import React, { useState, useRef, useEffect } from 'react';
import { LogOut, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface UserMenuProps {
  onLogout: () => Promise<boolean>;
}

export function UserMenu({ onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      const success = await onLogout();
      if (success) {
        toast.success('Successfully logged out');
        navigate('/', { replace: true });
      } else {
        toast.error('Logout failed. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred during logout');
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-[#3E3E3E] rounded-full transition-colors"
        aria-label="Open user menu"
        aria-expanded={isOpen}
        disabled={isLoggingOut}
      >
        <MoreVertical className="w-5 h-5 text-white" />
      </button>

      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-48 bg-[#282828] rounded-xl shadow-lg py-1 z-50 animate-fadeIn border border-[#3E3E3E]"
          role="menu"
        >
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 text-left text-[#1DB954] hover:bg-[#3E3E3E] transition-colors"
            role="menuitem"
            disabled={isLoggingOut}
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
}