import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, MapPin, Leaf, Compass, 
  Send, Bot, Loader2, Sparkles, Radio
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, LMSCourse, ESGData, ChatMessage } from '../../types';
import { TERMINAL_STATUS_ITEMS } from '../../data';
import { useRouter } from '../../router';
import { useTheme } from '../../theme';

interface WebDashboardProps {
  user: UserProfile;
  course: LMSCourse;
  esg: ESGData;
}

export default function WebDashboard({ user, course, esg }: WebDashboardProps) {
  const { navigate } = useRouter();
  const { theme } = useTheme();
  
  // Live Clock
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

  // Terminal Camera State
  const [activeCameraIdx, setActiveCameraIdx] = useState(0);
  const currentCamera = TERMINAL_STATUS_ITEMS[activeCameraIdx];

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Olá, ${user.name.split(' ')[0]}! Sou o Tegram Assistente. Como posso apoiar você nas operações do porto, mobilizações de NRs ou vistorias de campo hoje?`,
      timestamp: '15:15'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollChatToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollChatToBottom();
  }, [messages, isTyping]);

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

      if (!response.ok) throw new Error("Erro de comunicação com o servidor.");
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.text || "Desculpe, tive um problema ao processar sua requisição.",
        timestamp: timeStr
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: `ai-err-${Date.now()}`,
        sender: 'assistant',
        text: "Houve um erro de rede. Rodando em modo simulação.",
        timestamp: timeStr
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  // Preloaded Suggestion Prompts
  const suggestions = [
    "Preciso cadastrar novos funcionários da contratada Metalúrgica Silva. O que fazer?",
    "Quais exames ou ASOs estão perto de vencer?",
    "Como faço para registrar uma vistoria de capina do pátio?",
    "Qual é a nossa pegada de CO2 este mês?"
  ];

  return (
    <div className="h-full w-full flex p-6 gap-6 overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Left Column: Cameras + Stats */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-1">
        {/* Live Camera Monitor Card */}
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col relative transition-colors duration-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Monitor de Câmeras em Tempo Real</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Canal: {currentCamera.cameraName}</span>
          </div>

          <div className="relative aspect-video bg-slate-200 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group shadow-sm transition-colors duration-200">
            <img 
              src={currentCamera.placeholderUrl} 
              alt={currentCamera.cameraName}
              className="w-full h-full object-cover opacity-90 dark:opacity-80 group-hover:scale-105 transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Feed Overlay Info */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{currentCamera.location}</span>
                </div>
                <p className="text-[10px] text-slate-350">{currentCamera.description}</p>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-950/85 backdrop-blur-md rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-400">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                <span>LIVE {timeStr}</span>
              </div>
            </div>
          </div>

          {/* Camera Selectors */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            {TERMINAL_STATUS_ITEMS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setActiveCameraIdx(idx)}
                className={`py-2 px-3 rounded-lg border text-left transition-all ${
                  activeCameraIdx === idx 
                    ? 'bg-slate-200 dark:bg-slate-900 border-cyan-500/50 dark:border-cyan-500/50 text-cyan-600 dark:text-cyan-400 font-semibold' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/40 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <p className="text-[10px] font-bold truncate">{item.cameraName}</p>
                <p className="text-[9px] opacity-60 truncate">{item.location}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* ESG Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-750 transition-all">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-3">
              <Leaf className="w-4 h-4" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Painel ESG (Este Mês)</h4>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-2xl font-black text-slate-900 dark:text-white">{esg.co2Current} tCO2e</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">Pegada de CO2 Atual ({esg.co2VsPrevPercent}% vs mês anterior)</p>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-slate-600 dark:text-slate-400 mb-1">
                  <span>Taxa de Reciclagem</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{esg.recycleRate}%</span>
                </div>
                <div className="w-full bg-slate-150 dark:bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="bg-emerald-500 h-full" style={{ width: `${esg.recycleRate}%` }} />
                </div>
              </div>
              <button 
                onClick={() => navigate('/web/esg')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all"
              >
                Detalhar Painel ESG
              </button>
            </div>
          </div>

          {/* Compliance SSO Card */}
          <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-750 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 mb-3">
                <Compass className="w-4 h-4" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Status de SSO e NRs</h4>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-150 dark:border-slate-900 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Total Horas Trabalhadas:</span>
                  <span className="font-bold text-slate-800 dark:text-white">14.2k+</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-150 dark:border-slate-900 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">ASO pendentes (&lt;30d):</span>
                  <span className="font-bold text-yellow-600 dark:text-yellow-500 animate-pulse">1 pendente</span>
                </div>
                <div className="flex justify-between items-center py-1.5 text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Alertas de segurança:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">0 pendentes</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => navigate('/web/treinamentos')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all mt-4"
            >
              Ver Matriz de NRs
            </button>
          </div>
        </div>
      </div>

      {/* Right Column: AI Assistant Chat */}
      <div className="w-[450px] bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm shrink-0 transition-colors duration-200">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center gap-3 transition-colors duration-200">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold text-slate-800 dark:text-white">Tegram Assistente</h3>
              <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            </div>
            <p className="text-[9px] text-cyan-600 dark:text-cyan-400 font-semibold uppercase tracking-wider leading-none mt-1">Especialista Portuário IA</p>
          </div>
        </div>

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/40"
        >
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user' 
                    ? 'bg-cyan-600 text-white dark:text-slate-950 rounded-tr-none font-medium shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}
              >
                {msg.text}
                <div className={`text-[8px] text-right mt-1.5 ${msg.sender === 'user' ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-400 rounded-2xl rounded-tl-none p-3 text-xs flex items-center gap-2 shadow-sm">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-500 dark:text-cyan-400" />
                <span>Pensando...</span>
              </div>
            </div>
          )}
        </div>

        {/* Prompts Suggestions Panel */}
        <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-150 dark:border-slate-900 space-y-2">
          <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Perguntas Sugeridas</p>
          <div className="flex flex-wrap gap-1.5 max-h-[85px] overflow-y-auto custom-scrollbar">
            {suggestions.map((s, i) => (
              <button 
                key={i}
                onClick={() => setInput(s)}
                className="text-[9px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200 rounded-md py-1.5 px-2.5 text-left truncate max-w-full transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <form 
          onSubmit={handleSend}
          className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 flex items-center gap-2 shrink-0"
        >
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pergunte ao Tegram Assistente..."
            className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          <button 
            type="submit"
            className="w-10 h-10 bg-cyan-600 hover:bg-cyan-500 text-white dark:text-slate-950 rounded-xl flex items-center justify-center transition-colors shadow-md active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
