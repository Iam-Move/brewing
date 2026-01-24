import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Hide on splash and timer pages
  if (location.pathname === '/') return null;
  if (location.pathname.startsWith('/pouring/recipe/')) return null;
  if (location.pathname === '/pouring/free') return null;

  const isActive = (path: string) => {
    if (path === '/beans' && (location.pathname === '/beans' || location.pathname.startsWith('/beans/'))) return true;
    if (path === '/recipes' && (location.pathname === '/recipes' || location.pathname.startsWith('/recipes/'))) return true;
    if (path === '/pouring' && (location.pathname === '/pouring' || location.pathname.startsWith('/pouring/'))) return true;
    if (path === '/settings' && location.pathname === '/settings') return true;
    return false;
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-md border-t border-white/10 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-[65px] px-2 w-full md:max-w-md mx-auto">
        <Link to="/beans" className={`flex flex-col items-center justify-center gap-1 w-20 ${isActive('/beans') ? 'text-primary' : 'text-textSub'}`}>
          <span className={`material-symbols-outlined text-[28px] ${isActive('/beans') ? 'filled' : ''}`}>coffee</span>
          <span className={`text-[10px] ${isActive('/beans') ? 'font-bold' : 'font-medium'}`}>원두</span>
        </Link>

        <Link to="/recipes" className={`flex flex-col items-center justify-center gap-1 w-20 ${isActive('/recipes') ? 'text-primary' : 'text-textSub'}`}>
          <span className={`material-symbols-outlined text-[28px] ${isActive('/recipes') ? 'filled' : ''}`}>receipt_long</span>
          <span className={`text-[10px] ${isActive('/recipes') ? 'font-bold' : 'font-medium'}`}>레시피</span>
        </Link>

        <Link to="/pouring" className={`flex flex-col items-center justify-center gap-1 w-20 ${isActive('/pouring') ? 'text-primary' : 'text-textSub'}`}>
          <span className={`material-symbols-outlined text-[28px] ${isActive('/pouring') ? 'filled' : ''}`}>local_cafe</span>
          <span className={`text-[10px] ${isActive('/pouring') ? 'font-bold' : 'font-medium'}`}>푸어링</span>
        </Link>

        <Link to="/settings" className={`flex flex-col items-center justify-center gap-1 w-20 ${isActive('/settings') ? 'text-primary' : 'text-textSub'}`}>
          <span className={`material-symbols-outlined text-[28px] ${isActive('/settings') ? 'filled' : ''}`}>settings</span>
          <span className={`text-[10px] ${isActive('/settings') ? 'font-bold' : 'font-medium'}`}>설정</span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
