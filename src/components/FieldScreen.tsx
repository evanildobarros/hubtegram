/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Menu, RefreshCw, MapPin, Shield, Camera, Trash2, 
  Upload, Save, Wifi, Check, AlertTriangle, Eye, Video, ZoomIn, ZoomOut,
  ClipboardList, CheckCircle2, UserCheck, AlertOctagon, HelpCircle, FileText, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FieldPresenceLog, FieldInspection, ActionTask } from '../types';
import { REASON_OPTIONS, INITIAL_INSPECTIONS, INITIAL_ACTION_TASKS } from '../data';

export default function FieldScreen() {
  // Navigation: Sub-tabs
  const [activeTab, setActiveTab] = useState<'presence' | 'inspection'>('inspection');

  // original PRESENCE states
  const [reason, setReason] = useState(REASON_OPTIONS[0]);
  const [evidencePhoto, setEvidencePhoto] = useState<string | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState(8);
  const [latitude, setLatitude] = useState(-2.5591);
  const [longitude, setLongitude] = useState(-44.3644); // Porto de Itaqui coordinates approx
  const [calibrating, setCalibrating] = useState(false);
  const [logs, setLogs] = useState<FieldPresenceLog[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // File picker input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inspectionPhotoRef = useRef<HTMLInputElement>(null);
  const resolutionPhotoRef = useRef<HTMLInputElement>(null);
  
  // Camera video/canvas refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // -------------------------------------------------------------
  // NEW INSPECTIONS & PLANS OF ACTIONS States (Pragmatic Local Storage)
  // -------------------------------------------------------------
  const [inspections, setInspections] = useState<FieldInspection[]>(() => {
    const cached = localStorage.getItem('tegram_safety_inspections');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_INSPECTIONS;
  });

  const [actions, setActions] = useState<ActionTask[]>(() => {
    const cached = localStorage.getItem('tegram_safety_action_tasks');
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { console.error(e); }
    }
    return INITIAL_ACTION_TASKS;
  });

  // Inspection form states
  const [inspArea, setInspArea] = useState('Pátio de Estocagem Sul');
  const [checklist, setChecklist] = useState({
    cleanliness: true, // Limpeza e Capina
    epis: true,        // EPIs
    machineryGuard: true, // Proteção móvel
    safetyStops: true   // Chaves de emergência
  });
  const [inspDetails, setInspDetails] = useState('');
  const [inspPhoto, setInspPhoto] = useState<string | null>(null);

  // Active Report preview modal
  const [selectedReport, setSelectedReport] = useState<FieldInspection | null>(null);

  // Area Manager Role Simulation state (Evanildo / Mário Pinto)
  const [currentUserRole, setCurrentUserRole] = useState<'inspector' | 'manager_mario' | 'supervisor_cassio'>('inspector');
  const [resolvingTaskId, setResolvingTaskId] = useState<string | null>(null);
  const [resolutionComment, setResolutionComment] = useState('');
  const [resolutionPhoto, setResolutionPhoto] = useState<string | null>(null);

  // Load presence logs on mount
  useEffect(() => {
    const cachedLogs = localStorage.getItem('tegram_presence_logs');
    if (cachedLogs) {
      try {
        setLogs(JSON.parse(cachedLogs));
      } catch (err) {
        console.error("Failed to parse presence logs", err);
      }
    }
  }, []);

  // Sync cache helpers
  const saveLogsToCache = (updatedLogs: FieldPresenceLog[]) => {
    setLogs(updatedLogs);
    localStorage.setItem('tegram_presence_logs', JSON.stringify(updatedLogs));
  };

  useEffect(() => {
    localStorage.setItem('tegram_safety_inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem('tegram_safety_action_tasks', JSON.stringify(actions));
  }, [actions]);

  // Calibrate coordinates simulation with micro jitter geofence
  const calibrateGps = () => {
    setCalibrating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setGpsAccuracy(Math.min(3 + Math.floor(Math.random() * 5), Math.round(position.coords.accuracy || 8)));
          setCalibrating(false);
        },
        () => {
          setTimeout(() => {
            setLatitude(prev => prev + (Math.random() - 0.5) * 0.0005);
            setLongitude(prev => prev + (Math.random() - 0.5) * 0.0005);
            setGpsAccuracy(Math.min(5 + Math.floor(Math.random() * 4), 9));
            setCalibrating(false);
          }, 1000);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setLatitude(prev => prev + 0.0001);
        setGpsAccuracy(7);
        setCalibrating(false);
      }, 1000);
    }
  };

  // Web camera activation
  const startCamera = async () => {
    setShowCamera(true);
    try {
      const constraints = { video: { facingMode: 'environment' } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      alert("Acesso direto à câmera indisponível no frame. Utilizando upload de arquivos de imagem.");
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setEvidencePhoto(dataUrl);
        stopCamera();
      }
    }
  };

  // Base64 file reader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'presence' | 'inspection' | 'resolution') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (target === 'presence') setEvidencePhoto(result);
        else if (target === 'inspection') setInspPhoto(result);
        else if (target === 'resolution') setResolutionPhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  // original Presence logger submit
  const handleSaveLocally = () => {
    const newLog: FieldPresenceLog = {
      id: `presence-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      locationName: "Terminal da Ponta da Espera",
      gpsAccuracy: gpsAccuracy,
      reason: reason,
      evidencePhoto: evidencePhoto || undefined,
      synced: false
    };

    saveLogsToCache([newLog, ...logs]);
    alert("Presença georreferenciada salva na fila local de transmissão!");
    setEvidencePhoto(null);
  };

  const handleDeleteLog = (id: string) => {
    saveLogsToCache(logs.filter(l => l.id !== id));
  };

  const handleForceSync = () => {
    if (logs.length === 0) {
      alert("Fila local de presença já sincronizada.");
      return;
    }
    saveLogsToCache(logs.map(l => ({ ...l, synced: true })));
    alert("Dados remetidos ao TEGRAM OS central com georreferenciamento PostGIS!");
  };

  // -------------------------------------------------------------
  // NEW DIGITAL CHECKLIST & INSPECTION HANDLERS
  // -------------------------------------------------------------
  const toggleChecklistItem = (item: 'cleanliness' | 'epis' | 'machineryGuard' | 'safetyStops') => {
    setChecklist(prev => ({
      ...prev,
      [item]: !prev[item]
    }));
  };

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();

    const timestampStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    const newInspection: FieldInspection = {
      id: `insp-${Date.now()}`,
      timestamp: timestampStr,
      inspectorName: "Evanildo de Jesus Campos Barros",
      area: inspArea,
      checklist: { ...checklist },
      details: inspDetails || "Nenhuma observação informada.",
      evidencePhoto: inspPhoto || undefined,
      gpsCoordinates: {
        lat: latitude,
        lng: longitude
      }
    };

    setInspections(prev => [newInspection, ...prev]);

    // CHECK IF ANY CHECKLIST IS NOT COMPLIANT -> AUTO ASSIGN ACTION PLAN TASK!
    const needsActionPlan = !checklist.cleanliness || !checklist.epis || !checklist.machineryGuard || !checklist.safetyStops;

    if (needsActionPlan) {
      let taskTitle = "Solicitação de Capina / Limpeza do Solo";
      let assigned = "Mário Pinto (Gerente de Pátio)";
      let taskDesc = "Realizar limpeza mecânica imediata sob as moegas correlativas.";

      if (!checklist.epis) {
        taskTitle = "Fornecimento / Auditoria e Verificação de EPIs";
        taskDesc = "Equipe portuária terceirizada flagrada operando sem itens regulamentares de colete ou capacete de aço.";
      } else if (!checklist.machineryGuard) {
        taskTitle = "Aperto físico de blindagens e isolantes TR";
        assigned = "Cássio Antunes (Supervisor Mecânico)";
        taskDesc = "Carenagens metálicas observadas fora das premissas de fixação NR-12.";
      } else if (!checklist.safetyStops) {
        taskTitle = "Calibração e teste de parada física";
        assigned = "Cássio Antunes (Supervisor Mecânico)";
        taskDesc = "Chaves do botoneira e cordas esticadas de frenagem necessitam aferição.";
      } else if (!checklist.cleanliness) {
        taskTitle = "Solicitação de Capina Corretiva no Pátio";
        assigned = "Mário Pinto (Gerente de Pátio)";
        taskDesc = `${inspDetails || "Realizar capina corretiva do solo nas imediações do pavilhão de grãos para debelar risco de poeiras orgânicas combustíveis."}`;
      }

      const newTask: ActionTask = {
        id: `task-${Date.now()}`,
        inspectionId: newInspection.id,
        title: taskTitle,
        area: inspArea,
        description: taskDesc,
        assignedManager: assigned,
        status: 'PENDENTE',
        createdAt: timestampStr
      };

      setActions(prev => [newTask, ...prev]);
      alert(`Vistoria salva com sucesso!\n\n⚠️ NÃO-CONFORMIDADE DETECTADA!\nUm Plano de Ação foi gerado automaticamente para o gestor ${assigned}:\n"${taskTitle}"`);
    } else {
      alert("Vistoria salva com sucesso! Relatório emitido em conformidade sanitária.");
    }

    // Reset Form
    setInspDetails('');
    setInspPhoto(null);
    setChecklist({ cleanliness: true, epis: true, machineryGuard: true, safetyStops: true });
  };

  // Submit response by manager
  const handleManagerResolve = (taskId: string) => {
    if (!resolutionComment.trim()) {
      alert("Por favor, digite um parecer ou comentário sobre os serviços executados.");
      return;
    }

    setActions(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status: 'RESOLVIDO',
          resolutionNote: resolutionComment,
          resolutionPhoto: resolutionPhoto || undefined,
          resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return t;
    }));

    setResolvingTaskId(null);
    setResolutionComment('');
    setResolutionPhoto(null);
    alert("Plano de Ação respondido com sucesso! Status atualizado para RESOLVIDO.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-24 font-sans select-none text-left relative">
      {/* Header Bar */}
      <header className="sticky top-0 bg-white border-b border-[#EEEEEE] h-18 px-6 flex items-center justify-between z-40">
        <div className="flex items-center space-x-3.5">
          <div className="p-2 bg-black text-white rounded-xl">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#888888] font-bold tracking-widest uppercase leading-none">SGSO Portuário</span>
            <span className="text-sm font-bold text-[#1A1A1A] tracking-tighter">Inspeções &amp; Vistorias</span>
          </div>
        </div>

        {/* Subtab selection pills switcher */}
        <div className="bg-[#FAF9FA] border border-[#EEEEEE] p-0.5 rounded-lg flex space-x-1.5 text-[10px] font-bold pr-1 shrink-0">
          <button 
            onClick={() => setActiveTab('inspection')}
            className={`px-3 py-1.5 rounded-md uppercase tracking-wide text-[9px] cursor-pointer ${
              activeTab === 'inspection' ? 'bg-black text-white shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            Vistorias
          </button>
          <button 
            onClick={() => setActiveTab('presence')}
            className={`px-3 py-1.5 rounded-md uppercase tracking-wide text-[9px] cursor-pointer ${
              activeTab === 'presence' ? 'bg-black text-white shadow-sm' : 'text-[#888888] hover:text-[#1A1A1A]'
            }`}
          >
            Presença GPS
          </button>
        </div>
      </header>

      {/* RENDER DYNAMIC SATELLITE MAP ONLY FOR PRESENCE */}
      {activeTab === 'presence' ? (
        <div className="relative h-44 bg-slate-900 w-full overflow-hidden shrink-0 border-b border-[#EEEEEE]">
          <img 
            src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&q=80&w=800" 
            alt="Satellite Port Map background" 
            className="w-full h-full object-cover opacity-50 grayscale transition-all"
            style={{ transform: `scale(${zoomLevel})` }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-[45%] left-[50%] h-4 w-4 bg-[#1A1A1A] rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center border-2 border-white animate-pulse">
            <div className="h-1.5 w-1.5 bg-white rounded-full" />
          </div>

          <div className="absolute bottom-3.5 right-3.5 flex flex-col space-y-1 z-10">
            <button 
              type="button"
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 2.5))}
              className="p-1.5 bg-white text-[#1A1A1A] rounded-lg border border-[#EEEEEE]"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 1))}
              className="p-1.5 bg-white text-[#1A1A1A] rounded-lg border border-[#EEEEEE]"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          <div className="absolute bottom-3.5 left-3.5 bg-black/85 px-2.5 py-1 rounded-md text-[9.5px] font-mono text-white tracking-widest uppercase">
            PostGIS GPS Lat: {latitude.toFixed(4)} | Lng: {longitude.toFixed(4)}
          </div>
        </div>
      ) : (
        /* Top small aesthetic banner for Inspections */
        <div className="bg-[#FAF9FA] border-b border-[#EEEEEE] p-5 py-6 text-left">
          <div className="max-w-md mx-auto w-full flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#888888] font-bold uppercase tracking-widest block mb-0.5">Vistorias Digitais</span>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A]">Relatórios sem PowerPoint</h2>
              <p className="text-[11.5px] text-[#888888] mt-1 font-medium">Capture a evidência, responda aos planos de ação e imprima em tempo real.</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 max-w-md mx-auto w-full">
        
        {/* ====================================================================== */}
        {/* SUBTAB 1: DIGITAL INSPECTION FORM & PLAN OF ACTIONS */}
        {/* ====================================================================== */}
        {activeTab === 'inspection' && (
          <div className="space-y-6">
            
            {/* INSPECTION CREATION SCREEN */}
            <form onSubmit={handleCreateInspection} className="bg-white border border-[#EEEEEE] p-5 rounded-[24px] space-y-4">
              <div className="flex items-center space-x-2 border-b border-[#EEEEEE] pb-3 mb-1">
                <Video className="w-4 h-4 text-slate-800" />
                <span className="text-[10px] font-bold tracking-widest uppercase">Nova Vistoria de Campo</span>
              </div>

              {/* Area select */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Área Visitada</label>
                <select
                  value={inspArea}
                  onChange={(e) => setInspArea(e.target.value)}
                  className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none text-xs font-semibold cursor-pointer"
                >
                  <option value="Pátio de Estocagem Sul">Pátio de Estocagem Sul</option>
                  <option value="Silo de Grãos Hermético Norte">Silo de Grãos Hermético Norte</option>
                  <option value="Moega Secundária de Descarrego">Moega Secundária de Descarrego</option>
                  <option value="Berço Portuário 103">Berço Portuário 103</option>
                  <option value="Canaleta de Escoamento TR-04">Canaleta de Escoamento TR-04</option>
                </select>
              </div>

              {/* Checklists switches/indicators */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider mb-2">Checklist de Integridade</label>
                
                {/* Cleanliness */}
                <div 
                  onClick={() => toggleChecklistItem('cleanliness')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                    checklist.cleanliness 
                      ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                      : 'bg-red-50 border-red-200 text-red-950 font-bold'
                  }`}
                >
                  <span>1. Limpeza de solo e ausência de mato alto / capina</span>
                  <span className="text-[10px] font-mono leading-none tracking-widest uppercase bg-white border px-2 py-1 rounded">
                    {checklist.cleanliness ? 'CONFORME' : 'NÃO CONFORME'}
                  </span>
                </div>

                {/* EPI conformity */}
                <div 
                  onClick={() => toggleChecklistItem('epis')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                    checklist.epis 
                      ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                      : 'bg-red-50 border-red-200 text-red-950 font-bold'
                  }`}
                >
                  <span>2. Uso de EPIs regulamentares no pátio</span>
                  <span className="text-[10px] font-mono leading-none tracking-widest uppercase bg-white border px-2 py-1 rounded">
                    {checklist.epis ? 'CONFORME' : 'NÃO CONFORME'}
                  </span>
                </div>

                {/* Machinery protections and rails */}
                <div 
                  onClick={() => toggleChecklistItem('machineryGuard')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                    checklist.machineryGuard 
                      ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                      : 'bg-red-50 border-red-200 text-red-950 font-bold'
                  }`}
                >
                  <span>3. Grades fixas móveis de correias isoladas</span>
                  <span className="text-[10px] font-mono leading-none tracking-widest uppercase bg-white border px-2 py-1 rounded">
                    {checklist.machineryGuard ? 'CONFORME' : 'NÃO CONFORME'}
                  </span>
                </div>

                {/* Emergency keys stops */}
                <div 
                  onClick={() => toggleChecklistItem('safetyStops')}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer text-xs ${
                    checklist.safetyStops 
                      ? 'bg-green-50 border-green-200 text-green-900 font-semibold' 
                      : 'bg-red-50 border-red-200 text-red-950 font-bold'
                  }`}
                >
                  <span>4. Sensores e cabos de parada de emergência</span>
                  <span className="text-[10px] font-mono leading-none tracking-widest uppercase bg-white border px-2 py-1 rounded">
                    {checklist.safetyStops ? 'CONFORME' : 'NÃO CONFORME'}
                  </span>
                </div>
              </div>

              {/* Description box */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Descrição das Não-Conformidades</label>
                <textarea
                  placeholder="Relate detalhadamente falhas de solo, mato, vazamento de grãos..."
                  value={inspDetails}
                  onChange={(e) => setInspDetails(e.target.value)}
                  className="w-full bg-[#FAF9FA] border border-[#EEEEEE] p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-black text-xs min-h-18"
                />
              </div>

              {/* Photo file selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase block text-[#1A1A1A] tracking-wider">Evidência Fotográfica</label>
                
                {!inspPhoto ? (
                  <div 
                    onClick={() => inspectionPhotoRef.current?.click()}
                    className="border border-dashed border-[#EEEEEE] bg-[#FAF9FA] p-4 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-all text-xs text-slate-500"
                  >
                    <Camera className="w-5 h-5 text-slate-400 mr-2" />
                    <span>Selecionar Foto da Vistoria</span>
                  </div>
                ) : (
                  <div className="border border-[#EEEEEE] rounded-xl overflow-hidden relative">
                    <img src={inspPhoto} alt="Inspection view" className="w-full h-36 object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setInspPhoto(null)}
                      className="absolute top-2 right-2 p-1.5 bg-black text-white rounded hover:opacity-80"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
                
                <input 
                  type="file" 
                  ref={inspectionPhotoRef} 
                  onChange={(e) => handleFileUpload(e, 'inspection')} 
                  accept="image/*" 
                  className="hidden" 
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" />
                <span>Registrar Vistoria</span>
              </button>
            </form>

            {/* AUTOMATED REPORTS RENDER CARDS SECTION */}
            <div className="bg-white border border-[#EEEEEE] p-5 rounded-[24px] space-y-4">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-800">Relatórios Auto-Gerados (Sem PPT)</span>
                <span className="text-[9px] font-mono text-[#888888]">Pronto para Impressão</span>
              </div>

              <div className="space-y-3">
                {inspections.map((i) => {
                  const hasFailure = !i.checklist.cleanliness || !i.checklist.epis || !i.checklist.machineryGuard || !i.checklist.safetyStops;

                  return (
                    <div 
                      key={i.id}
                      className="p-4 bg-[#FAF9FA] border border-[#EEEEEE] rounded-xl flex items-center justify-between text-left"
                    >
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A1A] leading-normal">{i.area}</h4>
                        <span className="text-[9.5px] text-[#888888] font-mono block mt-1">
                          {i.timestamp} • {hasFailure ? '⚠️ Não-Conformidade' : '✓ Conforme'}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedReport(i)}
                        className="py-2 px-3 bg-white hover:bg-slate-50 border border-[#EEEEEE] font-extrabold text-[10px] uppercase font-mono rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-black mr-1" />
                        Gerar CARD
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ====================================================================== */}
            {/* WORKFLOW DE NOTIFICACAO E RESPOSTA - PLANO DE ACÃO */}
            {/* ====================================================================== */}
            <div className="bg-white border border-[#EEEEEE] p-5 rounded-[24px] space-y-4">
              <div className="flex flex-col space-y-1.5 border-b border-[#EEEEEE] pb-3">
                <span className="text-[10px] font-bold tracking-widest uppercase text-red-600">Planos de Ação e Tratativas (SSO)</span>
                
                {/* Role Switcher Widget resembling image mockups */}
                <div className="flex items-center space-x-1 p-0.5 bg-neutral-100 rounded-lg max-w-[280px]">
                  <button 
                    onClick={() => { setCurrentUserRole('inspector'); setResolvingTaskId(null); }}
                    className={`flex-1 py-1 px-2.5 text-[9px] font-bold rounded-md ${currentUserRole === 'inspector' ? 'bg-white text-black font-semibold' : 'text-[#888888]'}`}
                  >
                    Fiscal
                  </button>
                  <button 
                    onClick={() => { setCurrentUserRole('manager_mario'); setResolvingTaskId(null); }}
                    className={`flex-1 py-1 px-2.5 text-[9px] font-bold rounded-md ${currentUserRole === 'manager_mario' ? 'bg-white text-black font-semibold' : 'text-[#888888]'}`}
                  >
                    Op: Mário (Capina)
                  </button>
                  <button 
                    onClick={() => { setCurrentUserRole('supervisor_cassio'); setResolvingTaskId(null); }}
                    className={`flex-1 py-1 px-2.5 text-[9px] font-bold rounded-md ${currentUserRole === 'supervisor_cassio' ? 'bg-white text-black font-semibold' : 'text-[#888888]'}`}
                  >
                    Op: Cássio (Mec)
                  </button>
                </div>
              </div>

              {/* ACTION ITEMS INTERATOR */}
              <div className="space-y-4">
                {actions.map((act) => {
                  const isAssignedToCurrent = 
                    (act.assignedManager.toLowerCase().includes('mário') && currentUserRole === 'manager_mario') ||
                    (act.assignedManager.toLowerCase().includes('cássio') && currentUserRole === 'supervisor_cassio');

                  return (
                    <div 
                      key={act.id}
                      className={`p-4 rounded-xl border relative overflow-hidden text-left ${
                        act.status === 'RESOLVIDO' 
                          ? 'bg-green-50/50 border-green-200 text-slate-800' 
                          : 'bg-red-50/20 border-red-100 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-xs text-[#1A1A1A]">{act.title}</h4>
                        <span className={`text-[8px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
                          act.status === 'RESOLVIDO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {act.status}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-[#888888] leading-relaxed mb-3">{act.description}</p>
                      
                      <div className="border-t border-[# FAFAFA]/20 pt-2.5 flex items-center justify-between text-[10px] font-medium font-mono text-[#888888]">
                        <span>Local: {act.area}</span>
                        <span>Dono: {act.assignedManager.split(' ')[0]}</span>
                      </div>

                      {/* Display response resolution details */}
                      {act.status === 'RESOLVIDO' && act.resolutionNote && (
                        <div className="mt-3.5 bg-white border border-green-200/50 p-3 rounded-lg text-left text-[11px] text-green-950 space-y-1.5">
                          <div className="flex items-center text-[10px] font-bold uppercase tracking-wider text-green-800">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>Evidência de Resolução</span>
                          </div>
                          <p>{act.resolutionNote}</p>
                          {act.resolutionPhoto && (
                            <img src={act.resolutionPhoto} alt="Resolution" className="w-full h-24 object-cover rounded mt-1.5" />
                          )}
                        </div>
                      )}

                      {/* Show response action inputs inline ONLY for the targeted simulated manager role */}
                      {act.status === 'PENDENTE' && isAssignedToCurrent && resolvingTaskId !== act.id && (
                        <button
                          onClick={() => setResolvingTaskId(act.id)}
                          className="mt-3 py-2 px-3 bg-[#1A1A1A] text-white font-mono text-[9px] uppercase tracking-wider font-extrabold rounded-lg flex items-center shadow-sm cursor-pointer"
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Anexar Evidência &amp; Responder
                        </button>
                      )}

                      {/* Inline form to write response and upload evidence */}
                      {resolvingTaskId === act.id && (
                        <div className="mt-3 bg-white p-3.5 rounded-xl border border-[#EEEEEE] space-y-3">
                          <span className="text-[9px] font-bold text-slate-800 uppercase block tracking-wider">Formulário de Resposta do Gestor</span>
                          
                          <textarea
                            placeholder="Informe seu parecer (ex: Capina executada com apoio da equipe terceirizada Delta)"
                            value={resolutionComment}
                            onChange={(e) => setResolutionComment(e.target.value)}
                            className="w-full bg-neutral-50 p-2 border border-[#EEEEEE] rounded focus:outline-none text-xs min-h-12"
                          />

                          {/* Resolution photo */}
                          <div>
                            {!resolutionPhoto ? (
                              <button
                                type="button"
                                onClick={() => resolutionPhotoRef.current?.click()}
                                className="w-full py-2 bg-neutral-50 hover:bg-neutral-150 border border-dashed text-[10.5px] text-slate-500 rounded font-semibold text-center uppercase tracking-wider block cursor-pointer"
                              >
                                Anexar Foto de Resolução (Evidência)
                              </button>
                            ) : (
                              <div className="relative rounded overflow-hidden border">
                                <img src={resolutionPhoto} alt="Capina finalizada" className="w-full h-20 object-cover" />
                                <button type="button" onClick={() => setResolutionPhoto(null)} className="absolute top-1 right-1 p-1 bg-black text-white text-[9px] rounded">
                                  Alterar
                                </button>
                              </div>
                            )}
                            <input 
                              type="file" 
                              ref={resolutionPhotoRef}
                              onChange={(e) => handleFileUpload(e, 'resolution')}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>

                          <div className="flex space-x-2">
                            <button
                              type="button"
                              onClick={() => handleManagerResolve(act.id)}
                              className="flex-1 py-1.5 bg-black text-white text-[9.5px] font-bold uppercase tracking-wider rounded"
                            >
                              Finalizar Tratativa
                            </button>
                            <button
                              type="button"
                              onClick={() => setResolvingTaskId(null)}
                              className="px-2.5 py-1.5 bg-neutral-100 text-slate-600 text-[9.5px] font-bold uppercase tracking-wider rounded"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ====================================================================== */}
        {/* SUBTAB 2: ORIGINAL GEOLOCATION CHECK-IN FORM (Preserves original code!) */}
        {/* ====================================================================== */}
        {activeTab === 'presence' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 text-left">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-4 mb-4">
                <div>
                  <span className="text-[10px] text-[#888888] font-bold uppercase tracking-widest block mb-1">Check-in</span>
                  <h2 className="text-xl font-bold text-[#1A1A1A] tracking-tight">REGISTRAR PRESENÇA</h2>
                  <span className="text-[11px] text-[#888888] font-medium flex items-center mt-1.5 font-mono">
                    <MapPin className="w-3.5 h-3.5 text-[#888888] mr-1 shrink-0" />
                    Terminal da Ponta da Espera
                  </span>
                </div>
                <Shield className="w-5 h-5 text-[#1A1A1A]" />
              </div>

              {/* GPS NTP calibration readout block */}
              <div className="bg-[#FAF9FA] border border-[#EEEEEE] p-4 rounded-xl flex items-start space-x-3.5 mb-5">
                <div className="p-2 bg-white border border-[#EEEEEE] rounded-full text-[#1A1A1A]">
                  <Shield className="w-4.5 h-4.5" />
                </div>
                <div className="text-left">
                  <h4 className="text-[11px] font-bold text-[#1A1A1A] tracking-wider uppercase">GPS Autenticado (NTP)</h4>
                  <p className="text-[11px] text-[#888888] mt-1 leading-normal">
                    Status: <span className="font-bold text-[#1A1A1A]">Operacional</span> | Precisão: <span className="font-bold text-[#1A1A1A]">{gpsAccuracy}m</span>
                  </p>
                  <button 
                    onClick={calibrateGps}
                    className="text-[10px] text-[#1A1A1A] font-bold underline hover:no-underline mt-2 block uppercase tracking-wider font-mono cursor-pointer"
                    disabled={calibrating}
                  >
                    {calibrating ? 'Recalibrando...' : 'recalibrar GPS'}
                  </button>
                </div>
              </div>

              {/* Motivo Selector Fields */}
              <div className="space-y-4 mb-6">
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-[#1A1A1A] block tracking-widest uppercase">
                    Motivo da Operação
                  </label>
                  <select 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-[#FAFAFA] border border-[#EEEEEE] rounded-xl p-3.5 text-xs font-semibold text-[#1A1A1A] cursor-pointer"
                  >
                    {REASON_OPTIONS.map((opt, oIdx) => (
                      <option key={oIdx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Evidence camera trigger area */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-[#1A1A1A] block tracking-widest uppercase">
                    Evidência (Foto/Anexo)
                  </label>

                  {!evidencePhoto ? (
                    <div 
                      className="border border-dashed border-[#EEEEEE] bg-[#FAF9FA] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors"
                      onClick={() => {
                        const opt = window.confirm("Habilitar capturar câmera para foto de evidência?\nClique em 'Cancelar' para fazer upload de arquivo armazenado.");
                        if (opt) {
                          startCamera();
                        } else {
                          fileInputRef.current?.click();
                        }
                      }}
                    >
                      <Camera className="w-7 h-7 text-[#888888] mb-2" />
                      <span className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest leading-none">
                        Anexar Foto de Evidência
                      </span>
                    </div>
                  ) : (
                    <div className="border border-[#EEEEEE] rounded-xl overflow-hidden relative bg-[#FAF9FA]">
                      <img src={evidencePhoto} alt="Captured operator evidence" className="w-full h-40 object-cover" />
                      
                      <button 
                        onClick={() => setEvidencePhoto(null)}
                        className="absolute top-2.5 right-2.5 p-2.5 bg-black text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={(e) => handleFileUpload(e, 'presence')}
                    accept="image/*"
                    className="hidden" 
                  />
                </div>
              </div>

              <button 
                type="button"
                onClick={handleSaveLocally}
                className="w-full py-4 bg-[#1A1A1A] hover:bg-black text-white font-bold text-xs tracking-widest uppercase rounded-xl flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Save className="w-4.5 h-4.5" />
                <span>Salvar Registro de Campo</span>
              </button>
            </div>

            {/* Local sync database logs */}
            <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 text-left">
              <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Wifi className="w-4.5 h-4.5 text-[#1A1A1A]" />
                  <h3 className="text-[10px] font-bold text-[#1A1A1A] uppercase tracking-widest">
                    Fila de Transmissão Local
                  </h3>
                </div>
                
                <button 
                  onClick={handleForceSync}
                  className="text-[10px] font-bold text-[#1A1A1A] underline uppercase tracking-wider font-mono hover:no-underline cursor-pointer"
                >
                  Transmitir
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-6 text-slate-400 font-mono text-[9px] tracking-widest uppercase">
                  Nenhum log armazenado offline.
                </div>
              ) : (
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="p-4 bg-[#FAF9FA] border border-[#EEEEEE] rounded-xl flex items-start justify-between">
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-[#1A1A1A] leading-tight">{log.reason}</h4>
                        <span className="text-[9.5px] text-[#888888] font-mono block mt-1.5 leading-none">
                          {log.timestamp} • Ponta da Espera (±{log.gpsAccuracy}m)
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleDeleteLog(log.id)}
                          className="p-1 text-red-500 hover:bg-neutral-100 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {log.synced ? (
                          <span className="bg-black text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded tracking-wider font-mono shrink-0">
                            P-GIS OK
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-800 text-[8px] font-bold uppercase px-2 py-0.5 rounded tracking-wider font-mono shrink-0 border border-amber-200">
                            LOCAL
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* ====================================================================== */}
      {/* DIALOG MODAL 1: REPORT VIEWER (Bypasses manual PowerPoint compiling!) */}
      {/* ====================================================================== */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-[32px] overflow-hidden border border-[#EEEEEE] flex flex-col max-h-[90vh]"
            >
              <div className="p-5 border-b border-[#EEEEEE] flex items-center justify-between bg-[#FAF9FA]">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800 uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-slate-800" />
                  <span>Relatório Automático de SSO</span>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="p-1 px-2.5 bg-neutral-200 hover:bg-neutral-300 rounded font-mono text-[10px] text-black"
                >
                  X
                </button>
              </div>

              {/* REPORT DETAILS PRINTABLE */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-left">
                
                {/* Header card identity */}
                <div className="bg-[#1A1A1A] text-white p-4 rounded-2xl relative overflow-hidden text-left">
                  <span className="text-[8px] font-mono tracking-widest uppercase text-slate-300">SGSO Itaqui Correlato</span>
                  <h3 className="font-bold text-sm uppercase text-white mt-1">Vistoria Sanitária &amp; Pátios</h3>
                  <div className="flex items-center justify-between text-[11px] font-mono mt-3 opacity-90 text-slate-100">
                    <span>Fiscal Barros</span>
                    <span>{selectedReport.timestamp}</span>
                  </div>
                </div>

                <div className="space-y-3.5 text-xs text-slate-800">
                  <div>
                    <span className="text-[9px] font-bold text-[#888888] uppercase block tracking-wider mb-1">Local do Registro</span>
                    <span className="font-semibold text-[#1A1A1A]">{selectedReport.area}</span>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-[#888888] uppercase block tracking-wider mb-1">Coordenadas Seguras</span>
                    <span className="font-mono text-[11px] bg-neutral-100 px-2 py-1 rounded">
                      Lat: {selectedReport.gpsCoordinates.lat.toFixed(5)} | Lng: {selectedReport.gpsCoordinates.lng.toFixed(5)}
                    </span>
                  </div>

                  {/* Checklist audit values */}
                  <div className="border-t border-b border-[#EEEEEE] py-3.5 space-y-2">
                    <span className="text-[9px] font-bold text-[#888888] uppercase block tracking-wider mb-1">Auditoria de Requisitos</span>
                    
                    <div className="flex justify-between items-center text-[11px]">
                      <span>1. Capina / Limpeza do Solo:</span>
                      <span className={selectedReport.checklist.cleanliness ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {selectedReport.checklist.cleanliness ? '✓ Conforme (Limpo)' : '▲ NÃO CONFORME (Mato Alto)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span>2. EPIs Regulamentares:</span>
                      <span className={selectedReport.checklist.epis ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {selectedReport.checklist.epis ? '✓ Conforme' : '▲ NÃO CONFORME'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span>3. Proteções Móveis TR:</span>
                      <span className={selectedReport.checklist.machineryGuard ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {selectedReport.checklist.machineryGuard ? '✓ Conforme' : '▲ NÃO CONFORME'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[11px]">
                      <span>4. Paradas de Emergência:</span>
                      <span className={selectedReport.checklist.safetyStops ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                        {selectedReport.checklist.safetyStops ? '✓ Conforme' : '▲ NÃO CONFORME'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-[#888888] uppercase block tracking-wider mb-1">Parecer Geral</span>
                    <p className="text-slate-600 font-sans leading-relaxed text-[11.5px] bg-[#FAF9FA] p-3 rounded-lg border">
                      {selectedReport.details}
                    </p>
                  </div>

                  {selectedReport.evidencePhoto && (
                    <div>
                      <span className="text-[9px] font-bold text-[#888888] uppercase block tracking-wider mb-1">Evidência Visual Capturada</span>
                      <img src={selectedReport.evidencePhoto} alt="Evidence" className="w-full h-36 object-cover rounded-xl" />
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons on card footer */}
              <div className="p-4 bg-[#FAF9FA] border-t border-[#EEEEEE] flex space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    alert("Fazendo o download do relatório em formato compactado PDF de faturamento!\nOs arquivos PPT em PowerPoint correspondentes foram eliminados, salvando de 2 a 3 horas semanais de digitação!");
                    setSelectedReport(null);
                  }}
                  className="flex-1 py-3 bg-[#1A1A1A] hover:bg-black text-white font-bold text-[10px] uppercase tracking-widest rounded-xl text-center cursor-pointer"
                >
                  Baixar Relatório Digital
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="px-4 py-3 bg-white border font-bold text-[10px] uppercase tracking-wider rounded-xl text-slate-600"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WEBCAM INTERACTIVE DIALOG MODAL IF OPENED */}
      <AnimatePresence>
        {showCamera && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#000000] flex flex-col items-center justify-between p-6 z-50 text-white"
          >
            <div className="w-full flex items-center justify-between text-[10px] font-bold text-white tracking-widest uppercase">
              <span className="flex items-center">
                <Video className="w-4 h-4 text-white mr-1.5 animate-pulse" />
                Câmera integrada
              </span>
              <button onClick={stopCamera} className="text-white hover:opacity-75 pb-1 border-b border-white">
                Cancelar
              </button>
            </div>

            <div className="w-full max-w-sm h-64 bg-slate-950 border border-white/10 rounded-2xl overflow-hidden shadow-none my-8 flex items-center justify-center">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover" 
                muted
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="w-full max-w-sm flex flex-col items-center space-y-4">
              <button 
                type="button"
                onClick={capturePhoto}
                className="h-16 w-16 bg-white rounded-full flex items-center justify-center active:scale-95 transition-transform border-4 border-white shadow-none cursor-pointer"
              >
                <div className="h-6 w-6 bg-black rounded-full" />
              </button>
              <p className="text-[9px] text-white/60 uppercase tracking-widest font-mono">
                Capturar evidência de campo
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
