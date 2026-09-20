import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  User, 
  AdminUser, 
  Worker, 
  Mine, 
  DocumentItem, 
  ProcessingJob, 
  StructuredMiningData, 
  Assignment, 
  NotificationItem,
  ChatMessage,
  TaskStatus,
  DocumentStatus,
  UserAccessRequest
} from '../types';
import { 
  mockMines, 
  mockCurrentUser, 
  mockCurrentAdmin, 
  mockAssignment, 
  mockWorkers, 
  mockPortalUsers, 
  mockDocuments, 
  mockProcessingJobs, 
  mockStructuredData, 
  mockNotifications,
  mockMineAssistQnA
} from '../data/mockData';
import { 
  OFFICIAL_PUBLIC_DOCUMENTS, 
  INITIAL_USER_ACCESS_REQUESTS 
} from '../data/officialMiningData';
import { translations } from '../i18n/translations';

interface AppContextType {
  currentRole: UserRole;
  currentLang: Language;
  isLoggedIn: boolean;
  currentUser: User;
  currentAdmin: AdminUser;
  currentRoute: string;
  mines: Mine[];
  workers: Worker[];
  users: User[];
  documents: DocumentItem[];
  processingJobs: ProcessingJob[];
  structuredData: StructuredMiningData[];
  assignment: Assignment;
  notifications: NotificationItem[];
  chatMessages: ChatMessage[];
  accessRequests: UserAccessRequest[];
  t: typeof translations.en;
  
  // Modals & Inspectors
  selectedMine: Mine | null;
  setSelectedMine: (mine: Mine | null) => void;
  selectedDoc: DocumentItem | null;
  setSelectedDoc: (doc: DocumentItem | null) => void;
  selectedWorker: Worker | null;
  setSelectedWorker: (worker: Worker | null) => void;

