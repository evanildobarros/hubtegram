import React from 'react';
import { 
  Anchor, LayoutDashboard, Badge, Map, School, Leaf, 
  Settings, LogOut, ShieldCheck, Sun, Moon, Monitor
} from 'lucide-react';
import { useRouter } from '../../router';
import { UserProfile } from '../../types';
import { useTheme } from '../../theme';

interface WebLayoutProps {
  children: React.ReactNode;
  activeSection: 'dashboard' | 'mobilizacao' | 'campo' | 'treinamentos' | 'esg';
  user: UserProfile;
  onLogout: () => void;
}

export default function WebLayout({ children, activeSection, user, onLogout }: WebLayoutProps) {
  const { navigate } = useRouter();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/web/dashboard' },
    { id: 'mobilizacao', label: 'Mobilização', icon: Badge, path: '/web/mobilizacao' },
    { id: 'campo', label: 'Field Operations', icon: Map, path: '/web/campo' },
    { id: 'treinamentos', label: 'Matriz de Treinamentos', icon: School, path: '/web/treinamentos' },
    { id: 'esg', label: 'ESG Panel', icon: Leaf, path: '/web/esg' },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* SideNav */}
      <aside className="w-[280px] bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full py-4 z-30 shrink-0 transition-colors duration-200">
        <div className="px-6 py-4 flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/10">
            <Anchor className="text-white w-4.5 h-4.5" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight leading-none">TEGRAM OS</h1>
            <p className="text-[10px] text-cyan-600 dark:text-cyan-500 font-bold uppercase tracking-widest mt-1">Port Operations Suite</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                  isActive 
                    ? 'bg-slate-200/60 dark:bg-gradient-to-r dark:from-cyan-950/60 dark:to-slate-900 border-l-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-200/40 dark:hover:text-slate-200 dark:hover:bg-slate-900/50'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-400'}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-3 border-t border-slate-200 dark:border-slate-900 pt-4 space-y-1">
          <button 
            onClick={() => navigate('/web/config')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
              activeSection === 'config' as any 
                ? 'bg-slate-200/60 dark:bg-gradient-to-r dark:from-cyan-950/60 dark:to-slate-900 border-l-2 border-cyan-500 text-cyan-600 dark:text-cyan-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 hover:bg-slate-200/40 dark:hover:text-slate-200 dark:hover:bg-slate-900/50'
            }`}
          >
            <Settings className="w-4.5 h-4.5 text-slate-500 dark:text-slate-400" />
            <span className="text-xs">Configurações</span>
          </button>
          
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 dark:hover:text-red-300 transition-all font-semibold"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span className="text-xs">Sair do Sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-100 dark:bg-slate-900 transition-colors duration-200">
        {/* TopBar */}
        <header className="h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-8 z-20 shrink-0 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-800 dark:text-white tracking-wide uppercase">
              {activeSection === 'dashboard' && 'Painel Operacional'}
              {activeSection === 'mobilizacao' && 'Gestão de Mobilização & SSO'}
              {activeSection === 'campo' && 'Controle de Campo (Real-time)'}
              {activeSection === 'treinamentos' && 'Matriz de Treinamentos & NRs'}
              {activeSection === 'esg' && 'Relatórios e Métricas ESG'}
            </h2>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">TEGRAM ITAQUI PORT CONSOLE</span>
          </div>

          <div className="flex items-center gap-5">
            {/* GPS Status Indicator */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-150 dark:border-cyan-500/20 rounded-full text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 transition-colors duration-200">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GPS SECURE SYNC ACTIVE</span>
            </div>

            {/* Theme Selector Widget */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5 shadow-none transition-colors duration-200">
              <button
                onClick={() => setTheme('light')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'light' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/50 dark:border-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Modo Claro"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'dark' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/50 dark:border-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Modo Escuro"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`p-1.5 rounded-lg transition-all ${
                  theme === 'system' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200/50 dark:border-slate-700' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Usar Preferência do Sistema"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Profile Block */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="text-[9px] text-cyan-600 dark:text-cyan-500 font-semibold uppercase tracking-wider">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-black text-white shadow-md shadow-cyan-500/10 border border-slate-200 dark:border-slate-800">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Inner Content Slot */}
        <div className="flex-1 overflow-hidden relative">
          {children}
        </div>
      </main>
    </div>
  );
}
