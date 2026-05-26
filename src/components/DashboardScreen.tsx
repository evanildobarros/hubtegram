/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, RefreshCw, GraduationCap, Play, MoreHorizontal, 
  MapPin, ShieldAlert, CircleAlert, Leaf, Compass, 
  Send, Bot, Loader2, Sparkles, Battery
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, LMSCourse, TerminalStatus, ESGData, ChatMessage } from '../types';
import { TERMINAL_STATUS_ITEMS } from '../data';

interface DashboardScreenProps {
  user: UserProfile;
  course: LMSCourse;
  esg: ESGData;
  onNavigateToTab: (tabId: string) => void;
}

export default function DashboardScreen({ user, course, esg, onNavigateToTab }: DashboardScreenProps) {
  // Dynamics: Live Time Clock
  const [timeStr, setTimeStr] = useState("15:15");
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${hrs}:${mins}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000 * 30);
    return () => clearInterval(interval);
  }, []);

  // Terminal Status Camera Index Toggle
  const [activeCameraIdx, setActiveCameraIdx] = useState(0);
  const currentCamera = TERMINAL_STATUS_ITEMS[activeCameraIdx];

  // Chat/Tegram Assistante State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Olá, ${user.name.split(' ')[0]}! Aqui é o Tegram Assistente. Como posso apoiar você e o monitoramento das nossas metas operacionais, normas de segurança (NR-15/16/29) e indicadores ESG hoje?`,
      timestamp: '15:15'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto Scroll chat to bottom (only within the chat container, not the whole page)
  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };
  
  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isTyping]);

  // Handle Send Chat to Server-Proxy
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: timeStr
    };

    setMessages(prev => [...prev, newMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          chatHistory: messages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error("Falha na resposta do servidor.");
      }

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text,
        timestamp: timeStr
      }]);
    } catch (err) {
      console.error(err);
      // Fallback message local fail-safe
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "Desculpe, ocorreu uma oscilação na minha conexão com a rede de dados das moegas. Mas posso afirmar de forma segura que estamos operando de acordo com as especificações ambientais!",
        timestamp: timeStr
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] text-[#1A1A1A] pb-24 font-sans select-none">
      {/* HEADER BAR (Clean, minimalist white, border-b #EEEEEE) */}
      <header className="sticky top-0 bg-white border-b border-[#EEEEEE] h-18 px-6 flex items-center justify-between z-40 shadow-none">
        <div className="flex items-center space-x-4">
          <button className="p-1 px-2 rounded hover:bg-[#F5F5F5] transition-colors" onClick={() => alert("Menu de Sistemas TEGRAM OS aberto.")}>
            <Menu className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#888888] font-bold tracking-widest uppercase leading-none">TEGRAM OS</span>
            <span className="text-sm font-bold text-[#1A1A1A] tracking-tighter">Painel Principal</span>
          </div>
        </div>

        {/* Dynamic Battery and Clock indicators in monospace minimalist layout */}
        <div className="flex items-center space-x-3 font-mono text-[12px] text-[#888888]">
          <div className="flex items-center space-x-1.5 bg-[#F5F5F5] border border-[#EEEEEE] px-3 py-1 rounded-full text-[11px] font-sans font-medium">
            <Battery className="w-3.5 h-3.5 text-[#888888]" />
            <span>98%</span>
          </div>
          <span className="font-semibold text-[12px] text-[#1A1A1A]">{timeStr}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="p-1.5 hover:bg-[#F5F5F5] border border-transparent hover:border-[#EEEEEE] rounded text-[#888888] active:rotate-180 transition-transform duration-300"
            title="Recarregar"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Welcome banner */}
      <div className="p-6 pt-8 max-w-md mx-auto w-full">
        <div className="text-left mb-8">
          <span className="text-[11px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Visão Geral</span>
          <h1 className="text-3xl font-light text-[#1A1A1A] tracking-tight leading-snug">
            Bem-vindo, <span className="font-bold">{user.name.split(' ')[0]}</span>
          </h1>
          <p className="text-[13px] text-[#888888] mt-1.5 leading-normal">
            {user.role} • {user.location}
          </p>
        </div>

        {/* Small center logo row similar to screenshot 4 but ultra-minimalist */}
        <div className="flex items-center justify-between px-5 my-6 bg-white py-3 rounded-2xl border border-[#EEEEEE] w-full shadow-none text-left">
          <span className="text-xs tracking-widest font-bold text-[#1A1A1A]">TEGRAM®</span>
          <span className="text-[11px] font-mono text-[#888888]">ITAQUI SUITE</span>
        </div>

        {/* CARD 1: LMS Next Class details - Elegant Rounded Minimalism */}
        <motion.div 
          whileHover={{ y: -1 }}
          className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 mb-6 text-left transition-all duration-150 shadow-none"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 bg-[#F5F5F5] border border-[#EEEEEE] rounded-xl text-[#1A1A1A]">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <div className="text-left">
                <h3 className="text-[10px] font-bold text-[#AAAAAA] tracking-widest uppercase leading-none">PRÓXIMA AULA (EAD)</h3>
                <span className="text-[12px] text-[#888888] font-medium block mt-1">Treinamento Regulamentar</span>
              </div>
            </div>
            <span className="bg-[#1A1A1A] text-white text-[9px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              Em andamento
            </span>
          </div>

          <h2 className="text-lg font-bold text-[#1A1A1A] tracking-tight mb-3">
            {course.title}
          </h2>

          <div className="flex items-center justify-between text-[11px] text-[#888888] font-medium mb-4">
            <span>Turma Ter/Qui</span>
            <span>Progresso {course.progress}%</span>
          </div>

          {/* Progress loader - Clean matching grey indicator */}
          <div className="w-full h-1 bg-[#F5F5F5] rounded-full overflow-hidden mb-5">
            <div 
              className="h-full bg-[#1A1A1A] transition-all duration-500" 
              style={{ width: `${course.progress}%` }} 
            />
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onNavigateToTab('lms')}
              className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white text-[11px] font-bold tracking-widest uppercase rounded-xl flex items-center justify-center space-x-2 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Acessar Material</span>
            </button>
            <button 
              onClick={() => alert("As aulas de eletromecânica ocorrem na sala C-01 do bloco educacional.")}
              className="p-3 bg-white hover:bg-[#F5F5F5] border border-[#EEEEEE] rounded-xl text-[#888888] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-[#1A1A1A]" />
            </button>
          </div>
        </motion.div>

        {/* CARD 2: Terminal Status Live Camera Feed */}
        <motion.div 
          whileHover={{ y: -1 }}
          className="bg-white rounded-[24px] border border-[#EEEEEE] overflow-hidden mb-6 text-left transition-all duration-150 shadow-none"
        >
          <div className="p-5 border-b border-[#EEEEEE] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4.5 h-4.5 text-[#1A1A1A]" />
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest leading-none">
                Status do Terminal
              </h3>
            </div>
            
            {/* Minimalist Switch Selector */}
            <select 
              value={activeCameraIdx}
              onChange={(e) => setActiveCameraIdx(Number(e.target.value))}
              className="text-[11px] font-bold text-[#1A1A1A] bg-[#F5F5F5] border border-[#EEEEEE] rounded-lg px-2.5 py-1 outline-none cursor-pointer"
            >
              {TERMINAL_STATUS_ITEMS.map((item, idx) => (
                <option key={idx} value={idx}>{item.name}</option>
              ))}
            </select>
          </div>

          <div className="p-5">
            <div className="bg-[#FAF9FA] border border-[#EEEEEE] rounded-xl p-3 flex items-center justify-between mb-4 text-xs">
              <span className="font-bold text-[#888888] uppercase tracking-wider">{currentCamera.name}</span>
              <div className="flex items-center space-x-1.5 font-bold text-[#1A1A1A]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-300 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1A1A1A]"></span>
                </span>
                <span className="uppercase tracking-wider text-[11px]">Operação Normal</span>
              </div>
            </div>

            {/* Video Live feed mock */}
            <div className="relative h-44 rounded-xl overflow-hidden border border-[#EEEEEE] bg-slate-900 group">
              <img 
                src={currentCamera.cameraFeedUrl} 
                alt="Terminal Camera" 
                className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition-transform duration-350"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              
              {/* Overlay camera title with clean monospace elements */}
              <div className="absolute bottom-3.5 left-3.5 flex items-center space-x-2 text-white">
                <span className="h-1.5 w-1.5 bg-white rounded-full animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest uppercase">
                  Câmera Sul • {currentCamera.lastUpdated}
                </span>
              </div>

              {/* Watermark detail tag */}
              <div className="absolute top-3 right-3 text-white bg-black/50 px-2 py-0.5 rounded text-[10px] font-mono">
                30 FPS • HD
              </div>
            </div>
          </div>
        </motion.div>

        {/* CARD 3: ESG Summary Dashboard Panel */}
        <motion.div 
          onClick={() => onNavigateToTab('esg')}
          whileHover={{ y: -1 }}
          className="bg-white rounded-[24px] border border-[#EEEEEE] p-5 mb-6 text-left cursor-pointer transition-all duration-150 shadow-none"
        >
          <div className="flex items-center space-x-2 mb-4">
            <Leaf className="w-4.5 h-4.5 text-[#1A1A1A]" />
            <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest leading-none">
              Resumo ESG Portuário
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* Box 1: carbon */}
            <div className="bg-[#FAF9FA] border border-[#EEEEEE] rounded-xl p-3.5 text-left">
              <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase block mb-1">CO2</span>
              <div className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">Dentro da Meta</div>
              {/* Clean Grey/Black slider represent */}
              <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#1A1A1A]" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Box 2: recycling */}
            <div className="bg-[#FAF9FA] border border-[#EEEEEE] rounded-xl p-3.5 text-left">
              <span className="text-[10px] font-bold text-[#888888] tracking-widest uppercase block mb-1">Resíduos</span>
              <div className="text-[13px] font-bold text-[#1A1A1A] tracking-tight">{esg.recycleRate}% Reciclados</div>
              {/* Clean Grey/Black slider represent */}
              <div className="w-full h-[3px] bg-[#EEEEEE] rounded-full overflow-hidden mt-2">
                <div className="h-full bg-[#1A1A1A]" style={{ width: `${esg.recycleRate}%` }} />
              </div>
            </div>
          </div>

          {/* Accidents or alarms warning line */}
          <div className="border-t border-[#EEEEEE] pt-3 flex items-center justify-between text-[11px] text-[#888888] font-semibold uppercase tracking-wider">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-[#888888]" />
              <span>Alertas Ativos (NR)</span>
            </div>
            <span className="font-extrabold text-[#1A1A1A] text-[11px] bg-[#F5F5F5] border border-[#EEEEEE] px-3 py-0.5 rounded-full">
              {esg.nrAlertsActive}
            </span>
          </div>
        </motion.div>

        {/* CARD 4: Intelligent Assistant "Tegram Assistente" Chatbox - Clean Minimalist Conversational Panel */}
        <div className="bg-white rounded-[24px] border border-[#EEEEEE] overflow-hidden mb-3 text-left flex flex-col h-[360px] shadow-none">
          {/* Assistant header bar */}
          <div className="p-4 bg-white border-b border-[#EEEEEE] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="p-2 bg-[#1A1A1A] text-white rounded-full">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-[#1A1A1A] tracking-tight">Tegram Assistente</span>
                <span className="text-[9px] text-[#888888] font-mono flex items-center uppercase tracking-wider">
                  <Sparkles className="w-2.5 h-2.5 mr-0.5 text-[#1A1A1A]" />
                  Gemini 3.5 AI
                </span>
              </div>
            </div>
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
          </div>

          {/* Messages conversational overflow panel */}
          <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9FA]" style={{ contentVisibility: 'auto' }}>
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] rounded-[18px] p-3 text-[13px] flex flex-col space-y-1.5 leading-relaxed ${
                      msg.sender === 'user' 
                        ? 'bg-[#1A1A1A] text-white rounded-tr-xs shadow-none' 
                        : 'bg-white text-[#1A1A1A] border border-[#EEEEEE] rounded-tl-xs shadow-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <span className={`text-[9px] tracking-wider self-end font-mono ${
                      msg.sender === 'user' ? 'text-slate-300' : 'text-[#888888]'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-[#1A1A1A] border border-[#EEEEEE] rounded-[18px] rounded-tl-xs p-3 max-w-[80%] flex items-center space-x-2">
                    <Loader2 className="w-3.5 h-3.5 text-[#1A1A1A] animate-spin" />
                    <span className="text-[12px] font-medium text-[#AAAAAA]">Tegram está formulando...</span>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Message input formulary footer */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#EEEEEE] flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte sobre EPIs, CO2 ou normas..."
              className="flex-1 bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl px-4 py-3 text-[13px] text-[#1A1A1A] placeholder-[#AAAAAA] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] transition-all"
              disabled={isTyping}
            />
            <button
              type="submit"
              className="p-3 bg-[#1A1A1A] hover:bg-black text-white rounded-xl flex items-center justify-center transition-all duration-150 active:scale-95 disabled:opacity-50 h-10 w-10 shrink-0"
              disabled={!input.trim() || isTyping}
            >
              <Send className="w-4 h-4 fill-current" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

