
import React, { useState, useEffect } from 'react';
import { LogOut, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { User, WebSettings } from '../types';
import { MENU_ITEMS, ROLE_LABELS } from '../constants';

interface LayoutProps {
  user: User;
  settings: WebSettings;
  currentPath: string;
  onPathChange: (path: string) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, settings, currentPath, onPathChange, onLogout, children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Close mobile sidebar on path change
  const handlePathChange = (path: string) => {
    onPathChange(path);
    setIsMobileOpen(false);
  };

  const menu = MENU_ITEMS[user.role];

  return (
    <div className="min-h-screen flex bg-gray-50 overflow-x-hidden">
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[45] lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 bg-[#f68b1f] text-white transition-all duration-300 ease-in-out
        ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'}
        ${!isMobileOpen && (isCollapsed ? 'lg:w-20' : 'lg:w-64')}
        lg:relative flex flex-col shadow-2xl lg:shadow-none
      `}>
        {/* Header / Logo */}
        <div className="h-16 flex items-center px-4 border-b border-[#d57618] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-sm">
              <img src={settings.logoUrl} alt="Logo" className="w-7 h-7 object-contain" />
            </div>
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-bold text-lg truncate animate-fade-in">{settings.siteName}</span>
            )}
          </div>
          {isMobileOpen && (
            <button onClick={() => setIsMobileOpen(false)} className="ml-auto lg:hidden">
              <X size={24} />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 mt-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          {menu.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handlePathChange(item.path)}
                title={isCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-white text-[#f68b1f] shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className={`shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                  {item.icon}
                </span>
                {(!isCollapsed || isMobileOpen) && (
                  <span className="font-semibold text-sm truncate animate-fade-in">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#d57618] space-y-2">
          {/* Collapse Toggle (Desktop Only) */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center gap-4 px-3 py-3 text-white/80 hover:bg-white/10 rounded-xl transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            {!isCollapsed && <span className="text-sm font-medium">Minimize Sidebar</span>}
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-3 py-3 text-red-100 hover:bg-red-600 hover:text-white rounded-xl transition-all"
          >
            <LogOut size={20} className="shrink-0" />
            {(!isCollapsed || isMobileOpen) && (
              <span className="font-semibold text-sm animate-fade-in">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)} 
              className="p-2 hover:bg-gray-100 rounded-xl lg:hidden text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="hidden lg:block">
               <h2 className="font-bold text-gray-800 text-lg">
                {menu.find(m => m.path === currentPath)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-bold text-gray-900 leading-none">{user.name}</div>
              <div className="text-[10px] text-[#f68b1f] font-bold uppercase tracking-wider mt-1">{ROLE_LABELS[user.role]}</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#fef3e7] flex items-center justify-center text-[#f68b1f] font-bold border-2 border-white shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto animate-fade-in">
              {/* Mobile Page Title */}
              <h2 className="lg:hidden font-bold text-gray-800 text-xl mb-6">
                {menu.find(m => m.path === currentPath)?.label || 'Dashboard'}
              </h2>
              {children}
           </div>
        </main>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default Layout;
