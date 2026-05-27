import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, XCircle, Search, 
  Users, Percent, BellRing
} from 'lucide-react';

interface WorkerTraining {
  id: string;
  name: string;
  company: string;
  role: string;
  nr10: 'valido' | 'vencido' | 'nao_requerido';
  nr10Expiry: string;
  nr29: 'valido' | 'vencido' | 'nao_requerido';
  nr29Expiry: string;
  nr35: 'valido' | 'vencido' | 'nao_requerido';
  nr35Expiry: string;
  asoStatus: 'ok' | 'alerta' | 'vencido';
  asoExpiry: string;
}

export default function WebTrainings() {
  const [workers, setWorkers] = useState<WorkerTraining[]>([
    {
      id: 'wt1',
      name: 'Ricardo Silva',
      company: 'Metalúrgica Silva Ltda',
      role: 'Operador de Carregamento',
      nr10: 'valido',
      nr10Expiry: '15/12/2027',
      nr29: 'valido',
      nr29Expiry: '10/08/2027',
      nr35: 'nao_requerido',
      nr35Expiry: 'N/A',
      asoStatus: 'ok',
      asoExpiry: '22/02/2027'
    },
    {
      id: 'wt2',
      name: 'Mário Silva',
      company: 'Metalúrgica Silva Ltda',
      role: 'Mecânico de Correias',
      nr10: 'valido',
      nr10Expiry: '04/01/2027',
      nr29: 'valido',
      nr29Expiry: '21/11/2026',
      nr35: 'valido',
      nr35Expiry: '24/11/2027',
      asoStatus: 'alerta',
      asoExpiry: '16/06/2026 (Próximo)'
    },
    {
      id: 'wt3',
      name: 'Carlos Henrique Souza',
      company: 'Maranhão Engenharia',
      role: 'Eletricista de Potência',
      nr10: 'valido',
      nr10Expiry: '12/10/2027',
      nr29: 'vencido',
      nr29Expiry: 'Vencido (10/05/2026)',
      nr35: 'valido',
      nr35Expiry: '18/11/2026',
      asoStatus: 'vencido',
      asoExpiry: 'Vencido (09/05/2026)'
    },
    {
      id: 'wt4',
      name: 'Aline Cavalcante',
      company: 'Logística Itaqui S/A',
      role: 'Supervisora de Operações',
      nr10: 'nao_requerido',
      nr10Expiry: 'N/A',
      nr29: 'valido',
      nr29Expiry: '20/09/2027',
      nr35: 'valido',
      nr35Expiry: '11/02/2027',
      asoStatus: 'ok',
      asoExpiry: '15/03/2027'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCompany, setFilterCompany] = useState('todas');

  const filteredWorkers = workers.filter(w => {
    const matchesSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          w.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCompany = filterCompany === 'todas' || w.company === filterCompany;
    
    return matchesSearch && matchesCompany;
  });

  const getStatusIcon = (status: 'valido' | 'vencido' | 'nao_requerido') => {
    switch (status) {
      case 'valido':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500 animate-pulse" />;
      case 'vencido':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <span className="text-slate-400 dark:text-slate-650 font-mono text-[10px]">-</span>;
    }
  };

  const getAsoLabel = (status: 'ok' | 'alerta' | 'vencido', date: string) => {
    switch (status) {
      case 'ok':
        return <span className="text-emerald-600 dark:text-emerald-400 font-medium">{date}</span>;
      case 'alerta':
        return <span className="text-yellow-600 dark:text-yellow-500 font-bold animate-pulse">{date}</span>;
      default:
        return <span className="text-red-500 font-bold">{date}</span>;
    }
  };

  // Companies list for filter
  const companies = Array.from(new Set(workers.map(w => w.company)));

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top Warning Banner if any compliance issue is detected */}
      <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-955/40 border border-yellow-250 dark:border-yellow-800/40 rounded-2xl flex items-start gap-3 transition-colors duration-200">
        <BellRing className="w-5 h-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0 animate-bounce" />
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Alertas de SSO & Exames Vencendo</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
            O profissional **Mário Silva** está com o exame de saúde ocupacional (ASO) vencendo em 20 dias. O profissional **Carlos Henrique Souza** está com pendências críticas (ASO e NR-29 vencidos).
          </p>
        </div>
      </div>

      {/* Analytics stats row */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-200">
          <div>
            <p className="text-[10px] text-slate-450 dark:text-slate-550 uppercase tracking-widest font-bold">Total Colaboradores</p>
            <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{workers.length}</p>
          </div>
          <Users className="w-8 h-8 text-cyan-550 dark:text-cyan-500 opacity-20" />
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-200">
          <div>
            <p className="text-[10px] text-slate-455 dark:text-slate-550 uppercase tracking-widest font-bold">Conformidade Global</p>
            <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">75.0%</p>
          </div>
          <Percent className="w-8 h-8 text-emerald-500 opacity-20" />
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-sm transition-colors duration-200">
          <div>
            <p className="text-[10px] text-slate-455 dark:text-slate-550 uppercase tracking-widest font-bold">Alertas Ativos</p>
            <p className="text-xl font-black text-yellow-600 dark:text-yellow-500 mt-1">2</p>
          </div>
          <AlertTriangle className="w-8 h-8 text-yellow-500 opacity-20" />
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Buscar por colaborador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-550 focus:outline-none focus:border-cyan-500 transition-colors shadow-none"
          />
        </div>

        {/* Company Dropdown filter */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Filtrar Contratada:</span>
          <select 
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="todas">Todas as Empresas</option>
            {companies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors duration-200">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Profissional / Empresa</th>
                <th className="py-4 px-6">NR-10 (Elétrica)</th>
                <th className="py-4 px-6">NR-29 (Portuário)</th>
                <th className="py-4 px-6">NR-35 (Altura)</th>
                <th className="py-4 px-6">Exame ASO</th>
                <th className="py-4 px-6">Histórico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-900 text-xs">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Nenhum colaborador encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 dark:text-white">{worker.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-550 mt-0.5">{worker.company} • {worker.role}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(worker.nr10)}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{worker.nr10Expiry}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(worker.nr29)}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{worker.nr29Expiry}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(worker.nr35)}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">{worker.nr35Expiry}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px]">
                      {getAsoLabel(worker.asoStatus, worker.asoExpiry)}
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => alert(`Histórico de certificados e uploads de ${worker.name}`)}
                        className="py-1 px-2.5 bg-slate-100 hover:bg-slate-250 dark:bg-slate-900 dark:hover:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg text-[9px] font-bold transition-all"
                      >
                        Visualizar Histórico
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
