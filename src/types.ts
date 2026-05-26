/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  name: string;
  role: string;
  location: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface LMSCourse {
  id: string;
  title: string;
  subject: string;
  group: string;
  progress: number; // 0 to 100
  status: 'EM_ANDAMENTO' | 'CONCLUIDO' | 'BLOQUEADO';
  nextClassDate: string;
  videoUrl?: string;
  materialsCount: number;
}

export interface TerminalStatus {
  name: string;
  status: 'NORMAL' | 'ALERTA' | 'INTERROMPIDO';
  cameraFeedUrl: string;
  lastUpdated: string;
}

export interface ESGData {
  co2Current: number; // e.g. 42.5 tCO2e
  co2VsPrevPercent: number; // e.g. -8
  co2History: { month: string; value: number; isCurrent?: boolean }[];
  co2Goal: number; // maximum goal
  recycleRate: number; // e.g. 92
  recycleOrganics: number; // e.g. 1.2
  recycleInertes: number; // e.g. 0.4
  accidentsHoursFree: number; // e.g. 14200
  trainingsCompletedPercent: number;
  nrAlertsActive: number;
  fiscalCouncilStatus: 'REGULAR' | 'PENDENTE';
  transparencyStatus: 'OK' | 'REVISAO';
}

export interface FieldPresenceLog {
  id: string;
  timestamp: string;
  locationName: string;
  gpsAccuracy: number; // e.g., 8
  reason: string;
  evidencePhoto?: string; // base64 or object URL or placeholder
  synced: boolean;
}

export interface ContractorWorker {
  id: string;
  name: string;
  contractor: string;
  role: string;
  asoExpires: string;
  asoDaysLeft: number;
  nr10Status: 'VALIDO' | 'EXPIRADO' | 'NAO_APLICAVEL';
  nr35Status: 'VALIDO' | 'EXPIRADO' | 'NAO_APLICAVEL';
  nr29Status: 'VALIDO' | 'EXPIRADO' | 'NAO_APLICAVEL';
  documentsUploaded: {
    aso: boolean;
    contract: boolean;
    trainings: boolean;
  };
  mobilized: boolean;
}

export interface FieldInspection {
  id: string;
  timestamp: string;
  inspectorName: string;
  area: string;
  checklist: {
    cleanliness: boolean; // capina e poeira
    epis: boolean; // EPIs em conformidade
    machineryGuard: boolean; // proteções móveis de correias
    safetyStops: boolean; // sensores/paradas chave
  };
  details: string;
  evidencePhoto?: string;
  gpsCoordinates: {
    lat: number;
    lng: number;
  };
}

export interface ActionTask {
  id: string;
  inspectionId: string;
  title: string;
  area: string;
  description: string;
  assignedManager: string;
  status: 'PENDENTE' | 'RESOLVIDO';
  resolutionNote?: string;
  resolutionPhoto?: string;
  createdAt: string;
  resolvedAt?: string;
}

