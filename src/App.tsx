/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, HardHat, Leaf, LogOut, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, LMSCourse, ESGData } from './types';
import { INITIAL_USER, INITIAL_COURSES, INITIAL_ESG_DATA } from './data';

import LoginScreen from './components/LoginScreen';
import DashboardScreen from './components/DashboardScreen';
import LMSScreen from './components/LMSScreen';
import FieldScreen from './components/FieldScreen';
import ESGScreen from './components/ESGScreen';

export default function App() {
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

  const [activeTab, setActiveTab] = useState<string>(() => {
    return localStorage.getItem('tegram_active_tab') || 'dashboard';
  });

  const [course, setCourse] = useState<LMSCourse>(INITIAL_COURSES[0]);

  // Persist configurations safely
  useEffect(() => {
    localStorage.setItem('tegram_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tegram_esg_data', JSON.stringify(esgData));
  }, [esgData]);

  useEffect(() => {
    localStorage.setItem('tegram_active_tab', activeTab);
  }, [activeTab]);

  const handleLogin = (formattedName: string) => {
    setUser({
      name: formattedName,
      role: "Operador Sênior",
      location: "Porto de Itaqui",
      isLoggedIn: true
    });
    // Reset to dashboard upon fresh logs
    setActiveTab('dashboard');
    // Scroll to top so the user sees the header first
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
    localStorage.removeItem('tegram_user_profile');
    localStorage.removeItem('tegram_active_tab');
  };

  // Safe navigation shortcuts
  const handleNavigateToTab = (tabId: string) => {
    setActiveTab(tabId);
  };

  // Router matching
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardScreen 
            user={user} 
            course={course} 
            esg={esgData} 
            onNavigateToTab={handleNavigateToTab} 
          />
        );
      case 'lms':
        return <LMSScreen />;
      case 'field':
        return <FieldScreen />;
      case 'esg':
        return (
          <ESGScreen 
            esg={esgData} 
            onUpdateEsg={setEsgData} 
          />
        );
      default:
        return (
          <DashboardScreen 
            user={user} 
            course={course} 
            esg={esgData} 
            onNavigateToTab={handleNavigateToTab} 
          />
        );
    }
  };

  // Render Login overlay has highest priority
  if (!user.isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} initialNameInput="evanildo.barros" />;
  }

  // Master platform layout shell with responsive dimensions
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] font-sans flex flex-col relative w-full overflow-x-hidden">
      
      {/* Master Content Router */}
      <main className="flex-1 w-full max-w-md mx-auto bg-white border-l border-r border-[#EEEEEE] shadow-none min-h-screen pb-24 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FLOAT LOGOUT TRIGGER PANEL FOR CONVENIENCE */}
      <div className="fixed top-20 right-6 z-50 print:hidden hidden sm:block">
        <button 
          onClick={handleLogout}
          className="p-3.5 bg-white hover:bg-[#F5F5F5] text-[#1A1A1A] border border-[#EEEEEE] rounded-full shadow-none flex items-center justify-center transition-all cursor-pointer"
          title="Sair do Sistema"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* BOTTOM NAVIGATION TAB BAR */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-[#EEEEEE] bg-white/95 backdrop-blur-md z-40 py-3.5 px-4 flex items-center justify-around max-w-md mx-auto rounded-none print:hidden shadow-none">
        
        {/* TAB INDEX 1: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
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

        {/* TAB INDEX 2: LMS (EAD Classroom) */}
        <button
          onClick={() => setActiveTab('lms')}
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
            SSO/Terceiros
          </span>
        </button>

        {/* TAB INDEX 3: Field Operations */}
        <button
          onClick={() => setActiveTab('field')}
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

        {/* TAB INDEX 4: ESG Metrics Tracker */}
        <button
          onClick={() => setActiveTab('esg')}
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
}
