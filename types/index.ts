
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cnic?: string;
  mobile?: string;
  address?: string;
  teamId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'senior_lawyer' | 'junior_lawyer' | 'clerk';

export interface Case {
  id: string;
  caseNumber: string;
  courtName: CourtName;
  parties: {
    plaintiffs: Party[];
    defendants: Party[];
  };
  opponentLawyers: string[];
  legalSections: LegalSection[];
  hearings: Hearing[];
  documents: Document[];
  assignedLawyerId: string;
  status: CaseStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  teamId: string;
}

export type CourtName = 
  | 'Civil Court'
  | 'Session Court'
  | 'Family Court'
  | 'Magistrate'
  | 'Tehsildar'
  | 'High Court'
  | 'Supreme Court'
  | 'NAB/FIA'
  | 'Police Station (FIR stage)';

export type CaseStatus = 'active' | 'pending' | 'disposed' | 'adjourned';

export interface Party {
  id: string;
  name: string;
  cnic?: string;
  mobile?: string;
  email?: string;
  address?: string;
}

export type LegalSection = 
  | 'PPC'
  | 'CrPC'
  | 'CPC'
  | 'Family Laws'
  | 'Rent'
  | 'NAB'
  | 'FIA';

export interface Hearing {
  id: string;
  hearingNumber: number;
  date: Date;
  courtOrderType: CourtOrderType;
  notes: string;
  assignedLawyerId: string;
  previousComments?: string;
  nextSteps?: string;
  caseId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CourtOrderType = 
  | 'Evidence'
  | 'Cross'
  | 'Adjournment'
  | 'Arguments'
  | 'Judgment';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  uri: string;
  size: number;
  mimeType: string;
  caseId: string;
  hearingId?: string;
  uploadedBy: string;
  uploadedAt: Date;
  tags: string[];
}

export type DocumentType = 
  | 'FIR'
  | 'Petition'
  | 'Order'
  | 'Judgment'
  | 'Evidence'
  | 'Other';

export interface Team {
  id: string;
  name: string;
  seniorLawyerId: string;
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
  read: boolean;
  data?: any;
  createdAt: Date;
}

export type NotificationType = 
  | 'hearing_reminder'
  | 'case_assignment'
  | 'document_upload'
  | 'approval_request'
  | 'system';

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  todayHearings: number;
  tomorrowHearings: number;
  pendingApprovals: number;
  recentDocuments: number;
}
