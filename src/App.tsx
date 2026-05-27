/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, Leaf, LogOut, Compass, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, LMSCourse, ESGData } from './types';
import { INITIAL_USER, INITIAL_COURSES, INITIAL_ESG_DATA } from './data';

import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import LMSScreen from './components/LMSScreen';
import FieldScreen from './components/FieldScreen';
import ESGScreen from './components/ESGScreen';

// Web Components
import LandingPage from './components/LandingPage';
import WebLayout from './components/web/WebLayout';
import WebDashboard from './components/web/WebDashboard';
import WebFieldControl from './components/web/WebFieldControl';
import WebMobilization from './components/web/WebMobilization';
import WebTrainings from './components/web/WebTrainings';

import { RouterProvider, useRouter } from './router';
import { ThemeProvider } from './theme';

function AppContent() {
  const { currentPath, navigate } = useRouter();
  const [isMobileScreen, setIsMobileScreen] = useState(window.innerWidth < 768);

  // Monitor viewport size to choose correct layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [user, setUser] = useState<UserProfile>(() => {
    const cachedUser = localStorage.getItem('tegram_user_profile');
    if (cachedUser) {
      try {
        return JSON.parse(cachedUser);
      } catch (err) {
        console.error("Failed to parse cached user", err);
      }
    }
    return INITIAL_USER;
  });

  const [esgData, setEsgData] = useState<ESGData>(() => {
    const cachedEsg = localStorage.getItem('tegram_esg_data');
    if (cachedEsg) {
      try {
        return JSON.parse(cachedEsg);
      } catch (err) {
        console.error("Failed to parse cached ESG metrics", err);
      }
    }
    return INITIAL_ESG_DATA;
  });

  const [course, setCourse] = useState<LMSCourse>(INITIAL_COURSES[0]);

  // Persist configurations safely
  useEffect(() => {
    localStorage.setItem('tegram_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tegram_esg_data', JSON.stringify(esgData));
  }, [esgData]);

  const handleLogin = (formattedName: string) => {
    const profile = {
      name: formattedName,
      role: "Operador Sênior",
      location: "Porto de Itaqui",
      isLoggedIn: true
    };
    setUser(profile);
    
    // Context redirect
    if (window.innerWidth < 768) {
      navigate('/mobile/dashboard');
    } else {
      navigate('/web/dashboard');
    }
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    localStorage.removeItem('tegram_user_profile');
    localStorage.removeItem('tegram_active_tab');
    navigate('/');
  };

  // Main Route Handler
  const renderContent = () => {
    // 1. If not logged in, only allow Landing Page or Login Screen
    if (!user.isLoggedIn) {
      if (currentPath === '/login') {
        return (
          <LoginScreen 
            onLogin={handleLogin} 
            initialNameInput="evanildo.barros" 
            onBackToLanding={() => navigate('/')} 
          />
        );
      }
      return <LandingPage onLoginClick={() => navigate('/login')} />;
    }

    // 2. Logged in but at landing or login paths (Redirect)
    if (currentPath === '/' || currentPath === '/login' || currentPath === '/app') {
      if (isMobileScreen) {
        navigate('/mobile/dashboard');
      } else {
        navigate('/web/dashboard');
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
        </div>
      );
    }

    // 3. Web Console Desktop Routes
    if (currentPath.startsWith('/web')) {
      if (isMobileScreen) {
        // Force mobile views on mobile devices
        navigate('/mobile/dashboard');
        return null;
      }

      let activeSection: 'dashboard' | 'mobilizacao' | 'campo' | 'treinamentos' | 'esg' = 'dashboard';
      let childNode = <WebDashboard user={user} course={course} esg={esgData} />;

      if (currentPath === '/web/mobilizacao') {
        activeSection = 'mobilizacao';
        childNode = <WebMobilization />;
      } else if (currentPath === '/web/campo') {
        activeSection = 'campo';
        childNode = <WebFieldControl />;
      } else if (currentPath === '/web/treinamentos') {
        activeSection = 'treinamentos';
        childNode = <WebTrainings />;
      } else if (currentPath === '/web/esg') {
        activeSection = 'esg';
        childNode = <ESGScreen esg={esgData} onUpdateEsg={setEsgData} isDesktop={true} />;
      }

      return (
        <WebLayout 
          activeSection={activeSection} 
          user={user} 
          onLogout={handleLogout}
        >
          {childNode}
        </WebLayout>
      );
    }

    // 4. Mobile App Routes (Includes phone simulator frame when viewed on desktop)
    if (currentPath.startsWith('/mobile')) {
      let activeTab = 'dashboard';
      let screen = (
        <DashboardScreen 
          user={user} 
          course={course} 
          esg={esgData} 
          onNavigateToTab={(tab) => navigate(`/mobile/${tab}`)} 
        />
      );

      if (currentPath === '/mobile/lms') {
        activeTab = 'lms';
        screen = <LMSScreen />;
      } else if (currentPath === '/mobile/field') {
        activeTab = 'field';
        screen = <FieldScreen />;
      } else if (currentPath === '/mobile/esg') {
        activeTab = 'esg';
        screen = <ESGScreen esg={esgData} onUpdateEsg={setEsgData} />;
      }

      const mobileAppContent = (
        <div className="h-full flex flex-col relative w-full overflow-hidden bg-[#FDFDFD] text-[#1A1A1A] select-none">
          <main className="flex-1 w-full bg-white relative overflow-y-auto pb-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: "easeInOut" }}
                className="w-full h-full"
              >
                {screen}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* BOTTOM TAB NAVIGATION */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-[#EEEEEE] bg-white/95 backdrop-blur-md z-40 py-3.5 px-4 flex items-center justify-around rounded-none print:hidden shadow-none">
            {/* Tab 1: Dashboard */}
            <button
              onClick={() => navigate('/mobile/dashboard')}
              className="flex flex-col items-center justify-center relative flex-1 cursor-pointer"
            >
              {activeTab === 'dashboard' ? (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 px-8 py-4.5 bg-[#1A1A1A] rounded-xl -z-10 shadow-none border border-transparent"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              ) : null}
              <LayoutDashboard className={`w-4.5 h-4.5 mb-1 z-10 transition-colors ${
                activeTab === 'dashboard' ? 'text-white' : 'text-[#888888] hover:text-[#1A1A1A]'
              }`} />
              <span className={`text-[10px] uppercase tracking-wider font-semibold z-10 transition-colors ${
                activeTab === 'dashboard' ? 'text-white' : 'text-[#888888]'
              }`}>
                Dash
              </span>
            </button>

            {/* Tab 2: LMS */}
            <button
              onClick={() => navigate('/mobile/lms')}
              className="flex flex-col items-center justify-center relative flex-1 cursor-pointer"
            >
              {activeTab === 'lms' ? (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 px-8 py-4.5 bg-[#1A1A1A] rounded-xl -z-10 shadow-none border border-transparent"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              ) : null}
              <GraduationCap className={`w-4.5 h-4.5 mb-1 z-10 transition-colors ${
                activeTab === 'lms' ? 'text-white' : 'text-[#888888] hover:text-[#1A1A1A]'
              }`} />
              <span className={`text-[9px] uppercase tracking-wider font-semibold z-10 transition-colors ${
                activeTab === 'lms' ? 'text-white' : 'text-[#888888]'
              }`}>
                SSO
              </span>
            </button>

            {/* Tab 3: Field Presence */}
            <button
              onClick={() => navigate('/mobile/field')}
              className="flex flex-col items-center justify-center relative flex-1 cursor-pointer"
            >
              {activeTab === 'field' ? (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 px-8 py-4.5 bg-[#1A1A1A] rounded-xl -z-10 shadow-none border border-transparent"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              ) : null}
              <Compass className={`w-4.5 h-4.5 mb-1 z-10 transition-colors ${
                activeTab === 'field' ? 'text-white' : 'text-[#888888] hover:text-[#1A1A1A]'
              }`} />
              <span className={`text-[10px] uppercase tracking-wider font-semibold z-10 transition-colors ${
                activeTab === 'field' ? 'text-white' : 'text-[#888888]'
              }`}>
                Campo
              </span>
            </button>

            {/* Tab 4: ESG Metrics */}
            <button
              onClick={() => navigate('/mobile/esg')}
              className="flex flex-col items-center justify-center relative flex-1 cursor-pointer"
            >
              {activeTab === 'esg' ? (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute -top-1 px-8 py-4.5 bg-[#1A1A1A] rounded-xl -z-10 shadow-none border border-transparent"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              ) : null}
              <Leaf className={`w-4.5 h-4.5 mb-1 z-10 transition-colors ${
                activeTab === 'esg' ? 'text-white' : 'text-[#888888] hover:text-[#1A1A1A]'
              }`} />
              <span className={`text-[10px] uppercase tracking-wider font-semibold z-10 transition-colors ${
                activeTab === 'esg' ? 'text-white' : 'text-[#888888]'
              }`}>
                ESG
              </span>
            </button>
          </div>
        </div>
      );

      // Wrapper in a sleek phone frame simulator on desktop screens
      if (!isMobileScreen) {
        return (
          <div className="min-h-screen bg-slate-900 w-screen flex flex-col items-center justify-center p-6 select-none overflow-hidden">
            <div className="mb-4 text-center shrink-0">
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/40 border border-cyan-800/40 px-3 py-1 rounded-full">
                Simulador Visual Mobile
              </span>
              <p className="text-[11px] text-slate-400 mt-2 leading-none">
                Você está interagindo com a tela de campo exatamente como um operador de porto.
                <button 
                  onClick={() => navigate('/web/dashboard')} 
                  className="text-cyan-400 hover:text-cyan-300 font-bold ml-1.5 transition-colors underline"
                >
                  Voltar para Console Web
                </button>
              </p>
            </div>
            
            <div className="relative w-[375px] h-[780px] bg-white rounded-[44px] shadow-2xl border-[12px] border-slate-950 overflow-hidden flex flex-col shrink-0">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-b-xl z-50 flex items-center justify-center">
                <div className="w-10 h-0.5 bg-slate-800 rounded-full" />
              </div>
              <div className="flex-1 overflow-hidden relative pt-5 bg-white">
                {mobileAppContent}
              </div>
            </div>
          </div>
        );
      }

      return mobileAppContent;
    }

    // Default Fallback
    if (isMobileScreen) {
      navigate('/mobile/dashboard');
    } else {
      navigate('/web/dashboard');
    }
    return null;
  };

  return renderContent();
}

export default function App() {
  return (
    <ThemeProvider>
      <RouterProvider>
        <AppContent />
      </RouterProvider>
    </ThemeProvider>
  );
}
