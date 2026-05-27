import React, { useState } from 'react';
import { 
  UserPlus, FileCheck, CheckCircle2, AlertTriangle, XCircle, Search, 
  Building, UploadCloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobilizedWorker {
  id: string;
  name: string;
  company: string;
  role: string;
  asoStatus: 'liberado' | 'pendente' | 'bloqueado';
  asoExpiry: string;
  nr35Status: 'liberado' | 'pendente' | 'vazio';
  nr35Expiry: string;
  cadastroStatus: 'liberado' | 'pendente';
}

export default function WebMobilization() {
  const [workers, setWorkers] = useState<MobilizedWorker[]>([
    {
      id: 'w1',
      name: 'Mário Silva',
      company: 'Metalúrgica Silva Ltda',
      role: 'Mecânico de Correias',
      asoStatus: 'pendente',
      asoExpiry: 'Em 20 dias (16/06/2026)',
      nr35Status: 'liberado',
      nr35Expiry: '24/11/2027',
      cadastroStatus: 'liberado'
    },
    {
      id: 'w2',
      name: 'João Pedro Santos',
      company: 'Logística Itaqui S/A',
      role: 'Operador de Moega',
      asoStatus: 'liberado',
      asoExpiry: '21/12/2026',
      nr35Status: 'vazio',
      nr35Expiry: 'N/A',
      cadastroStatus: 'liberado'
    },
    {
      id: 'w3',
      name: 'Carlos Henrique Souza',
      company: 'Maranhão Engenharia',
      role: 'Eletricista de Potência',
      asoStatus: 'bloqueado',
      asoExpiry: 'Vencido (10/05/2026)',
      nr35Status: 'pendente',
      nr35Expiry: 'Aguardando Avaliação',
      cadastroStatus: 'pendente'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new worker
  const [newWorkerName, setNewWorkerName] = useState('');
  const [newWorkerCompany, setNewWorkerCompany] = useState('');
  const [newWorkerRole, setNewWorkerRole] = useState('');
  const [newWorkerASO, setNewWorkerASO] = useState<File | null>(null);
  const [isMobilizing, setIsMobilizing] = useState(false);

  const handleCreateWorker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWorkerName || !newWorkerCompany || !newWorkerRole) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsMobilizing(true);

    // Simulate OCR and validation delay
    setTimeout(() => {
      const created: MobilizedWorker = {
        id: `w-${Date.now()}`,
        name: newWorkerName,
        company: newWorkerCompany,
        role: newWorkerRole,
        asoStatus: 'liberado',
        asoExpiry: '12/12/2026 (Validado via OCR)',
        nr35Status: 'liberado',
        nr35Expiry: '15/09/2027',
        cadastroStatus: 'liberado'
      };

      setWorkers(prev => [created, ...prev]);
      setIsMobilizing(false);
      setShowAddModal(false);
      
      // Reset form
      setNewWorkerName('');
      setNewWorkerCompany('');
      setNewWorkerRole('');
      setNewWorkerASO(null);

      alert(`Trabalhador ${created.name} mobilizado com sucesso! Status: Liberado ("Tudo aprovado e bilesa!")`);
    }, 1800);
  };

  const filteredWorkers = workers.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: 'liberado' | 'pendente' | 'bloqueado' | 'vazio') => {
    switch (status) {
      case 'liberado':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-955/40 text-emerald-700 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-800/40 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 w-max">
            <CheckCircle2 className="w-3 h-3" />
            Liberado
          </span>
        );
      case 'pendente':
        return (
          <span className="px-2.5 py-1 bg-yellow-100 dark:bg-yellow-955/40 text-yellow-750 dark:text-yellow-500 border border-yellow-250 dark:border-yellow-800/40 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 w-max animate-pulse">
            <AlertTriangle className="w-3 h-3" />
            Pendente
          </span>
        );
      case 'bloqueado':
        return (
          <span className="px-2.5 py-1 bg-red-100 dark:bg-red-955/40 text-red-750 dark:text-red-400 border border-red-250 dark:border-red-800/40 text-[10px] font-extrabold rounded-md uppercase tracking-wider flex items-center gap-1 w-max">
            <XCircle className="w-3 h-3" />
            Bloqueado
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-800 text-[10px] font-medium rounded-md uppercase tracking-wider w-max">
            N/A
          </span>
        );
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6 overflow-hidden bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Top action/filters bar */}
      <div className="flex justify-between items-center mb-6 gap-4">
        {/* Search */}
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Pesquisar terceiros, contratadas ou cargos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-450 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-none"
          />
        </div>

        {/* Mobilize Worker CTA */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs rounded-xl flex items-center gap-2 hover:opacity-95 transition-opacity shadow-lg shadow-cyan-500/10"
        >
          <UserPlus className="w-4 h-4 text-slate-950" />
          Mobilizar Novo Terceiro
        </button>
      </div>

      {/* Main Table view */}
      <div className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-sm transition-colors duration-200">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">Profissional / Contratada</th>
                <th className="py-4 px-6">Função</th>
                <th className="py-4 px-6">Exame ASO</th>
                <th className="py-4 px-6">Treinamento NR-35</th>
                <th className="py-4 px-6">Ficha / Cadastro</th>
                <th className="py-4 px-6">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150 dark:divide-slate-900 text-xs">
              {filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Nenhum profissional encontrado para os termos da busca.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-900 dark:text-white">{worker.name}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <Building className="w-3 h-3 text-slate-400" />
                        {worker.company}
                      </p>
                    </td>
                    <td className="py-4 px-6 text-slate-700 dark:text-slate-300 font-medium">{worker.role}</td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {getStatusBadge(worker.asoStatus)}
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Val: {worker.asoExpiry}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {getStatusBadge(worker.nr35Status)}
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Val: {worker.nr35Expiry}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(worker.cadastroStatus)}
                    </td>
                    <td className="py-4 px-6">
                      <button 
                        onClick={() => alert(`Visualizando documentos cadastrais de ${worker.name}`)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-850 transition-all"
                      >
                        Visualizar NRs
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker Simulation Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-955 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative text-slate-800 dark:text-slate-100"
            >
              <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-850 pb-4 mb-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Mobilização de Terceiro (Simulação OCR)</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-350 font-bold text-xs"
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={handleCreateWorker} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest block uppercase">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    value={newWorkerName}
                    onChange={(e) => setNewWorkerName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest block uppercase">Contratada (Empresa)</label>
                  <input 
                    type="text"
                    required
                    value={newWorkerCompany}
                    onChange={(e) => setNewWorkerCompany(e.target.value)}
                    placeholder="Ex: Metalúrgica Silva Ltda"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest block uppercase">Função/Cargo</label>
                  <input 
                    type="text"
                    required
                    value={newWorkerRole}
                    onChange={(e) => setNewWorkerRole(e.target.value)}
                    placeholder="Ex: Mecânico de Correia"
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                {/* Upload Section Mock */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-widest block uppercase">Anexar Envelope ASO & NRs</label>
                  <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center cursor-pointer hover:border-cyan-500/50 transition-all bg-slate-50 dark:bg-slate-900/30">
                    <UploadCloud className="w-6 h-6 text-slate-400 dark:text-slate-500 mx-auto mb-2" />
                    <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Arraste os arquivos PDF ou Imagens aqui</p>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">O sistema validará o ASO e certificados de NRs de forma automatizada via OCR.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isMobilizing}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 hover:opacity-95 transition-opacity mt-6 shadow-lg shadow-cyan-500/10"
                >
                  {isMobilizing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Processando OCR & Verificando NRs...</span>
                    </>
                  ) : (
                    <>
                      <FileCheck className="w-4 h-4 text-slate-950" />
                      <span>Cadastrar e Autovalidar SSO</span>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
