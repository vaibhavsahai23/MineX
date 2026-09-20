export type UserRole = 'USER' | 'ADMIN';
export type Language = 'en' | 'hi';

export type DocumentStatus = 
  | 'uploaded'
  | 'processing'
  | 'extracting'
  | 'structuring'
  | 'processed'
  | 'failed';

export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

export type MineStatus = 'operational' | 'maintenance' | 'inspection' | 'standby';

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'on_hold';

export type AccountStatus = 'active' | 'inactive' | 'suspended';
export type AccessApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

export interface UserAccessRequest {
  id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  designation: string;
  requestedMine: string;
  status: AccessApprovalStatus;
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
  isDemo: boolean;
}

export interface OfficialDataProvenance {
  organization: string;
  sourceDocument: string;
  reportingPeriod: string;
  dataDate: string;
  sourceUrl: string;
  statusText: string;
  metricLabel: string;
  metricValue: string | number;
  verificationNote?: string;
}

export interface User {
  id: string;
  userId: string;
  employeeId: string;
  name: string;
  nameHi?: string;
  email: string;
  primaryContact: string;
  altContact: string;
  designation: string;
  designationHi?: string;
  department: string;
  departmentHi?: string;
  assignedMineId: string;
  assignedMineName: string;
  assignedZone: string;
  shift: string;
  supervisor: string;
  joiningDate: string;
  workLocation: string;
  dateOfBirth?: string;
  accountStatus: AccountStatus;
  approvalStatus?: AccessApprovalStatus;
  lastLogin: string;
  languagePreference: Language;
  avatarUrl: string;
  role: UserRole;
  isDemo?: boolean;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
}

export interface AdminUser {
  id: string;
  adminId: string;
  employeeId: string;
  name: string;
  nameHi?: string;
  officialEmail: string;
  primaryContact: string;
  altContact: string;
  designation: string;
  designationHi?: string;
  department: string;
  organization: string;
  accessLevel: 'Level 1 - Super Admin' | 'Level 2 - Regional Director' | 'Level 3 - Mining Officer';
  permissions: string[];
  managedMines: string[];
  joiningDate: string;
  workLocation: string;
  accountStatus: AccountStatus;
  lastLogin: string;
  languagePreference: Language;
  avatarUrl: string;
  role: 'ADMIN';
}

export interface Worker {
  id: string;
  workerId: string;
  employeeId: string;
  name: string;
  nameHi?: string;
  contactNumber: string;
  email: string;
  designation: string;
  department: string;
  assignedMineId: string;
  assignedMineName: string;
  assignedZone: string;
  shift: string;
  supervisor: string;
  skills: string[];
  training: string[];
  certifications: string[];
  joiningDate: string;
  currentWorkAssignment: string;
  accountStatus: AccountStatus;
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  lastActivity: string;
  avatarUrl: string;
}

export interface MineZone {
  id: string;
  name: string;
  nameHi?: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  activeWorkers: number;
  currentActivity: string;
  safetyScore: number;
}

export interface Mine {
  id: string;
  name: string;
  nameHi?: string;
  mineId: string;
  mineCode: string;
  location: string;
  state: string;
  district: string;
  mineType: 'Open Cast' | 'Underground' | 'Mixed Surface & Deep Seam';
  operationalStatus: MineStatus;
  zones: MineZone[];
  workersCount: number;
  supervisors: string[];
  currentShiftInfo: string;
  dailyProductionTarget: number; // in Metric Tonnes
  currentProduction: number; // in Metric Tonnes
  safetyRating: number; // out of 100
  lastInspectionDate: string;
  assignedDocumentsCount: number;
  lastUpdatedDate: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  description: string;
}

export type DocumentType = 
  | 'Geological Report' 
  | 'Safety Audit' 
  | 'Environmental Clearance' 
  | 'Mine Plan' 
  | 'Daily Production Log' 
  | 'Statutory Compliance' 
  | 'Overburden Analysis'
  | 'Production Report'
  | 'DGMS Circular'
  | 'Worker Training';

export interface DocumentItem {
  id: string;
  title: string;
  titleHi?: string;
  fileName: string;
  fileSize: string;
  docType: DocumentType;
  sourceOrganization: 'CMPDI' | 'CIL Headquarters' | 'BCCL' | 'SECL' | 'MCL' | 'Ministry of Coal' | 'DGMS' | string;
  mineId: string;
  mineName: string;
  department: string;
  year: number;
  reportingPeriod: string;
  description: string;
  tags: string[];
  priority: PriorityLevel;
  uploadedBy: string;
  uploadedAt: string;
  processingStatus: DocumentStatus;
  progressPercent: number;
  isOfficialSource?: boolean;
  provenance?: OfficialDataProvenance;
  sourceUrl?: string;
  downloadUrl?: string;
  extractedMetadata?: {
    seamDepthMeters?: number;
    coalGrade?: string;
    totalReserveMT?: number;
    complianceScore?: number;
    auditFindingsCount?: number;
    approvedByOfficial?: string;
  };
}

export interface ProcessingJob {
  jobId: string;
  docId: string;
  docTitle: string;
  status: DocumentStatus;
  progress: number;
  uploadedTime: string;
  processingStartedTime: string;
  lastUpdatedTime: string;
  errorMessage?: string;
  pipelineStages: {
    stage: DocumentStatus;
    completed: boolean;
    timestamp: string;
    notes: string;
  }[];
}

export interface StructuredMiningData {
  id: string;
  recordCode: string;
  mineId: string;
  mineName: string;
  category: 'Coal Production' | 'Geological Seam' | 'Safety Inspection' | 'Environmental Telemetry' | 'HEMM Equipment';
  parameter: string;
  value: string | number;
  unit: string;
  recordedDate: string;
  zone: string;
  supervisorInCharge: string;
  sourceDocumentId: string;
  sourceDocumentTitle: string;
  complianceFlag: 'Normal' | 'Advisory' | 'Critical';
}

export interface Assignment {
  assignmentId: string;
  workerId: string;
  mineId: string;
  mineName: string;
  location: string;
  zone: string;
  shift: string;
  shiftTiming: string;
  supervisor: string;
  taskTitle: string;
  taskTitleHi?: string;
  taskDescription: string;
  taskDescriptionHi?: string;
  priority: PriorityLevel;
  startDateTime: string;
  expectedCompletion: string;
  status: TaskStatus;
  relatedDocuments: {
    docId: string;
    title: string;
  }[];
  safetyInstructions: string[];
  safetyInstructionsHi?: string[];
  assignmentHistory: {
    date: string;
    task: string;
    mine: string;
    status: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  type: 'document' | 'safety' | 'assignment' | 'system' | 'processing';
  targetRole: 'ALL' | 'USER' | 'ADMIN';
  timestamp: string;
  read: boolean;
  urgent?: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  citations?: {
    title: string;
    ref: string;
  }[];
  suggestedFollowUps?: string[];
}
