/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LMSCourse, TerminalStatus, ESGData, ContractorWorker, FieldInspection, ActionTask } from './types';

export const INITIAL_USER = {
  name: "Evanildo de Jesus Campos Barros",
  role: "Operador Sênior",
  location: "Porto de Itaqui",
  isLoggedIn: false
};

export const INITIAL_COURSES: LMSCourse[] = [
  {
    id: "course-1",
    title: "Eletromecânica Aplicada a Sistemas Portuários",
    subject: "Eletromecânica",
    group: "Turma Ter/Qui",
    progress: 50,
    status: "EM_ANDAMENTO",
    nextClassDate: "Terça-feira, 15:30",
    materialsCount: 12
  },
  {
    id: "course-2",
    title: "NR-29: Segurança e Saúde no Trabalho Portuário",
    subject: "Segurança Portuária",
    group: "Turma Semanal",
    progress: 100,
    status: "CONCLUIDO",
    nextClassDate: "Finalizado",
    materialsCount: 8
  },
  {
    id: "course-3",
    title: "Operações de Guindastes de Alta Capacidade (Marlins)",
    subject: "Maquinários",
    group: "Turma Sábado",
    progress: 20,
    status: "EM_ANDAMENTO",
    nextClassDate: "Sábado, 08:00",
    materialsCount: 15
  }
];

export const TERMINAL_STATUS_ITEMS: TerminalStatus[] = [
  {
    name: "PONTA DA ESPERA",
    status: "NORMAL",
    cameraFeedUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800", // port cranes
    lastUpdated: "Ao Vivo"
  },
  {
    name: "BERÇO 103",
    status: "NORMAL",
    cameraFeedUrl: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&q=80&w=800", // ship docking
    lastUpdated: "Há 1 min"
  }
];

export const INITIAL_ESG_DATA: ESGData = {
  co2Current: 42.5,
  co2VsPrevPercent: -8,
  co2History: [
    { month: "Dez", value: 45.2 },
    { month: "Jan", value: 48.0 },
    { month: "Fev", value: 41.5 },
    { month: "Mar", value: 52.1 },
    { month: "Abr", value: 46.8 },
    { month: "Mai", value: 42.5, isCurrent: true }
  ],
  co2Goal: 50.0,
  recycleRate: 92,
  recycleOrganics: 1.2,
  recycleInertes: 0.4,
  accidentsHoursFree: 14200,
  trainingsCompletedPercent: 100,
  nrAlertsActive: 0,
  fiscalCouncilStatus: "REGULAR",
  transparencyStatus: "OK"
};

export const REASON_OPTIONS = [
  "Trabalho Externo - EMAP",
  "Supervisão de Pátio e Moega",
  "Vistoria de Carga e Silos",
  "Inspeção Preventiva de Eletromecânica",
  "Apoio Operacional no Berço 103",
  "Ronda de Conformidade ESG e NR-15"
];