  // Actions
  login: (role: UserRole) => void;
  loginWithUser: (user: User) => void;
  loginWithAdmin: () => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  setLanguage: (lang: Language) => void;
  navigate: (route: string) => void;
  updateWorkerProfile: (data: Partial<User>) => void;
  updateAdminProfile: (data: Partial<AdminUser>) => void;
  updateAssignmentStatus: (status: TaskStatus) => void;
  uploadDocument: (fileData: { name: string; size: string }, metadata: Partial<DocumentItem>) => string;
  advanceProcessingStage: (jobId: string) => void;
  addMine: (newMine: Partial<Mine>) => void;
  updateMine: (mine: Mine) => void;
  updateWorker: (worker: Worker) => void;
  toggleUserStatus: (userId: string) => void;
  addUser: (user: Partial<User>) => void;
  approveAccessRequest: (requestId: string) => void;
  rejectAccessRequest: (requestId: string, notes?: string) => void;
  submitAccessRequest: (req: Omit<UserAccessRequest, 'id' | 'status' | 'requestedAt' | 'isDemo'>) => UserAccessRequest;
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteDocument: (id: string) => void;
  updateDocumentMetadata: (id: string, updates: Partial<DocumentItem>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('USER');
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Starts at Welcome / Role-selection screen
  const [currentRoute, setCurrentRoute] = useState<string>('/welcome');
  
  const [currentUser, setCurrentUser] = useState<User>(mockCurrentUser);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser>(mockCurrentAdmin);
  const [mines, setMines] = useState<Mine[]>(mockMines);
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [users, setUsers] = useState<User[]>(mockPortalUsers);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    ...OFFICIAL_PUBLIC_DOCUMENTS,
    ...mockDocuments
  ]);
  const [processingJobs, setProcessingJobs] = useState<ProcessingJob[]>(mockProcessingJobs);
  const [structuredData, setStructuredData] = useState<StructuredMiningData[]>(mockStructuredData);
  const [assignment, setAssignment] = useState<Assignment>(mockAssignment);
  const [notifications, setNotifications] = useState<NotificationItem[]>(mockNotifications);
  const [accessRequests, setAccessRequests] = useState<UserAccessRequest[]>(INITIAL_USER_ACCESS_REQUESTS);
  
  // Selection modals
  const [selectedMine, setSelectedMine] = useState<Mine | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  // Initial greeting message for Mine Assist based on role
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      text: 'Greetings. I am Mine Assist, your operational AI knowledge retriever. How may I assist you with your mine duties, shift assignments, or technical documents today?',
      timestamp: 'Just now',
      suggestedFollowUps: [
        "Show today's assignment.",
        "Which mine am I assigned to?",
        "Show recent safety information."
      ]
    }
  ]);

  // Sync route when role changes
  const switchRole = (newRole: UserRole) => {
    setCurrentRole(newRole);
    if (newRole === 'ADMIN') {
      setCurrentRoute('/admin/dashboard');
      setChatMessages([
        {
          id: 'msg-adm-init',
          role: 'assistant',
          text: 'Greetings, Dr. Arvind Sharma. Mine Assist is ready with enterprise clearance. You have full access across all 6 coalfield clusters, statutory compliance records, and processing pipelines.',
          timestamp: 'Just now',
          suggestedFollowUps: [
            "Show documents uploaded this week.",
            "Which mines have the most documents?",
            "Show pending document processing."
          ]
        }
      ]);
    } else {
      setCurrentRoute('/user/dashboard');
      setChatMessages([
        {
          id: 'msg-user-init',
          role: 'assistant',
          text: 'Greetings, Rameshwar Soren. I am initialized with your operational clearance for Rajmahal Open Cast Project (Zone B).',
          timestamp: 'Just now',
          suggestedFollowUps: [
            "Show today's assignment.",
            "Which mine am I assigned to?",
            "Show recent safety information."
          ]
        }
      ]);
    }
  };

  const login = (role: UserRole) => {
    setIsLoggedIn(true);
    switchRole(role);
  };

  const loginWithUser = (user: User) => {
    setCurrentUser(user);
    setCurrentRole('USER');
    setIsLoggedIn(true);
    setCurrentRoute('/user/dashboard');
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: `Greetings, ${user.name}. I am initialized with your operational clearance for ${user.assignedMineName} (${user.assignedZone}).`,
        timestamp: 'Just now',
        suggestedFollowUps: [
          "Show today's assignment.",
          "Which mine am I assigned to?",
          "Show recent safety information."
        ]
      }
    ]);
  };

  const loginWithAdmin = () => {
    setCurrentRole('ADMIN');
    setIsLoggedIn(true);
    setCurrentRoute('/admin/overview');
    setChatMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        text: `Greetings, Dr. Arvind Sharma. Mine Assist is ready with enterprise clearance. You have full access across all 6 coalfield clusters, statutory compliance records, and processing pipelines.`,
        timestamp: 'Just now',
        suggestedFollowUps: [
          "Show documents uploaded this week.",
          "Which mines have the most documents?",
          "Show pending document processing."
        ]
      }
    ]);
  };

  const approveAccessRequest = (requestId: string) => {
    setAccessRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'APPROVED',
          reviewedBy: 'Dr. Arvind Sharma (Chief GM)',
          reviewedAt: 'Just now',
          notes: 'Directorate clearance granted. Account activated for field operations.'
        };
      }
      return req;
    }));

    // If matching user exists in users table, update status
    const targetReq = accessRequests.find(r => r.id === requestId);
    if (targetReq) {
      setUsers(prev => prev.map(u => {
        if (u.email.toLowerCase() === targetReq.email.toLowerCase() || u.name === targetReq.fullName) {
          return { ...u, accountStatus: 'active', approvalStatus: 'APPROVED' };
        }
        return u;
      }));

      // Add a notification for admin
      setNotifications(prev => [
        {
          id: `notif-appr-${Date.now()}`,
          title: 'Access Request Approved',
          titleHi: 'पहुंच अनुरोध स्वीकृत',
          message: `Access granted for ${targetReq.fullName} (${targetReq.designation}) at ${targetReq.requestedMine}.`,
          messageHi: `${targetReq.fullName} के लिए पहुंच स्वीकृत कर दी गई है।`,
          type: 'system',
          targetRole: 'ADMIN',
          timestamp: 'Just now',
          read: false
        },
        ...prev
      ]);
    }
  };

  const rejectAccessRequest = (requestId: string, notes?: string) => {
    setAccessRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'REJECTED',
          reviewedBy: 'Dr. Arvind Sharma (Chief GM)',
          reviewedAt: 'Just now',
          notes: notes || 'Access Request Rejected: Statutory clearance or safety induction verification incomplete.'
        };
      }
      return req;
    }));

    const targetReq = accessRequests.find(r => r.id === requestId);
    if (targetReq) {
      setUsers(prev => prev.map(u => {
        if (u.email.toLowerCase() === targetReq.email.toLowerCase() || u.name === targetReq.fullName) {
          return { ...u, accountStatus: 'suspended', approvalStatus: 'REJECTED' };
        }
        return u;
      }));
    }
  };

  const submitAccessRequest = (req: Omit<UserAccessRequest, 'id' | 'status' | 'requestedAt' | 'isDemo'>): UserAccessRequest => {
    const newReq: UserAccessRequest = {
      ...req,
      id: `req-${Date.now().toString().slice(-4)}`,
      status: 'PENDING',
      requestedAt: 'Just now',
      notes: 'Submitted via MineX portal. Awaiting Directorate Administrator review.',
      isDemo: false
    };

    setAccessRequests(prev => [newReq, ...prev]);

    // Notify admin
    setNotifications(prev => [
      {
        id: `notif-req-${Date.now()}`,
        title: 'New Access Request Submitted',
        titleHi: 'नया पहुंच अनुरोध प्राप्त हुआ',
        message: `${newReq.fullName} requested operative access for ${newReq.requestedMine}.`,
        messageHi: `${newReq.fullName} ने ${newReq.requestedMine} के लिए पहुंच अनुरोध किया।`,
        type: 'system',
        targetRole: 'ADMIN',
        timestamp: 'Just now',
        read: false
      },
      ...prev
    ]);

    return newReq;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setCurrentRoute('/welcome');
  };

  const navigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateWorkerProfile = (data: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...data }));
  };

  const updateAdminProfile = (data: Partial<AdminUser>) => {
    setCurrentAdmin(prev => ({ ...prev, ...data }));
  };

  const updateAssignmentStatus = (newStatus: TaskStatus) => {
    setAssignment(prev => ({ ...prev, status: newStatus }));
  };

  const uploadDocument = (fileData: { name: string; size: string }, metadata: Partial<DocumentItem>): string => {
    const newDocId = `doc-${Date.now().toString().slice(-4)}`;
    const newJobId = `JOB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newDoc: DocumentItem = {
      id: newDocId,
      title: metadata.title || fileData.name.replace(/\.[^/.]+$/, ''),
      fileName: fileData.name,
      fileSize: fileData.size,
      docType: metadata.docType || 'Mine Plan',
      sourceOrganization: metadata.sourceOrganization || 'CMPDI',
      mineId: metadata.mineId || 'mine-01',
      mineName: metadata.mineName || 'Rajmahal Open Cast Project',
      department: metadata.department || 'Operations',
      year: metadata.year || new Date().getFullYear(),
      reportingPeriod: metadata.reportingPeriod || 'Current Period',
      description: metadata.description || 'Ingested mining documentation for digital processing.',
      tags: metadata.tags && metadata.tags.length > 0 ? metadata.tags : ['Ingested', 'Field Survey'],
      priority: metadata.priority || 'medium',
      uploadedBy: currentRole === 'ADMIN' ? `${currentAdmin.name} (Admin)` : `${currentUser.name} (Worker)`,
      uploadedAt: 'Just now',
      processingStatus: 'uploaded',
      progressPercent: 15,
      downloadUrl: `#prototype-download-${newDocId}`
    };

    const newJob: ProcessingJob = {
      jobId: newJobId,
      docId: newDocId,
      docTitle: newDoc.title,
      status: 'uploaded',
      progress: 15,
      uploadedTime: 'Just now',
      processingStartedTime: 'Just now',
      lastUpdatedTime: 'Just now',
      pipelineStages: [
        { stage: 'uploaded', completed: true, timestamp: 'Just now', notes: 'File validated and ingested into staging cache.' },
        { stage: 'processing', completed: false, timestamp: 'Pending', notes: 'Queued for OCR neural rasterization.' },
        { stage: 'extracting', completed: false, timestamp: 'Pending', notes: 'Awaiting OCR completion.' },
        { stage: 'structuring', completed: false, timestamp: 'Pending', notes: 'Awaiting extraction.' },
        { stage: 'processed', completed: false, timestamp: 'Pending', notes: 'Awaiting validation.' }
      ]
    };

    setDocuments(prev => [newDoc, ...prev]);
    setProcessingJobs(prev => [newJob, ...prev]);

    // Add a notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Document Uploaded: ${newDoc.title.slice(0, 35)}...`,
      titleHi: `दस्तावेज़ अपलोड किया गया: ${newDoc.title.slice(0, 30)}...`,
      message: `File ${newDoc.fileName} queued for automated OCR and tabular extraction.`,
      messageHi: `फ़ाइल ${newDoc.fileName} स्वचालित ओसीआर के लिए कतारबद्ध।`,
      type: 'processing',
      targetRole: 'ADMIN',
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newDocId;
  };

  const advanceProcessingStage = (jobId: string) => {
    setProcessingJobs(prev => prev.map(job => {
      if (job.jobId !== jobId) return job;
      
      const stages: DocumentStatus[] = ['uploaded', 'processing', 'extracting', 'structuring', 'processed'];
      const currentIndex = stages.indexOf(job.status);
      const nextStage = currentIndex < stages.length - 1 ? stages[currentIndex + 1] : 'processed';
      const nextProgress = Math.min(100, job.progress + 25);

      // Update document as well
      setDocuments(docs => docs.map(d => {
        if (d.id === job.docId) {
          return { ...d, processingStatus: nextStage, progressPercent: nextProgress };
        }
        return d;
      }));

      const updatedStages = job.pipelineStages.map((st, idx) => {
        if (idx <= currentIndex + 1) {
          return { ...st, completed: true, timestamp: 'Just updated' };
        }
        return st;
      });

      return {
        ...job,
        status: nextStage,
        progress: nextProgress,
        lastUpdatedTime: 'Just now',
        pipelineStages: updatedStages
      };
    }));
  };

  const addMine = (newMineData: Partial<Mine>) => {
    const mine: Mine = {
      id: `mine-${Date.now().toString().slice(-3)}`,
      name: newMineData.name || 'New Coal Block',
      nameHi: newMineData.nameHi || newMineData.name,
      mineId: `M-${newMineData.state?.slice(0, 3).toUpperCase() || 'CIL'}-${Math.floor(100 + Math.random() * 900)}`,
      mineCode: newMineData.mineCode || 'NEW-OCP-1',
      location: newMineData.location || 'Central Mining District',
      state: newMineData.state || 'Jharkhand',
      district: newMineData.district || 'Dhanbad',
      mineType: newMineData.mineType || 'Open Cast',
      operationalStatus: newMineData.operationalStatus || 'operational',
      zones: newMineData.zones || [
        { id: 'z1', name: 'Zone A - Initial Stripping', riskLevel: 'Medium', activeWorkers: 45, currentActivity: 'Site Preparation', safetyScore: 95 }
      ],
      workersCount: newMineData.workersCount || 45,
      supervisors: newMineData.supervisors || ['S. K. Choudhury'],
      currentShiftInfo: 'Normal operation bench stripping',
      dailyProductionTarget: newMineData.dailyProductionTarget || 20000,
      currentProduction: newMineData.currentProduction || 18500,
      safetyRating: newMineData.safetyRating || 92,
      lastInspectionDate: new Date().toISOString().split('T')[0],
      assignedDocumentsCount: 0,
      lastUpdatedDate: new Date().toISOString().split('T')[0],
      coordinates: newMineData.coordinates || { lat: 23.8, lng: 86.4 },
      description: newMineData.description || 'Newly registered mining operational sector under centralized digitized governance.'
    };
    setMines(prev => [mine, ...prev]);
  };

  const updateMine = (updatedMine: Mine) => {
    setMines(prev => prev.map(m => m.id === updatedMine.id ? updatedMine : m));
    if (selectedMine?.id === updatedMine.id) {
      setSelectedMine(updatedMine);
    }
  };

  const updateWorker = (updatedWorker: Worker) => {
    setWorkers(prev => prev.map(w => w.id === updatedWorker.id ? updatedWorker : w));
    if (selectedWorker?.id === updatedWorker.id) {
      setSelectedWorker(updatedWorker);
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const newStatus = u.accountStatus === 'active' ? 'inactive' : 'active';
        return { ...u, accountStatus: newStatus };
      }
      return u;
    }));
  };

  const addUser = (userData: Partial<User>) => {
    const newUser: User = {
      id: `u-${Date.now().toString().slice(-4)}`,
      userId: `usr_${userData.name?.toLowerCase().replace(/\s+/g, '_') || 'user'}`,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      name: userData.name || 'New Personnel',
      email: userData.email || 'user@minex.gov.in',
      primaryContact: userData.primaryContact || '+91 94310 00000',
      altContact: '+91 00000 00000',
      designation: userData.designation || 'Mining Officer',
      department: userData.department || 'Operations',
      assignedMineId: userData.assignedMineId || 'mine-01',
      assignedMineName: userData.assignedMineName || 'Rajmahal Open Cast Project',
      assignedZone: 'General Perimeter',
      shift: 'General Shift',
      supervisor: 'Operations Lead',
      joiningDate: new Date().toISOString().split('T')[0],
      workLocation: 'On-site Office',
      accountStatus: 'active',
      lastLogin: 'Never',
      languagePreference: 'en',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      role: (userData.role as UserRole) || 'USER',
      emergencyContact: { name: 'Emergency Desk', relation: 'Office', phone: '+91 94310 99999' }
    };
    setUsers(prev => [newUser, ...prev]);
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    setProcessingJobs(prev => prev.filter(j => j.docId !== id));
    if (selectedDoc?.id === id) {
      setSelectedDoc(null);
    }
  };

  const updateDocumentMetadata = (id: string, updates: Partial<DocumentItem>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    if (selectedDoc?.id === id) {
      setSelectedDoc(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const sendChatMessage = (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-u`,
      role: 'user',
      text: userText,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);

    // Lookup matching response from mock knowledge store based on role
    setTimeout(() => {
      const qnaPool = currentRole === 'ADMIN' ? mockMineAssistQnA.admin : mockMineAssistQnA.user;
      
      // Simple fuzzy matching
      const cleanUserText = userText.toLowerCase().trim();
      const match = qnaPool.find(item => 
        cleanUserText.includes(item.q.toLowerCase().slice(0, 15)) ||
        item.q.toLowerCase().includes(cleanUserText) ||
        (item.qHi && item.qHi.includes(userText))
      );

      let responseText = '';
      let citations: { title: string; ref: string }[] = [];

      if (match) {
        responseText = currentLang === 'hi' && match.aHi ? match.aHi : match.a;
        citations = match.sources;
      } else {
        // Context-aware fallback
        if (currentRole === 'ADMIN') {
          responseText = currentLang === 'hi'
            ? `माइन-एक्स ज्ञानकोष (एडमिन स्तर): आपके प्रश्न "${userText}" के संदर्भ में, सभी 6 खदानों के 257+ दस्तावेज़ अनुक्रमित हैं। आप विशिष्ट खदान, कर्मचारी सूची या वैधानिक ऑडिट के बारे में पूछ सकते हैं।`
            : `Mine Assist (Admin Authorization): Regarding "${userText}", our centralized repository tracks 257+ documents across 6 subsidiary clusters. Try asking for "documents uploaded this week", "pending document processing", or "workers assigned to Eastern Coal Mine".`;
          citations = [{ title: 'Master MineX Enterprise Corpus', ref: 'DGMS / CMPDI Data Lake' }];
        } else {
          responseText = currentLang === 'hi'
            ? `माइन-एक्स फील्ड सहायता: आपके प्रश्न "${userText}" के संदर्भ में, आप राजमहल ओपन कास्ट खदान (ज़ोन बी) में तैनात हैं। आज की पाली सुबह 06:00 से 14:00 बजे तक है। अधिक विवरण के लिए "आज का कार्यभार" या "हाल की सुरक्षा जानकारी" पूछें।`
            : `Mine Assist (Worker Clearance): Regarding "${userText}", you are assigned to Rajmahal Open Cast Project (Zone B - Bench 3 East). Your shift supervisor is Rajesh Kumar. For specific operational details, try asking "Show today's assignment" or "Show recent safety information".`;
          citations = [{ title: 'Active Field Roster & Safety CMR', ref: 'Rajmahal Pit Telemetry' }];
        }
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-a`,
        role: 'assistant',
        text: responseText,
        timestamp: 'Just now',
        citations,
        suggestedFollowUps: currentRole === 'ADMIN' 
          ? ["Show documents uploaded this week.", "Which mines have the most documents?", "Show pending document processing."]
          : ["Show today's assignment.", "Which mine am I assigned to?", "Show recent safety information."]
      };

      setChatMessages(prev => [...prev, assistantMsg]);
    }, 600);
  };

  const clearChat = () => {
    setChatMessages([]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const t = translations[currentLang];

  return (
    <AppContext.Provider value={{
      currentRole,
      currentLang,
      isLoggedIn,
      currentUser,
      currentAdmin,
      currentRoute,
      mines,
      workers,
      users,
      documents,
      processingJobs,
      structuredData,
      assignment,
      notifications,
      chatMessages,
      accessRequests,
      t,
      selectedMine,
      setSelectedMine,
      selectedDoc,
      setSelectedDoc,
      selectedWorker,
      setSelectedWorker,
      login,
      loginWithUser,
      loginWithAdmin,
      logout,
      switchRole,
      setLanguage: setCurrentLang,
      navigate,
      updateWorkerProfile,
      updateAdminProfile,
      updateAssignmentStatus,
      uploadDocument,
      advanceProcessingStage,
      addMine,
      updateMine,
      updateWorker,
      toggleUserStatus,
      addUser,
      approveAccessRequest,
      rejectAccessRequest,
      submitAccessRequest,
      sendChatMessage,
      clearChat,
      markNotificationAsRead,
      markAllNotificationsRead,
      deleteDocument,
      updateDocumentMetadata
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
