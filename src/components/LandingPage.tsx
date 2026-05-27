import React, { useState } from 'react';
import { 
  Anchor, ShieldCheck, FileSpreadsheet, Map, Leaf, 
  ArrowRight, CheckCircle2, ChevronRight, Play, Award, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LandingPageProps {
  onLoginClick: () => void;
}

export default function LandingPage({ onLoginClick }: LandingPageProps) {
  // Demo simulator state
  const [demoState, setDemoState] = useState<'pending' | 'validating' | 'approved'>('pending');
  const [demoWorkerName, setDemoWorkerName] = useState('Mário Silva');

  const startDemoValidation = () => {
    if (demoState !== 'pending') return;
    setDemoState('validating');
    setTimeout(() => {
      setDemoState('approved');
    }, 2000);
  };

  const resetDemo = () => {
    setDemoState('pending');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-900 overflow-x-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Anchor className="text-white w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">TEGRAM OS</span>
              <p className="text-[9px] text-cyan-400 uppercase tracking-widest leading-none font-semibold">Port Operations Suite</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#demo" className="hover:text-white transition-colors">Demonstração</a>
            <a href="#compliance" className="hover:text-white transition-colors">Segurança & NRs</a>
          </nav>

          <button 
            onClick={onLoginClick}
            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 hover:to-sky-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/15 hover:shadow-cyan-500/25 active:scale-[0.98]"
          >
            Acessar Sistema
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 pt-20 pb-16 md:pt-32 md:pb-24 max-w-7xl mx-auto w-full flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6 animate-pulse">
          <Award className="w-3.5 h-3.5" />
          <span>Gestão ESG & SSO Portuária Integrada</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight max-w-4xl leading-[1.1] mb-6">
          A Revolução Digital nas Operações do{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500 bg-clip-text text-transparent">
            TEGRAM Itaqui
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
          Substitua relatórios em PowerPoint e planilhas por inspeções fotográficas 100% digitais, presença por GPS seguro, e validação em tempo real de NRs e ASOs de terceiros.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onLoginClick}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl transition-all hover:opacity-95 shadow-xl shadow-cyan-500/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            Entrar no Sistema
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <a 
            href="#demo"
            className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-800 hover:border-slate-700 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            Ver Demonstração
          </a>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-5xl mt-20 p-8 rounded-2xl bg-slate-900/40 border border-slate-900 backdrop-blur-sm">
          <div>
            <p className="text-3xl font-extrabold text-white mb-1">14.2k+</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Horas sem Acidentes</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-cyan-400 mb-1">100%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Inspeção Digital (Sem PPT)</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-indigo-400 mb-1">92%</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Resíduos Reciclados</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-emerald-400 mb-1">Zero</p>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Alertas Críticos SSO</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="px-6 py-20 bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Funcionalidades do Ecossistema</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Um ambiente digital unificado projetado especificamente para as complexas operações do Terminal de Grãos do Maranhão.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-cyan-950/50 border border-cyan-500/20 rounded-xl flex items-center justify-center mb-5 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Mobilização de Terceiros</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Pré-cadastro digital de funcionários de contratadas. Análise imediata de ASO e certificados para liberação rápida na área portuária.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-sky-950/50 border border-sky-500/20 rounded-xl flex items-center justify-center mb-5 text-sky-400 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Operações de Campo</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Checklists digitais de vistorias fotográficas com geração de relatórios imediatos (adeus montagens em PowerPoint). Presença via GPS NTP seguro.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-indigo-950/50 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-5 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-slate-950 transition-all">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Matriz de Treinamentos</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Controle automático das datas de vencimento de exames de saúde (ASO) e treinamentos (NR-29, NR-35). Alertas preventivos de 30 dias.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-slate-900/30 border border-slate-900 hover:border-slate-800 transition-all flex flex-col h-full group">
              <div className="w-12 h-12 bg-emerald-950/50 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-5 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Painel de Métricas ESG</h3>
              <p className="text-xs text-slate-400 leading-relaxed flex-1">
                Monitoramento transparente das emissões de CO2, taxas de reciclagem de resíduos orgânicos e inertes, com exportação rápida para relatórios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section id="demo" className="px-6 py-20 bg-slate-900/30 border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider mb-4">
              Demonstração Prática
            </div>
            <h2 className="text-3xl font-extrabold text-white mb-6 leading-tight">
              Veja a validação automática em ação
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Nosso sistema analisa os anexos das contratadas e valida instantaneamente o status do trabalhador. Simule ao lado o cadastro e validação automática de NRs do operador terceirizado.
            </p>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-xs text-slate-300">Cruzamento automático com matriz de NRs</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-xs text-slate-300">Alertas inteligentes de conformidade ESG/SSO</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5" />
                <span className="text-xs text-slate-300">Sem processos manuais ou planilhas desatualizadas</span>
              </li>
            </ul>
          </div>

          {/* Interactive Card Container */}
          <div className="p-6 md:p-8 rounded-2xl bg-slate-950 border border-slate-900 shadow-2xl relative overflow-hidden flex flex-col min-h-[380px]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Simulator Header */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-900 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] text-slate-500 font-mono">SIMULADOR SSO</span>
            </div>

            {/* Simulated Card Content */}
            <div className="flex-1 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {demoState === 'pending' && (
                  <motion.div 
                    key="pending"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-300">MS</div>
                        <div>
                          <p className="text-xs font-bold text-white">{demoWorkerName}</p>
                          <p className="text-[10px] text-slate-500">Mecânico - Metalúrgica Silva</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-yellow-950 text-yellow-400 border border-yellow-800/40 text-[9px] font-bold rounded uppercase">Aguardando</span>
                    </div>

                    <div className="p-4 bg-slate-900/50 border border-slate-900 rounded-xl space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Exame ASO:</span>
                        <span className="font-mono text-yellow-400 font-semibold">Pendente Validação</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Treinamento NR-35:</span>
                        <span className="font-mono text-yellow-400 font-semibold">Pendente Validação</span>
                      </div>
                    </div>

                    <button 
                      onClick={startDemoValidation}
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                      Validar Documentos do Trabalhador
                    </button>
                  </motion.div>
                )}

                {demoState === 'validating' && (
                  <motion.div 
                    key="validating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center space-y-4 py-8"
                  >
                    <div className="w-10 h-10 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin" />
                    <div className="text-center">
                      <p className="text-xs font-bold text-white">Analisando Certificados do {demoWorkerName}...</p>
                      <p className="text-[10px] text-slate-500">Fazendo checagem de metadados e validades das NRs</p>
                    </div>
                  </motion.div>
                )}

                {demoState === 'approved' && (
                  <motion.div 
                    key="approved"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold">MS</div>
                        <div>
                          <p className="text-xs font-bold text-white">{demoWorkerName}</p>
                          <p className="text-[10px] text-slate-500">Mecânico - Metalúrgica Silva</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800/40 text-[9px] font-bold rounded uppercase">Tudo aprovado e bilesa!</span>
                    </div>

                    <div className="p-4 bg-slate-900/50 border border-slate-900 rounded-xl space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Exame ASO:</span>
                        <span className="font-mono text-emerald-400 font-bold">Liberado (Vencimento 12/2026)</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Treinamento NR-35:</span>
                        <span className="font-mono text-emerald-400 font-bold">Liberado (Vencimento 08/2027)</span>
                      </div>
                    </div>

                    <button 
                      onClick={resetDemo}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all"
                    >
                      Reiniciar Simulação
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance / Regulatory Section */}
      <section id="compliance" className="px-6 py-16 bg-slate-950 border-t border-slate-900 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center justify-center gap-2">
            <Anchor className="w-5 h-5 text-cyan-400" />
            Conformidade Regulamentar Portuária
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            O TEGRAM OS foi desenvolvido em estrita conformidade com as Normas Regulamentadoras da Secretaria de Inspeção do Trabalho (SIT), em especial a **NR-29** (Segurança e Saúde no Trabalho Portuário), além das normas de apoio **NR-15**, **NR-16** e **NR-35**.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800">NR-29 PORTUÁRIO</span>
            <span className="px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800">NR-15 INSALUBRIDADE</span>
            <span className="px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800">NR-16 PERICULOSIDADE</span>
            <span className="px-3.5 py-1.5 rounded-md bg-slate-900 border border-slate-800">NR-35 TRABALHO EM ALTURA</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-slate-950 border-t border-slate-900/50 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} TEGRAM OS. Todos os direitos reservados.</p>
          <p>Operação Digitalizada do Terminal de Grãos do Maranhão - Porto de Itaqui, São Luís.</p>
        </div>
      </footer>
    </div>
  );
}
