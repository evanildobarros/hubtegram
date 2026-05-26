/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, Play, FileText, CheckCircle2, Award, 
  ArrowRight, BookOpen, Clock, AlertCircle, ChevronRight, Video,
  Users, ClipboardCheck, Bell, Shield, ShieldAlert, Check, Search, PlusCircle,
  Upload, HelpCircle, FileCheck, ArrowRightLeft, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LMSCourse, ContractorWorker } from '../types';
import { INITIAL_COURSES, INITIAL_CONTRACTOR_WORKERS } from '../data';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

const SAFETY_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Segundo a NR-29, qual o principal protocolo de segurança antes de iniciar serviços de solda nos silos de grãos?",
    options: [
      "Proceder com a medição de gases inflamáveis e poeira combustível em suspensão.",
      "Lavar o silos com mangueiras de compressão simples.",
      "Apenas utilizar óculos escuros e luvas de raspa.",
      "Desligar as luzes externas do pavilhão de moegas."
    ],
    correctIdx: 0,
    explanation: "Os silos de grãos acumulam poeira orgânica altamente combustível. A medição preventiva de atmosfera explosiva é obrigatória antes de qualquer faísca ou centelha!"
  },
  {
    id: 2,
    question: "Qual o procedimento de bloqueio de energia correto (LOTO) para reparo eletromecânico em uma correia transportadora?",
    options: [
      "Desligar a chave no controle central e avisar o colega mais próximo.",
      "Bloquear fisicamente o disjuntor na cabine elétrica com cadeado próprio, etiqueta de identificação e retenção da chave física.",
      "Colocar um cone de trânsito em cima do motor da correia.",
      "Iniciar a manutenção com a correia em baixa velocidade."
    ],
    correctIdx: 1,
    explanation: "O bloqueio de pane (Lockout/Tagout) garante o travamento físico com etiqueta pessoal impeditiva de religação acidental, salvando vidas durante serviços mecânicos."
  },
  {
    id: 3,
    question: "Qual é o nível máximo seguro de poeira orgânica residual acumulada em vigas estruturais para evitar incidentes explosivos secundários?",
    options: [
      "Até 5 centímetros de espessura.",
      "Camada inferior a 0.8 milímetros (menor que a espessura de um clipe de papel).",
      "Qualquer quantidade desde que o ar esteja ventilado.",
      "Não há limite especificado pelas seguradoras industriais."
    ],
    correctIdx: 1,
    explanation: "Camadas finíssimas de poeiras orgânicas de soja/farelo (acima de 0.8mm) depositadas em superfícies podem ser suspensas por vibração e desencadear explosões catastróficas."
  }
];

