/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Menu, FileText, RefreshCw, Leaf, Check, Info, ShieldAlert,
  ArrowUpRight, AlertCircle, Sparkles, HelpCircle, HardHat, ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { ESGData } from '../types';
import { INITIAL_ESG_DATA } from '../data';

interface ESGScreenProps {
  esg: ESGData;
  onUpdateEsg: (updated: ESGData) => void;
}

export default function ESGScreen({ esg, onUpdateEsg }: ESGScreenProps) {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [addingWaste, setAddingWaste] = useState(false);
  const [inputOrganics, setInputOrganics] = useState('0.1');
  const [inputInertes, setInputInertes] = useState('0.1');

  // Interactive waste adjuster logic
  const handleAddWaste = (e: React.FormEvent) => {
    e.preventDefault();
    const orgVal = parseFloat(inputOrganics) || 0;
    const ineVal = parseFloat(inputInertes) || 0;

    const newOrg = Math.round((esg.recycleOrganics + orgVal) * 10) / 10;
    const newIne = Math.round((esg.recycleInertes + ineVal) * 10) / 10;
    
    // Recalculate recycling rate slightly based on additions
    const total = newOrg + newIne;
    const newRate = total > 0 ? Math.round((newOrg / total) * 100) : 92;

    const updated: ESGData = {
      ...esg,
      recycleOrganics: newOrg,
      recycleInertes: newIne,
      recycleRate: Math.min(newRate, 100)
    };

    onUpdateEsg(updated);
    setAddingWaste(false);
    alert(`Novos volumes computados!\nPátio de Resíduos TEGRAM atualizado para Organicos: ${newOrg}t | Inertes: ${newIne}t`);
  };

  // Export PDF / Print Simulator
  const handleExportPDF = () => {
    alert("Preparando relatório de conformidade ESG portuária...\nAs diretivas de formatação de página em CSS foram geradas para que as tabelas e gráficos saiam com resolução nativa. Pressione OK para imprimir ou baixar.");
    window.print();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFDFD] pb-24 font-sans select-none text-left print:bg-white print:pb-0">
      {/* Dynamic Header exactly matching screenshot 2 */}
      <header className="sticky top-0 bg-white border-b border-[#EEEEEE] h-18 px-6 flex items-center justify-between z-40 shadow-none print:hidden">
        <div className="flex items-center space-x-3.5">
          <button className="p-1 px-2 rounded hover:bg-[#F5F5F5] transition-colors">
            <Menu className="w-5 h-5 text-[#1A1A1A]" />
          </button>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-[#888888] font-bold tracking-widest uppercase leading-none">TEGRAM OS</span>
            <span className="text-sm font-bold text-[#1A1A1A] tracking-tighter">Painel ESG Portuário</span>
          </div>
        </div>

        {/* Action Button layout matching image: rounded and light lavender hue */}
        <div className="flex items-center space-x-2">
          <button 
            type="button"
            onClick={handleExportPDF}
            className="px-4 py-2 bg-[#FAFAFA] hover:bg-[#EEEEEF] border border-[#EEEEEE] text-[#1A1A1A] font-bold rounded-full text-xs flex items-center space-x-1.5 transition-colors cursor-pointer uppercase tracking-wider font-mono"
          >
            <FileText className="w-3.5 h-3.5 text-[#1A1A1A]" />
            <span>PDF</span>
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="p-2 hover:bg-[#F5F5F5] border border-[#EEEEEE] rounded-full text-[#888888]"
          >
            <RefreshCw className="w-4 h-4 cursor-pointer" />
          </button>
        </div>
      </header>

      {/* Main ESG Panel container layout */}
      <div className="p-6 max-w-md mx-auto w-full space-y-6 print:p-0">
        
        {/* CARD 1: CO2 Emissions matching screenshot 2 layout precisely */}
        <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 text-left shadow-none">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-1.5 text-xs text-[#888888] font-semibold">
                <Leaf className="w-3.5 h-3.5 text-[#1A1A1A]" />
                <span className="uppercase tracking-widest text-[10px]">Emissões de CO2</span>
              </div>
              <p className="text-[11px] text-[#888888] font-medium mt-1">
                Monitoramento de pegada de carbono mensal
              </p>
            </div>

            <span className="bg-[#1A1A1A] text-white text-[9px] uppercase tracking-wider font-mono font-bold px-3 py-1 rounded-full">
              Meta ok
            </span>
          </div>

          {/* Main output numbers with vs month anterior percentage */}
          <div className="flex items-baseline space-x-2 my-2">
            <span className="text-[32px] font-bold text-[#1A1A1A] tracking-tighter leading-none">
              {esg.co2Current} <span className="text-sm font-semibold text-[#888888] font-mono">tCO2e</span>
            </span>
            <span className="text-xs font-bold text-emerald-600 font-mono">
              {esg.co2VsPrevPercent}% vs prev
            </span>
          </div>

          {/* Dynamic SVG / CSS responsive Carbon timeline bar graph replicating the precise layout */}
          <div className="bg-white border border-[#EEEEEE] rounded-2xl p-4 mt-4 h-48 flex flex-col justify-between">
            <div className="flex-1 flex items-end justify-between space-x-2.5 px-1 relative">
              {/* Horizontal grid limit line representing target metrics goal limit bar */}
              <div className="absolute top-[20%] left-0 right-0 border-t border-dashed border-[#EEEEEE] pointer-events-none z-0">
                <span className="bg-[#FAFAFA] text-[#888888] border border-[#EEEEEE] text-[8px] font-bold px-1.5 py-0.5 rounded-md absolute -top-2.5 right-1 uppercase tracking-wider font-mono">
                  Meta: {esg.co2Goal}.0
                </span>
              </div>

              {esg.co2History.map((pt, idx) => {
                const maxVal = Math.max(...esg.co2History.map(h => h.value));
                const percentHeight = Math.round((pt.value / maxVal) * 100);
                
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center z-10 group relative cursor-pointer">
                    {/* Hover detail tooltips */}
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-black text-white rounded text-[10px] font-sans px-2 py-0.5 pointer-events-none transition-all duration-150 shadow-none z-50 whitespace-nowrap">
                      {pt.value} tCO2e
                    </div>

                    <div className="w-full relative rounded-t-sm overflow-hidden bg-[#FAFAFA]" style={{ height: '110px' }}>
                      {/* Standard light blue shade; current highlighted dynamically matching mockup color */}
                      <div 
                        className={`absolute bottom-0 left-0 right-0 transition-all duration-500 rounded-t-sm ${
                          pt.isCurrent 
                            ? 'bg-[#1A1A1A]' 
                            : 'bg-[#CCCCCC]'
                        }`}
                        style={{ height: `${percentHeight}%` }}
                      />
                    </div>
                    
                    {/* Label output */}
                    <span className="text-[9px] font-mono text-[#888888] mt-2 block uppercase">
                      {pt.month}
                    </span>
                  </div>
                );
              })}
            </div>
            
            {/* Legend line */}
            <div className="flex items-center justify-center space-x-4 border-t border-[#EEEEEE] pt-2 pb-0.5 text-[9px] font-mono text-[#888888] font-bold tracking-widest uppercase">
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-[#CCCCCC]" />
                <span>Histórico</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-2 rounded-full bg-[#1A1A1A]" />
                <span>Mês Atual</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Waste Management circular Donut graph matching screenshot 2 precisely */}
        <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 text-left shadow-none">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3 mb-2">
            <span className="text-[10px] font-bold text-[#888888] uppercase tracking-widest leading-none">
              Resíduos Sólidos
            </span>
            
            <button 
              onClick={() => setAddingWaste(!addingWaste)}
              className="text-[10px] font-bold text-[#1A1A1A] underline uppercase tracking-wider font-mono hover:no-underline print:hidden"
            >
              {addingWaste ? "Cancelar" : "Registrar Descarte"}
            </button>
          </div>

          {/* Interactive slider updater */}
          {addingWaste && (
            <motion.form 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              onSubmit={handleAddWaste}
              className="bg-[#FAFAFA] border border-[#EEEEEE] p-4 rounded-xl mb-4 text-xs space-y-3"
            >
              <h4 className="font-bold text-[#1A1A1A] uppercase tracking-widest text-[9px] font-mono">Volumes residuais (t)</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#888888] block mb-1">Orgânicos</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={inputOrganics} 
                    onChange={e => setInputOrganics(e.target.value)}
                    className="w-full p-2 bg-white border border-[#EEEEEE] rounded outline-none font-mono text-xs font-semibold" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-[#888888] block mb-1">Inertes</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={inputInertes} 
                    onChange={e => setInputInertes(e.target.value)}
                    className="w-full p-2 bg-white border border-[#EEEEEE] rounded outline-none font-mono text-xs font-semibold" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-2.5 bg-[#1A1A1A] text-white font-bold rounded-lg uppercase tracking-widest text-[9.5px] cursor-pointer"
              >
                Salvar Volumes
              </button>
            </motion.form>
          )}

          {/* Donut chart and details columns */}
          <div className="flex flex-col items-center justify-center py-4">
            
            {/* Custom SVG Circular donut replicating the mockup precise colors */}
            <div className="relative w-36 h-36 mb-6">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {/* Background circular track */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#FAFAFA" 
                  strokeWidth="10" 
                  fill="transparent" 
                />
                {/* Highlight active recycling rate track segment */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="#1A1A1A" 
                  strokeWidth="10" 
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - esg.recycleRate / 100)}`}
                  strokeLinecap="round"
                  fill="transparent" 
                />
              </svg>

              {/* Central donut labels */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[24px] font-bold text-[#1A1A1A] tracking-tighter leading-none font-mono">
                  {esg.recycleRate}%
                </span>
                <span className="text-[9px] font-bold text-[#888888] uppercase tracking-widest mt-1.5">
                  Reciclado
                </span>
              </div>
            </div>

            {/* Split volume indicators underneath matching image color indices */}
            <div className="w-full grid grid-cols-2 px-2 gap-4 border-t border-[#EEEEEE] pt-4 text-xs text-left">
              <div className="border-l-4 border-black pl-3">
                <span className="text-[10px] font-bold text-[#888888] block uppercase tracking-wider">Orgânicos</span>
                <span className="text-sm font-bold text-[#1A1A1A] font-mono mt-0.5 block">{esg.recycleOrganics}t</span>
              </div>
              <div className="border-l-4 border-[#CCCCCC] pl-3">
                <span className="text-[10px] font-bold text-[#888888] block uppercase tracking-wider">Inertes</span>
                <span className="text-sm font-bold text-[#1A1A1A] font-mono mt-0.5 block">{esg.recycleInertes}t</span>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: NR-15/16 Safety Alerts Card with double sub items row */}
        <div className="bg-white rounded-[24px] border border-[#EEEEEE] p-6 text-left shadow-none">
          <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3.5 mb-4">
            <div className="flex items-center space-x-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-[#1A1A1A]" />
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase tracking-widest leading-none">
                Normativas NR-15/16
              </h3>
            </div>

            {/* Filters matching image bar */}
            <div className="bg-[#FAFAFA] border border-[#EEEEEE] p-0.5 rounded-lg flex space-x-1 text-[10px] font-bold pr-1 print:hidden">
              {['Todos', 'Insalubre', 'Perigoso'].map((filt) => (
                <button 
                  key={filt}
                  onClick={() => setActiveFilter(filt)}
                  className={`px-2 py-1 rounded-md transition-all uppercase tracking-wide text-[9px] ${
                    activeFilter === filt 
                      ? 'bg-black text-white shadow-none' 
                      : 'text-[#888888] hover:text-[#1A1A1A]'
                  }`}
                >
                  {filt}
                </button>
              ))}
            </div>
          </div>

          {/* Dotted border dashboard box precisely matching screenshot 2 layout */}
          <div className="border border-dashed border-[#EEEEEE] rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-[#FAFAFA] mb-4 py-8">
            <div className="p-3 bg-white border border-[#EEEEEE] rounded-full text-[#1A1A1A] mb-3">
              <ShieldCheck className="w-6 h-6 stroke-1.5" />
            </div>
            
            <h4 className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-widest font-mono">
              0 Alertas Pendentes
            </h4>
            <p className="text-[11px] text-[#888888] font-medium mt-1">
              Ambiente de trabalho em conformidade regulamentar.
            </p>
          </div>

          {/* Side by side mini stats boxes */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-medium">
            <div className="bg-[#FAFAFA] border border-[#EEEEEE] p-3.5 rounded-xl flex flex-col text-left justify-between">
              <span className="text-[9px] font-bold text-[#888888] tracking-widest uppercase block">Social</span>
              <span className="text-xs font-bold text-[#1A1A1A] mt-1.5">Conclusões: 100%</span>
            </div>

            <div className="bg-[#FAFAFA] border border-[#EEEEEE] p-3.5 rounded-xl flex flex-col text-left justify-between">
              <span className="text-[9px] font-bold text-[#888888] tracking-widest uppercase block">Sem Acidentes</span>
              <span className="text-xs font-bold text-[#1A1A1A] mt-1.5 font-mono">14,242h</span>
            </div>
          </div>
        </div>

        {/* CARD 4: Corporate Governance - Integridade Score Card */}
        <div className="bg-black border border-black rounded-[24px] p-6 text-white text-left flex items-center justify-between shadow-none">
          <div className="text-left">
            <h3 className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Governança Corporativa</h3>
            <p className="text-sm font-semibold text-white mt-1 leading-normal">
              Score de Integridade TEGRAM
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <span className="text-[32px] font-bold tracking-tighter text-white leading-none font-mono">A+</span>
            <span className="text-[8px] font-bold uppercase tracking-widest text-white/50 mt-1.5 font-mono">
              Auditado 2026
            </span>
          </div>
        </div>

        {/* List items below primary corporate block matching image */}
        <div className="space-y-2 text-xs font-medium text-left">
          <div className="bg-white border border-[#EEEEEE] rounded-xl p-4 flex items-center justify-between">
            <span className="text-[#888888] uppercase tracking-widest text-[10px] font-semibold">Conselho Fiscal</span>
            <span className="text-[#1A1A1A] font-bold flex items-center tracking-wide text-[10px] uppercase font-mono">
              <Check className="w-3.5 h-3.5 mr-1" />
              100% REGULAR
            </span>
          </div>

          <div className="bg-white border border-[#EEEEEE] rounded-xl p-4 flex items-center justify-between">
            <span className="text-[#888888] uppercase tracking-widest text-[10px] font-semibold">Transparência</span>
            <span className="text-[#1A1A1A] font-bold flex items-center tracking-wide text-[10px] uppercase font-mono">
              <FileText className="w-3.5 h-3.5 mr-1" />
              Relatório OK
            </span>
          </div>
        </div>

        {/* Bottom banner matching card precisely */}
        <div className="relative h-28 rounded-[24px] overflow-hidden border border-[#EEEEEE] shadow-none mt-5 group">
          <img 
            src="https://images.unsplash.com/photo-1541447271487-09612b3f49f7?auto=format&fit=crop&q=80&w=800" 
            alt="Port terminal ethical banner" 
            className="w-full h-full object-cover grayscale transition-transform duration-500 shrink-0 opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-transparent" />
          
          <div className="absolute inset-0 flex flex-col items-start justify-center p-6 text-left">
            <h4 className="text-[9px] tracking-widest text-[#1A1A1A] font-bold uppercase mb-1">PROGRAMA DE COMPLIANCE</h4>
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
              COMPROMISSO ÉTICO TEGRAM
            </h3>
            <span className="text-[10px] text-[#888888] mt-1.5 leading-snug">Canal de Ouvidoria &amp; Denúncias Ativo</span>
          </div>
        </div>
      </div>
    </div>
  );
}

