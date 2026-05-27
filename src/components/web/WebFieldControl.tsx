import React, { useState } from 'react';
import { 
  MapPin, Radar, Plus, Minus, Target, ShieldAlert, CheckCircle2,
  AlertTriangle, Eye, RefreshCw, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OperatorMarker {
  id: string;
  name: string;
  role: string;
  location: string;
  top: string;
  left: string;
  status: 'ok' | 'warning' | 'critical';
  details: string;
}

export default function WebFieldControl() {
  const [selectedMarker, setSelectedMarker] = useState<OperatorMarker | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const markers: OperatorMarker[] = [
    {
      id: 'm1',
      name: 'Ricardo Silva',
      role: 'Operador de Carregamento',
      location: 'Terminal T3 - Vistoria de Carga',
      top: '32%',
      left: '25%',
      status: 'ok',
      details: 'Check-in por GPS realizado às 10:15 no Berço 03. Equipamentos de Proteção Individual (EPIs) validados via checklist digital.'
    },
    {
      id: 'm2',
      name: 'Marcos Oliveira',
      role: 'Eletromecânico Terceiro',
      location: 'Berço 03 - Manutenção de Transportador',
      top: '48%',
      left: '52%',
      status: 'warning',
      details: 'Manutenção de esteira iniciada. Alerta: Treinamento NR-35 (Trabalho em Altura) vence em 18 dias.'
    },
    {
      id: 'm3',
      name: 'Ana Paula',
      role: 'Inspetora Ambiental',
      location: 'Silos A4 - Vistoria de Resíduos',
      top: '68%',
      left: '64%',
      status: 'critical',
      details: 'Não conformidade detectada: Vazamento de óleo hidráulico de baixa proporção na base do silo. Plano de ação automático emitido para a equipe de manutenção.'
    }
  ];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.8));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="h-full w-full flex overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Left: Map Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-200 dark:bg-slate-950">
        {/* Animated grid overlay to look high tech */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-50 dark:opacity-40" />

        {/* Map Background Wrapper with Zoom support */}
        <div 
          className="absolute inset-0 transition-transform duration-300"
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBHdfyRn00ZngC1tlnuPfsj7ao4e6kXAUEeSyJqs9e1YLmlFNBJ4Y7_cqT8Xu9Ztsfl72F8WDBJdGcsHtsEwjR66ciPsAS35St7E-wwXFR5FiQXyhWciUI87PmbZjn2HLBQMZfi-1QoocNDF56o8ljwGiH5-Wv8gkkX9Kwg2sPhSrqp64qCP13NH0vEpVS3K-mdCijpezQ3kHLhwop_mW9X3yyw_TDrJsTVEKGyBc-dRQNmN-kfCX6HdV7AYqEZq8zr532YXH4QQSOT')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `scale(${zoomLevel})`
          }}
        >
          <div className="absolute inset-0 bg-white/20 dark:bg-slate-950/20 backdrop-blur-[1px] pointer-events-none" />
          
          {/* Interactive Map Pins */}
          {markers.map((marker) => {
            const statusColor = 
              marker.status === 'ok' ? 'bg-emerald-500' :
              marker.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500';
            
            return (
              <div 
                key={marker.id}
                className="absolute transition-all cursor-pointer group z-10"
                style={{ top: marker.top, left: marker.left }}
                onClick={() => setSelectedMarker(marker)}
              >
                <div className={`w-6 h-6 ${statusColor} border-2 border-white dark:border-slate-900 rounded-full shadow-lg flex items-center justify-center animate-pulse`}>
                  <MapPin className="w-3.5 h-3.5 text-slate-950" />
                </div>
                
                {/* Micro tooltip on hover */}
                <div className="absolute left-8 top-0 hidden group-hover:block bg-white dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-xl w-44 z-20 backdrop-blur-md">
                  <p className="text-[10px] font-bold text-slate-850 dark:text-white leading-tight">{marker.name}</p>
                  <p className="text-[8px] text-slate-500 dark:text-slate-400 mt-0.5">{marker.location}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Map Controls Floating Panel */}
        <div className="absolute bottom-6 left-6 flex flex-col gap-2 z-20">
          <button 
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex items-center justify-center text-slate-655 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all backdrop-blur-md"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex items-center justify-center text-slate-655 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all backdrop-blur-md"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button 
            onClick={handleResetZoom}
            className="w-10 h-10 bg-white/95 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg flex items-center justify-center text-slate-655 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-all backdrop-blur-md"
          >
            <Target className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Marker Detail Modal Overlay */}
        <AnimatePresence>
          {selectedMarker && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-6 left-20 right-6 bg-white/95 dark:bg-slate-950/95 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-2xl backdrop-blur-md z-20 max-w-xl text-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border ${
                    selectedMarker.status === 'ok' ? 'bg-emerald-100 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 border-emerald-350 dark:border-emerald-800/40' :
                    selectedMarker.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-955/40 text-yellow-700 dark:text-yellow-500 border-yellow-350 dark:border-yellow-800/40' :
                    'bg-red-100 dark:bg-red-955/40 text-red-700 dark:text-red-400 border-red-350 dark:border-red-800/40'
                  }`}>
                    {selectedMarker.status === 'ok' ? 'Operação Conforme' : 
                     selectedMarker.status === 'warning' ? 'Atenção SSO' : 'Não Conformidade'}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{selectedMarker.name}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">{selectedMarker.role} • {selectedMarker.location}</p>
                </div>
                <button 
                  onClick={() => setSelectedMarker(null)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 font-bold"
                >
                  Fechar
                </button>
              </div>
              <p className="text-xs text-slate-655 dark:text-slate-300 leading-relaxed mb-4">{selectedMarker.details}</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => alert(`Visualizando foto de evidência de ${selectedMarker.name}`)}
                  className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-800 flex items-center gap-1.5 transition-all"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Ver Evidência Fotográfica
                </button>
                {selectedMarker.status === 'critical' && (
                  <button 
                    onClick={() => alert("Plano de Ação #2948 enviado para Mário Pinto.")}
                    className="py-1.5 px-3 bg-red-100 dark:bg-red-955/40 border border-red-200 dark:border-red-800/40 hover:bg-red-200 dark:hover:bg-red-955/65 text-red-700 dark:text-red-300 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Plano de Ação Ativo
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side: Operations Feed */}
      <div className="w-[420px] bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 flex flex-col z-20 shrink-0 transition-colors duration-200">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 flex justify-between items-center transition-colors duration-200">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Radar className="w-4 h-4 text-cyan-500 dark:text-cyan-400 animate-spin-slow" />
              Feed de Operações
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">Registros de GPS e checklists em tempo real</p>
          </div>
          <button 
            onClick={() => alert("Sincronizando feed...")}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* List of activity cards */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/20 transition-colors duration-200">
          
          {/* Card 1 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-all cursor-pointer group shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">RS</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ricardo Silva</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold uppercase">Berço 3 - T3 Norte</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">10:15</span>
            </div>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-1.5 py-0.5 bg-emerald-50 dark:bg-emerald-955/40 border border-emerald-150 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-400 text-[8px] font-extrabold rounded uppercase tracking-wide flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Check-in OK
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 text-[8px] font-bold rounded uppercase">Vistoria</span>
            </div>
            {/* Visual attachments simulator */}
            <div className="flex gap-2">
              <div className="w-14 h-14 bg-slate-200 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden relative">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHdfyRn00ZngC1tlnuPfsj7ao4e6kXAUEeSyJqs9e1YLmlFNBJ4Y7_cqT8Xu9Ztsfl72F8WDBJdGcsHtsEwjR66ciPsAS35St7E-wwXFR5FiQXyhWciUI87PmbZjn2HLBQMZfi-1QoocNDF56o8ljwGiH5-Wv8gkkX9Kwg2sPhSrqp64qCP13NH0vEpVS3K-mdCijpezQ3kHLhwop_mW9X3yyw_TDrJsTVEKGyBc-dRQNmN-kfCX6HdV7AYqEZq8zr532YXH4QQSOT" 
                  className="w-full h-full object-cover opacity-80 dark:opacity-70 group-hover:opacity-100 transition-opacity" 
                />
              </div>
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
                <FileText className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-yellow-500/30 dark:hover:border-yellow-500/30 transition-all cursor-pointer shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-955/40 text-yellow-700 dark:text-yellow-500 flex items-center justify-center font-bold text-xs">MO</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Marcos Oliveira</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold uppercase">Berço 03 - Manutenção</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">09:42</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 bg-yellow-50 dark:bg-yellow-955/40 border border-yellow-150 dark:border-yellow-800/40 text-yellow-700 dark:text-yellow-500 text-[8px] font-extrabold rounded uppercase tracking-wide flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                Vencimento NR-35 (&lt;20d)
              </span>
              <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 text-[8px] font-bold rounded uppercase">Manutenção</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 hover:border-red-500/30 dark:hover:border-red-500/30 transition-all cursor-pointer shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-955/40 text-red-700 dark:text-red-400 flex items-center justify-center font-bold text-xs">AP</div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Ana Paula</h4>
                  <p className="text-[9px] text-slate-450 dark:text-slate-500 font-semibold uppercase">Silo A4</p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">08:11</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-red-50 dark:bg-red-955/40 border border-red-150 dark:border-red-800/40 text-red-700 dark:text-red-400 text-[8px] font-extrabold rounded uppercase tracking-wide flex items-center gap-1">
                  <ShieldAlert className="w-2.5 h-2.5" />
                  Vazamento óleo base Silo
                </span>
              </div>
              <p className="text-[10px] text-slate-655 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-900 p-2 rounded-lg font-medium">
                Chamado automático gerado para equipe de capina e SSO do setor.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