export default function LMSScreen() {
  // Navigation: Sub-tabs within SSO & Contractor Hub
  const [activeSubTab, setActiveSubTab] = useState<'cemp' | 'mobilization' | 'matrix' | 'nrs'>('matrix');

  // LMS / CEMP original states
  const [courses] = useState<LMSCourse[]>(INITIAL_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<LMSCourse>(INITIAL_COURSES[0]);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Contractor Workers list state with persistence
  const [workers, setWorkers] = useState<ContractorWorker[]>(() => {
    const cached = localStorage.getItem('tegram_contractor_workers');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_CONTRACTOR_WORKERS;
  });

  useEffect(() => {
    localStorage.setItem('tegram_contractor_workers', JSON.stringify(workers));
  }, [workers]);

  // Contractor Search state
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mobilization Form State
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerContractor, setNewWorkerContractor] = useState('Maranhão Montagens Industriais Ltd.');
  const [newWorkerRole, setNewWorkerRole] = useState('');
  const [newWorkerAsoDays, setNewWorkerAsoDays] = useState('180');
  const [selectedDocs, setSelectedDocs] = useState({
    aso: false,
    contract: false,
    trainings: false
  });
  const [isMobilizing, setIsMobilizing] = useState(false);
  const [mobilizeResult, setMobilizeResult] = useState<string | null>(null);

  // Filtered workers representation for matrix
  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Countdown calculations & status getters
  const getDaysLeftLabel = (days: number) => {
    if (days < 0) return `Vencido há ${Math.abs(days)} dias`;
    if (days === 0) return "Vence hoje!";
    return `${days} dias restantes`;
  };

  const getStatusColor = (days: number, extraExpired = false) => {
    if (days < 0 || extraExpired) return 'bg-red-50 text-red-700 border-red-200';
    if (days <= 30) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  const activeQuestion = SAFETY_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
  };

  const handleAnswerSubmit = () => {
    if (selectedOption === null || answered) return;
    if (selectedOption === activeQuestion.correctIdx) {
      setScore(prev => prev + 1);
    }
    setAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setAnswered(false);
    if (currentIdx < SAFETY_QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      alert(`Parabéns! Você concluiu o simulado regulamentar de segurança TEGRAM. Pontuação: ${score + (selectedOption === activeQuestion.correctIdx ? 1 : 0)} de ${SAFETY_QUIZ_QUESTIONS.length}`);
      setActiveQuiz(false);
      setCurrentIdx(0);
      setScore(0);
    }
  };

  // Safe file selector toggle simulator
  const toggleDocSelected = (docType: 'aso' | 'contract' | 'trainings') => {
    setSelectedDocs(prev => ({
      ...prev,
      [docType]: !prev[docType]
    }));
  };

  // Submit and Mobilize Contractor Worker logic with real validations!
  const handleMobilizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName.trim() || !newWorkerRole.trim()) {
      alert("Por favor, preencha o nome do profissional e o cargo.");
      return;
    }

    setIsMobilizing(true);
    setMobilizeResult(null);

    // Realistic validation audit delay
    setTimeout(() => {
      const allApproved = selectedDocs.aso && selectedDocs.contract && selectedDocs.trainings;
      const daysLeft = parseInt(newWorkerAsoDays) || 120;
      
      const newWorker: ContractorWorker = {
        id: `worker-${Date.now()}`,
        name: newWorkerName,
        contractor: newWorkerContractor,
        role: newWorkerRole,
        asoExpires: new Date(Date.now() + daysLeft * 24 * 3600 * 1000).toISOString().split('T')[0],
        asoDaysLeft: daysLeft,
        nr10Status: 'VALIDO',
        nr35Status: allApproved ? 'VALIDO' : 'NAO_APLICAVEL',
        nr29Status: 'VALIDO',
        documentsUploaded: { ...selectedDocs },
        mobilized: allApproved
      };

      setWorkers(prev => [newWorker, ...prev]);
      setIsMobilizing(false);

      if (allApproved) {
        setMobilizeResult("合格 APPROVED");
        alert(`Tudo aprovado e tudo beleza! O profissional ${newWorkerName} foi homologado e está totalmente liberado para integração e treinamentos!`);
        // Reset form
        setNewWorkerName('');
        setNewWorkerRole('');
        setSelectedDocs({ aso: false, contract: false, trainings: false });
      } else {
        setMobilizeResult("PENDENTE AUDITORIA");
        alert(`Registro criado, porém constam pendências documentais. O profissional ficará bloqueado para mobilização direta até o envio de todos os documentos obrigatórios.`);
      }
    }, 1200);
  };

  // Release/Approve and authorize manually simulated action button inside the table
  const handleManualApprove = (id: string) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === id) {
        alert(`Autorizando profissional: ${w.name}.\nDocumentação homologada! Mudando status para Mobilizado.`);
        return {
          ...w,
          documentsUploaded: { aso: true, contract: true, trainings: true },
          nr35Status: 'VALIDO',
          asoDaysLeft: w.asoDaysLeft < 0 ? 120 : w.asoDaysLeft,
          mobilized: true
        };
      }
      return w;
    }));
  };

  // Expiring count helper for alert bar
  const criticalCount = workers.filter(w => w.asoDaysLeft <= 30 || !w.mobilized).length;

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-24 font-sans select-none text-left">
      {/* SSO Master Header (Padrão GNOME Adwaita) */}
      <header className="sticky top-0 bg-white border-b border-[#EEEEEE] h-18 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-black text-white rounded-xl">
            <ClipboardCheck className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#888888] font-bold tracking-widest uppercase leading-none">SGSO Portuário</span>
            <span className="text-sm font-bold text-[#1A1A1A] tracking-tighter">SSO &amp; Gestão de Terceiros</span>
          </div>
        </div>
      </header>

      {/* SUB-TAB NAV BAR (Fedora Rounded Switch Pill) */}
      <div className="px-6 pt-5">
        <div className="bg-[#FAF9FA] border border-[#EEEEEE] p-1 rounded-2xl flex max-w-md mx-auto">
          <button 
            onClick={() => { setActiveSubTab('matrix'); setIsPlayingVideo(false); setActiveQuiz(false); }}
            className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
              activeSubTab === 'matrix' ? 'bg-white text-black border border-[#EEEEEE] shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Matriz SSO</span>
          </button>
          <button 
            onClick={() => { setActiveSubTab('mobilization'); setIsPlayingVideo(false); setActiveQuiz(false); }}
            className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
              activeSubTab === 'mobilization' ? 'bg-white text-black border border-[#EEEEEE] shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Mobilização</span>
          </button>
          <button 
            onClick={() => { setActiveSubTab('cemp'); setIsPlayingVideo(false); setActiveQuiz(false); }}
            className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
              activeSubTab === 'cemp' ? 'bg-white text-black border border-[#EEEEEE] shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            <span>CEMP Aulas</span>
          </button>
          <button 
            onClick={() => { setActiveSubTab('nrs'); setIsPlayingVideo(false); setActiveQuiz(false); }}
            className={`flex-1 py-3 text-[10px] uppercase font-bold tracking-wider rounded-xl transition-all flex flex-col items-center justify-center space-y-0.5 cursor-pointer ${
              activeSubTab === 'nrs' ? 'bg-white text-black border border-[#EEEEEE] shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            <span>Minuto NR</span>
          </button>
        </div>
      </div>

      <div className="p-6 max-w-md mx-auto w-full">

        <AnimatePresence mode="wait">
          {/* ====================================================================== */}
          {/* SUBTAB 1: MATRIZ DE TREINAMENTOS E CERTIFICADOS */}
          {/* ====================================================================== */}
          {activeSubTab === 'matrix' && (
            <motion.div
              key="matrix"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Qualificações e ASOS</span>
                <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
                  Controle de <span className="font-bold">Capacitações</span>
                </h2>
                <p className="text-[13px] text-[#888888] mt-2 leading-relaxed">
                  Busca em tempo real de conformidade médica e regulamentações e exames de frentes de trabalho terceirizadas.
                </p>
              </div>

              {/* AUTOMATIC SSO ALERTS SEGMENT */}
              <div className="bg-white border border-[#EEEEEE] p-4 rounded-3xl space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                  <Bell className="w-4.5 h-4.5 text-[#1A1A1A] animate-pulse" />
                  <span>Notificações Automáticas ({criticalCount})</span>
                </div>
                
                {criticalCount === 0 ? (
                  <p className="text-[11.5px] text-green-700 font-mono">✓ Todas as capacitações e exames estão regulares.</p>
                ) : (
                  <div className="space-y-2">
                    <div className="p-3 bg-red-50/70 border border-red-100 rounded-xl flex items-start space-x-2.5 text-[11.5px]">
                      <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-red-800">Bloqueio Operacional Detectado:</span>
                        <p className="text-red-700/95 mt-0.5 font-sans leading-normal">
                          Ana Souza e Claudio Pinheiro constam com capacitações (NR-35/29) ou ASOs vencidos. Proporcione recapacitação imediatamente antes do check-in de campo.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-start space-x-2.5 text-[11.5px]">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-800">Exame Médico ASO próximo ao vencimento:</span>
                        <p className="text-amber-700/95 mt-0.5 font-sans leading-normal">
                          Mário Silva de Oliveira possui exame ASO válido por menos de 20 dias (Vence em 15/06/2026).
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* SEARCH FILTER BOX */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  placeholder="Pesquisar contratada, trabalhador ou cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#FAF9FA] border border-[#EEEEEE] rounded-2xl pl-11 pr-4 py-3.5 text-xs text-[#1A1A1A] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-black focus:bg-white transition-all"
                />
              </div>

              {/* WORKERS ITERATOR LIST */}
              <div className="space-y-4">
                {filteredWorkers.length === 0 ? (
                  <div className="text-center py-8 text-[11.5px] text-[#888888] font-mono uppercase tracking-widest">
                    Nenhum profissional encontrado com os filtros.
                  </div>
                ) : (
                  filteredWorkers.map((w) => (
                    <div 
                      key={w.id}
                      className="bg-white border border-[#EEEEEE] rounded-[24px] p-5 text-left relative overflow-hidden"
                    >
                      {/* Top identity row */}
                      <div className="flex items-start justify-between mb-3.5">
                        <div className="text-left">
                          <h4 className="font-bold text-sm text-[#1A1A1A] tracking-tight">{w.name}</h4>
                          <span className="text-[10px] font-bold text-[#888888] block uppercase tracking-wider">{w.contractor}</span>
                        </div>
                        
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${
                          w.mobilized 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {w.mobilized ? 'Mobilizado' : 'Bloqueado'}
                        </span>
                      </div>

                      <div className="border-t border-[#FAFAFA] pt-3 grid grid-cols-2 gap-3.5 text-[11px] mb-3.5">
                        <div>
                          <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest block mb-0.5">Cargo Terceiro</span>
                          <span className="text-[#1A1A1A] font-semibold">{w.role}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest block mb-0.5">Validade ASO</span>
                          <span className={`font-mono text-[10px] font-bold border px-1.5 py-0.5 rounded ${getStatusColor(w.asoDaysLeft)}`}>
                            {getDaysLeftLabel(w.asoDaysLeft)}
                          </span>
                        </div>
                      </div>

                      {/* Training matrices status badges row */}
                      <div className="bg-[#FAF9FA] border border-[#EEEEEE] px-3.5 py-2 rounded-xl flex items-center justify-between text-[10px] font-bold font-mono">
                        <div className="flex items-center space-x-1">
                          <span className="text-[#888888] uppercase">NR-10:</span>
                          <span className={w.nr10Status === 'VALIDO' ? 'text-green-600' : 'text-slate-400'}>{w.nr10Status}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[#888888] uppercase">NR-35:</span>
                          <span className={w.nr35Status === 'VALIDO' ? 'text-green-600' : w.nr35Status === 'EXPIRADO' ? 'text-red-600' : 'text-slate-400'}>{w.nr35Status}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <span className="text-[#888888] uppercase">NR-29:</span>
                          <span className={w.nr29Status === 'VALIDO' ? 'text-green-600' : w.nr29Status === 'EXPIRADO' ? 'text-red-500 font-extrabold' : 'text-slate-400'}>{w.nr29Status}</span>
                        </div>
                      </div>

                      {/* Unlock action block if blocked */}
                      {!w.mobilized && (
                        <div className="mt-3.5 flex items-center justify-between bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-dashed border-[#EEEEEE]">
                          <span className="text-[10px] text-[#888888] font-medium">Possui documentos integrados?</span>
                          <button
                            onClick={() => handleManualApprove(w.id)}
                            className="text-[9px] font-bold uppercase tracking-widest bg-[#1A1A1A] hover:bg-black text-white px-3 py-1.5 rounded-lg flex items-center transition-colors cursor-pointer"
                          >
                            <FileCheck className="w-3 h-3 mr-1" />
                            Aprovar e Liberar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ====================================================================== */}
          {/* SUBTAB 2: PORTAL DE MOBILIZACAO E UPLOAD DE DOCUMENTOS */}
          {/* ====================================================================== */}
          {activeSubTab === 'mobilization' && (
            <motion.div
              key="mobilization"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Portal do Credenciado</span>
                <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
                  Mobilizar <span className="font-bold">Profissional</span>
                </h2>
                <p className="text-[13px] text-[#888888] mt-2 leading-relaxed">
                  Realize o pré-cadastro e anexe os exames ASO e certificações técnicas necessárias do contratado terceirizado.
                </p>
              </div>

              <form onSubmit={handleMobilizeSubmit} className="bg-white border border-[#EEEEEE] p-5 rounded-[24px] text-left space-y-4">
                <div className="flex items-center space-x-2 border-b border-[#EEEEEE] pb-3 mb-1">
                  <PlusCircle className="w-4.5 h-4.5 text-slate-800" />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Formulário de Credenciamento</span>
                </div>

                {/* Worker basic inputs */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Carlos Heitor Silveira"
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Empresa Contratada</label>
                    <select
                      value={newWorkerContractor}
                      onChange={(e) => setNewWorkerContractor(e.target.value)}
                      className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none text-xs font-semibold"
                    >
                      <option value="Maranhão Montagens Industriais Ltd.">Maranhão Montagens</option>
                      <option value="EngeVolt Serviços Elétricos">EngeVolt Serviços</option>
                      <option value="Consórcio Norte de Logística">Consórcio Norte</option>
                      <option value="Delta Conservação Portuária">Delta Conservação</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Cargo / Função</label>
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Montador Mecânico"
                      value={newWorkerRole}
                      onChange={(e) => setNewWorkerRole(e.target.value)}
                      className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Validade Próximo ASO (Dias)</label>
                  <select
                    value={newWorkerAsoDays}
                    onChange={(e) => setNewWorkerAsoDays(e.target.value)}
                    className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none text-xs font-semibold"
                  >
                    <option value="180">6 Meses (180 dias)</option>
                    <option value="120">4 Meses (120 dias)</option>
                    <option value="60">2 Meses (60 dias)</option>
                    <option value="15">Crítico (15 dias)</option>
                  </select>
                </div>

                {/* Simulated Document check boxes */}
                <div className="space-y-2 pt-2 text-left">
                  <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider mb-2">Upload de Envelopes Obrigatórios</label>
                  
                  {/* Item 1: ASO file box */}
                  <div 
                    onClick={() => toggleDocSelected('aso')}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      selectedDocs.aso 
                        ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                        : 'bg-[#FAF9FA] border-[#EEEEEE] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 text-xs text-left">
                      <Upload className={`w-4 h-4 ${selectedDocs.aso ? 'text-green-600' : 'text-slate-400'}`} />
                      <span>{selectedDocs.aso ? '✓ Atestado de Saúde Ocupacional (ASO).pdf' : 'Anexar Atestado ASO'}</span>
                    </div>
                    {selectedDocs.aso && <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />}
                  </div>

                  {/* Item 2: RG/Ficha Cadastral file box */}
                  <div 
                    onClick={() => toggleDocSelected('contract')}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      selectedDocs.contract 
                        ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                        : 'bg-[#FAF9FA] border-[#EEEEEE] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 text-xs text-left">
                      <Upload className={`w-4 h-4 ${selectedDocs.contract ? 'text-green-600' : 'text-slate-400'}`} />
                      <span>{selectedDocs.contract ? '✓ Ficha Cadastral & Contratos Homologados.pdf' : 'Anexar Ficha Cadastral de Terceiro'}</span>
                    </div>
                    {selectedDocs.contract && <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />}
                  </div>

                  {/* Item 3: Training Certifs file box */}
                  <div 
                    onClick={() => toggleDocSelected('trainings')}
                    className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-colors ${
                      selectedDocs.trainings 
                        ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                        : 'bg-[#FAF9FA] border-[#EEEEEE] text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 text-xs text-left">
                      <Upload className={`w-4 h-4 ${selectedDocs.trainings ? 'text-green-600' : 'text-slate-400'}`} />
                      <span>{selectedDocs.trainings ? '✓ Certificados Curso de NRs Obrigatórias.zip' : 'Anexar Certificados NR-29/35/10'}</span>
                    </div>
                    {selectedDocs.trainings && <CheckCircle2 className="w-4.5 h-4.5 text-green-600" />}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isMobilizing}
                  className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isMobilizing ? (
                    <>
                      <RefreshCw className="w-4 tracking-normal h-4 animate-spin text-white" />
                      <span>Auditando documentos...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4.5 h-4.5" />
                      <span>Submeter Pré-Mobilização</span>
                    </>
                  )}
                </button>
              </form>

              {/* Validation alert logic feedback */}
              {mobilizeResult && (
                <div className={`p-4 rounded-2xl border text-[12.5px] leading-relaxed text-left ${
                  selectedDocs.aso && selectedDocs.contract && selectedDocs.trainings
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-amber-50 border-amber-200 text-amber-800'
                }`}>
                  <div className="flex items-center space-x-2 font-bold uppercase tracking-wider mb-1.5 text-xs">
                    <Shield className="w-4 h-4 shrink-0" />
                    <span>Resultado do Auditador Automático</span>
                  </div>
                  {selectedDocs.aso && selectedDocs.contract && selectedDocs.trainings ? (
                    <p>
                      <strong>✓ Liberado:</strong> Todos os sub-envelopes foram auditados com integridade e assinatura digital legal. O funcionário foi cadastrado no log operacional e está liberado para trânsito no pátio.
                    </p>
                  ) : (
                    <p>
                      <strong>▲ Pendências:</strong> Foram anexados apenas alguns documentos. O trabalhador está registrado de forma segura no banco local, porém consta com o status <strong>Bloqueado</strong>. Colete as pendências no pátio administrativo para liberação de tag de rádio.
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* ====================================================================== */}
          {/* SUBTAB 3: CEMP REGULATORY EDUCATION AND TRAINING (Preserves original code!) */}
          {/* ====================================================================== */}
          {activeSubTab === 'cemp' && (
            <motion.div
              key="cemp"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Módulos Escola CEMP</span>
                <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
                  Vídeo-aulas e <span className="font-bold">Avaliações</span>
                </h2>
                <p className="text-[13px] text-[#888888] mt-2 leading-relaxed">
                  Consulte os materiais didáticos, vídeos das normas regulamentares e complete simulados técnicos de pontuação.
                </p>
              </div>

              {/* List of active qualification modules */}
              <div className="space-y-4">
                {courses.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => {
                      setSelectedCourse(c);
                      setIsPlayingVideo(false);
                      setActiveQuiz(false);
                    }}
                    className={`p-5 rounded-[24px] border transition-all duration-150 cursor-pointer text-left ${
                      selectedCourse.id === c.id 
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                        : 'bg-white border-[#EEEEEE] text-[#1A1A1A] hover:border-[#CCCCCC]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3.5">
                      <span className={`text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded-full ${
                        selectedCourse.id === c.id 
                          ? 'bg-white/10 text-white' 
                          : 'bg-[#F5F5F5] text-[#888888]'
                      }`}>
                        {c.subject}
                      </span>
                      
                      <span className={`text-xs font-bold ${
                        selectedCourse.id === c.id ? 'text-white/90' : 'text-[#888888]'
                      }`}>
                        {c.progress}% Concluído
                      </span>
                    </div>

                    <h4 className="font-bold text-[14px] leading-snug tracking-tight mb-4">
                      {c.title}
                    </h4>

                    {/* Progress visual mini-slider */}
                    <div className="w-full h-[3px] rounded-full overflow-hidden mb-3 bg-[#F0F0F0]/10" style={{ backgroundColor: selectedCourse.id === c.id ? 'rgba(255,255,255,0.1)' : '#F0F0F0' }}>
                      <div 
                        className={`h-full ${selectedCourse.id === c.id ? 'bg-white' : 'bg-[#1A1A1A]'}`}
                        style={{ width: `${c.progress}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] opacity-80 font-medium font-mono">
                      <span>{c.group}</span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {c.materialsCount} aulas
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Classroom detail panel */}
              <div className="bg-white rounded-[24px] border border-[#EEEEEE] overflow-hidden p-6">
                <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 mb-4">
                  <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest leading-none">
                    Vídeo Player Integrado
                  </span>
                  <BookOpen className="w-4 h-4 text-[#888888]" />
                </div>

                <h3 className="text-base font-bold text-[#1A1A1A] tracking-tight leading-snug mb-2">
                  {selectedCourse.title}
                </h3>

                {/* Interactive simulated player / video viewer */}
                {!isPlayingVideo ? (
                  <div 
                    onClick={() => setIsPlayingVideo(true)}
                    className="relative h-40 bg-[#FAF9FA] border border-[#EEEEEE] border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center text-[#1A1A1A] cursor-pointer group py-6"
                  >
                    <div className="p-3 bg-white border border-[#EEEEEE] rounded-full group-hover:scale-105 transition-transform duration-250 text-[#1A1A1A]">
                      <Play className="w-4.5 h-4.5 fill-current translate-x-[1px]" />
                    </div>
                    <span className="text-[10px] font-bold tracking-widest mt-3.5 uppercase text-[#1A1A1A]">
                      Iniciar Treinamento Virtual
                    </span>
                    <span className="text-[9px] text-[#888888] font-mono mt-1">
                      Módulo interativo de reciclagem portuária
                    </span>
                  </div>
                ) : (
                  <div className="bg-black rounded-2xl overflow-hidden p-4 relative h-40 flex flex-col justify-between text-left">
                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="font-mono text-white flex items-center tracking-widest text-[9px] uppercase">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse mr-1.5" />
                        Reproduzindo video do curso
                      </span>
                      <button 
                        onClick={() => setIsPlayingVideo(false)}
                        className="text-white/60 hover:text-white font-mono text-[10px] uppercase"
                      >
                        [Fechar]
                      </button>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center space-y-1.5 py-4">
                      <Video className="w-7 h-7 text-white animate-bounce" />
                      <span className="text-[11.5px] text-white/95 font-medium font-sans">
                        Demonstração Técnica Regulamentar CEMP
                      </span>
                    </div>

                    {/* Progress timeline visual bar */}
                    <div className="space-y-1">
                      <div className="w-full h-[2px] bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white w-[35%]" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Simulated quiz */}
                {!activeQuiz ? (
                  <div className="mt-5 space-y-4">
                    <div className="bg-[#FAF9FA] border border-[#EEEEEE] p-4 rounded-xl flex items-start space-x-3.5">
                      <FileText className="w-5 h-5 text-[#888888] shrink-0 mt-0.5" />
                      <div className="text-left">
                        <h4 className="text-[12px] font-bold text-[#1A1A1A]">Apostila CEMP (PDF)</h4>
                        <p className="text-[11px] text-[#888888] mt-1 leading-normal">Instruções de segurança para frentes de movimentação.</p>
                        <button 
                          type="button"
                          onClick={() => alert("Apostila do curso baixada com sucesso (CEMP-Class.pdf)")}
                          className="text-[10px] text-[#1A1A1A] font-bold underline hover:no-underline mt-1.5 block uppercase tracking-wider font-mono"
                        >
                          Baixar Anexo
                        </button>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setActiveQuiz(true);
                        setCurrentIdx(0);
                        setSelectedOption(null);
                        setAnswered(false);
                        setScore(0);
                      }}
                      className="w-full py-3.5 bg-neutral-100 hover:bg-[#FAF9FA] text-[#1A1A1A] border border-[#EEEEEE] font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                    >
                      <Award className="w-4 h-4 text-[#1A1A1A]" />
                      <span>Iniciar Simulado CEMP</span>
                    </button>
                  </div>
                ) : (
                  /* SIMULADO INTERATIVO */
                  <div className="mt-5 bg-white border border-[#EEEEEE] p-5 rounded-2xl text-left">
                    <div className="flex items-center justify-between mb-4 text-xs">
                      <span className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[10px]">
                        Questão {currentIdx + 1} de {SAFETY_QUIZ_QUESTIONS.length}
                      </span>
                      <span className="text-[#888888] font-mono">Pontos: {score}/{SAFETY_QUIZ_QUESTIONS.length}</span>
                    </div>

                    <h4 className="text-[13px] font-bold text-[#1A1A1A] leading-relaxed mb-4">
                      {activeQuestion.question}
                    </h4>

                    {/* Options layout */}
                    <div className="space-y-2 mb-4">
                      {activeQuestion.options.map((opt, oIdx) => {
                        let optStyle = "bg-[#FAFAFA] border-[#EEEEEE] text-[#1A1A1A]";
                        if (selectedOption === oIdx) {
                          optStyle = "bg-[#1A1A1A] border-[#1A1A1A] text-white";
                        }
                        if (answered) {
                          if (oIdx === activeQuestion.correctIdx) {
                            optStyle = "bg-green-50 border-green-300 text-green-900 font-bold";
                          } else if (selectedOption === oIdx) {
                            optStyle = "bg-red-50 border-red-200 text-red-900";
                          } else {
                            optStyle = "bg-white border-[#EEEEEE] text-[#BBBBBB] opacity-50";
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(oIdx)}
                            disabled={answered}
                            className={`w-full p-3.5 rounded-xl border text-left text-[12px] leading-relaxed transition-all flex items-start space-x-2.5 ${optStyle} cursor-pointer`}
                          >
                            <span className="font-mono text-[10px] shrink-0 font-bold opacity-80">
                              {String.fromCharCode(65 + oIdx)})
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <div className="bg-[#FAF9FA] border-l-2 border-black p-3 rounded-xl mb-4 text-[11px] text-left">
                        <div className="flex items-center space-x-1 font-bold text-[#1A1A1A] uppercase tracking-widest text-[9px] mb-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Instrução técnica</span>
                        </div>
                        <p className="text-[#888888] leading-relaxed">{activeQuestion.explanation}</p>
                      </div>
                    )}

                    {!answered ? (
                      <button
                        onClick={handleAnswerSubmit}
                        disabled={selectedOption === null}
                        className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center transition-all disabled:opacity-40 cursor-pointer"
                      >
                        <span>Submeter Resposta</span>
                        <ChevronRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    ) : (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-3.5 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center transition-all cursor-pointer"
                      >
                        <span>Avançar</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ====================================================================== */}
          {/* SUBTAB 4: NR SAFETY MANUAL GUIDE (NORMAS REGULAMENTADORAS) */}
          {/* ====================================================================== */}
          {activeSubTab === 'nrs' && (
            <motion.div
              key="nrs"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div>
                <span className="text-[11px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Biblioteca Regulamentar</span>
                <h2 className="text-2xl font-light text-[#1A1A1A] tracking-tight">
                  Atualizações de <span className="font-bold">Normas NRs</span>
                </h2>
                <p className="text-[13px] text-[#888888] mt-2 leading-relaxed">
                  Guia resumido e pragmático sobre diretrizes sanitárias, insalubridades e riscos físicos nas frentes portuárias de Itaqui.
                </p>
              </div>

              {/* Informative NR-29 Guide */}
              <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-5 space-y-4 text-left">
                <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#EEEEEE]">
                  <div className="p-1 px-2.5 bg-neutral-900 text-white rounded text-[11px] font-mono font-bold">NR-29</div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight">Segurança do Trabalho Portuário</h3>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed font-sans">
                  Garante a proteção de trabalhadores em embarcações, passagens, cais e armazéns terrestres.
                </p>
                <div className="bg-[#FAF9FA] p-3.5 rounded-xl border border-[#EEEEEE] text-[11.5px] text-slate-800 space-y-2">
                  <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-500">Obrigatoriedades em Foco:</span>
                  <p>✓ Controle rigoroso de ventilação mecânica e filtros antipoeira em galerias de esteiras transportadoras e moegas de grãos.</p>
                  <p>✓ Uso mandatado de trava-quedas, fardas com faixas refletivas e capacetes com jugular impeditiva de queda sob ventanias marinhas.</p>
                </div>
              </div>

              {/* Informative NR-15 Guide */}
              <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-5 space-y-4 text-left">
                <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#EEEEEE]">
                  <div className="p-1 px-2.5 bg-neutral-900 text-white rounded text-[11px] font-mono font-bold">NR-15</div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight">Insalubridades e Ruídos</h3>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed font-sans">
                  Estabelece limites de ruídos industriais e vibrações que caracterizam agentes insalubres e aposentadoria especial.
                </p>
                <div className="bg-[#FAF9FA] p-3.5 rounded-xl border border-[#EEEEEE] text-[11.5px] text-slate-800 space-y-2">
                  <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-500">Limites e Equipamentos:</span>
                  <p>✓ Ruído contínuo máximo de 85 dB(A) para jornadas de 8 horas. No interior de salas de máquinas portuárias, protetores do tipo concha são indispensáveis.</p>
                  <p>✓ Monitoramento constante de poeiras orgânicas e sílica livre geradoras de pneumoconioses em silos herméticos de carga.</p>
                </div>
              </div>

              {/* Informative NR-16 Guide */}
              <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-5 space-y-4 text-left">
                <div className="flex items-center space-x-2.5 pb-2.5 border-b border-[#EEEEEE]">
                  <div className="p-1 px-2.5 bg-neutral-900 text-white rounded text-[11px] font-mono font-bold">NR-16</div>
                  <h3 className="text-sm font-bold text-[#1A1A1A] tracking-tight">Atividades e Setores Perigosos</h3>
                </div>
                <p className="text-[12px] text-slate-600 leading-relaxed font-sans">
                  Normativas financeiras e protocolares sobre as áreas de inflamabilidade, explosivos e radiação ionizante no cais.
                </p>
                <div className="bg-[#FAF9FA] p-3.5 rounded-xl border border-[#EEEEEE] text-[11.5px] text-slate-800 space-y-2">
                  <span className="font-bold block uppercase tracking-wider text-[9px] text-slate-500">Perigo de Explosão Secondary:</span>
                  <p>✓ Estações de estocagem de farelos orgânicos estão enquadradas como risco devido ao potencial inflamável das nuvens de material dispersas.</p>
                  <p>✓ Protocolo de aterramento de cargas e eliminação de faíscas estáticas em toda a rede e trilhos de rolamento.</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