// Pre-populated Contractors Matrix for HSE/SSO & Gestão de Terceiros
export const INITIAL_CONTRACTOR_WORKERS: ContractorWorker[] = [
  {
    id: "worker-1",
    name: "Mário Silva de Oliveira",
    contractor: "Maranhão Montagens Industriais Ltd.",
    role: "Especialista em Correias Fitadas",
    asoExpires: "2026-06-15",
    asoDaysLeft: 20, // Expiring soon!
    nr10Status: "VALIDO",
    nr35Status: "VALIDO",
    nr29Status: "VALIDO",
    documentsUploaded: {
      aso: true,
      contract: true,
      trainings: true
    },
    mobilized: true
  },
  {
    id: "worker-2",
    name: "Ana Souza de Jesus",
    contractor: "EngeVolt Serviços Elétricos",
    role: "Eletrotécnica Industrial Sênior",
    asoExpires: "2026-05-30",
    asoDaysLeft: 4, // Critical alert!
    nr10Status: "VALIDO",
    nr35Status: "EXPIRADO", // Expired NR35!
    nr29Status: "VALIDO",
    documentsUploaded: {
      aso: true,
      contract: true,
      trainings: false
    },
    mobilized: false // Locked because of expired training
  },
  {
    id: "worker-3",
    name: "Manoel Messias Barros",
    contractor: "Consórcio Norte de Logística",
    role: "Auxiliar de Operações e Moega",
    asoExpires: "2026-12-20",
    asoDaysLeft: 208,
    nr10Status: "NAO_APLICAVEL",
    nr35Status: "VALIDO",
    nr29Status: "VALIDO",
    documentsUploaded: {
      aso: true,
      contract: true,
      trainings: true
    },
    mobilized: true
  },
  {
    id: "worker-4",
    name: "Claudio Pinheiro Melo",
    contractor: "Delta Conservação Portuária",
    role: "Operator Ambiental de Pátio",
    asoExpires: "2026-04-10",
    asoDaysLeft: -46, // Expired!
    nr10Status: "NAO_APLICAVEL",
    nr35Status: "NAO_APLICAVEL",
    nr29Status: "EXPIRADO",
    documentsUploaded: {
      aso: false,
      contract: true,
      trainings: false
    },
    mobilized: false
  }
];

// Pre-populated safety digital inspections (no PowerPoint needed!)
export const INITIAL_INSPECTIONS: FieldInspection[] = [
  {
    id: "insp-1",
    timestamp: "2026-05-25 10:14",
    inspectorName: "Evanildo de Jesus Campos Barros",
    area: "Pátio de Estocagem Sul",
    checklist: {
      cleanliness: false, // Non-conforming! Needs Capina/Soil cleared
      epis: true,
      machineryGuard: true,
      safetyStops: true
    },
    details: "Acúmulo acentuado de vegetação/mato alto na área limite das moegas de descarga, oferecendo risco de incêndio e proliferação de vetores. Requer capina corretivo imediato.",
    evidencePhoto: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600", // overgrown weeds/grass
    gpsCoordinates: {
      lat: -2.5594,
      lng: -44.3648
    }
  },
  {
    id: "insp-2",
    timestamp: "2026-05-26 09:30",
    inspectorName: "Evanildo de Jesus Campos Barros",
    area: "Alimentador da Correia TR-02",
    checklist: {
      cleanliness: true,
      epis: true,
      machineryGuard: false, // Guard rail loose!
      safetyStops: true
    },
    details: "Grade de proteção lateral da polia de retorno da correia TR-02 solta, expondo eixos móveis e infringindo NR-12/29.",
    evidencePhoto: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600", // industrial equipment
    gpsCoordinates: {
      lat: -2.5588,
      lng: -44.3639
    }
  }
];

// Initial actions/resolutions assignments for area managers
export const INITIAL_ACTION_TASKS: ActionTask[] = [
  {
    id: "task-1",
    inspectionId: "insp-1",
    title: "Solicitação de Capina Corretiva no Pátio",
    area: "Pátio de Estocagem Sul",
    description: "Executar capina corretiva e limpeza de solo nas imediações do silo de farelo sul para eliminar risco de poeira e incêndio.",
    assignedManager: "Mário Pinto (Gerente de Pátio)",
    status: "PENDENTE",
    createdAt: "2026-05-25 10:30"
  },
  {
    id: "task-2",
    inspectionId: "insp-2",
    title: "Aperto/Reposição de Grade de Proteção TR-02",
    area: "Alimentador da Correia TR-02",
    description: "Parafusamento imediato da carenagem isoladora de rolantes da correia transportadora TR-02.",
    assignedManager: "Cássio Antunes (Supervisor Mecânico)",
    status: "RESOLVIDO",
    resolutionNote: "Grade reposicionada e apertada com contra-porcas adicionais de segurança em 26/05/2026.",
    resolutionPhoto: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600", // repared tool/worker
    createdAt: "2026-05-26 09:35",
    resolvedAt: "2026-05-26 11:20"
  }
];

