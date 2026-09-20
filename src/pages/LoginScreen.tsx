import React, { useState } from 'react';
import { 
  Shield, 
  HardHat, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  KeyRound, 
  Phone, 
  Mail, 
  User as UserIcon, 
  Globe,
  AlertCircle,
  RefreshCw,
  Building,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, AccessApprovalStatus } from '../types';
import { MineXAuthService } from '../services/authService';

type AuthStep = 
  | 'WELCOME'
  | 'USER_INPUT'
  | 'USER_OTP'
  | 'USER_STATUS_PENDING'
  | 'USER_STATUS_REJECTED'
  | 'ADMIN_INPUT'
  | 'ADMIN_OTP'
  | 'ADMIN_KEY';

export const LoginScreen: React.FC = () => {
  const { 
    currentLang, 
    setLanguage, 
    currentUser, 
    users, 
    accessRequests, 
    loginWithUser, 
    loginWithAdmin, 
    submitAccessRequest,
    t 
  } = useApp();

  const [step, setStep] = useState<AuthStep>('WELCOME');

  // User form states
  const [userName, setUserName] = useState('Rameshwar Soren');
  const [userContact, setUserContact] = useState('+91 94311 20491');
  const [userEmail, setUserEmail] = useState('rameshwar.soren@ecl.coalindia.in');
  const [userMine, setUserMine] = useState('Rajmahal Open Cast Project');
  const [userDesignation, setUserDesignation] = useState('Senior Extraction & Blasting Technician');

  // Admin form states
  const [adminName, setAdminName] = useState('Dr. Arvind Sharma');
  const [adminContact, setAdminContact] = useState('+91 94317 88400');
  const [adminEmail, setAdminEmail] = useState('arvind.sharma@cmpdi.gov.in');
  const [adminKey, setAdminKey] = useState('');

  // OTP states
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpError, setOtpError] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusFeedbackUser, setStatusFeedbackUser] = useState<{
    name: string;
    email: string;
    contact: string;
    mine: string;
    status: AccessApprovalStatus;
    notes?: string;
  } | null>(null);

  // Quick Demo Presets
  const applyDemoUser = (preset: 'approved' | 'pending' | 'rejected') => {
    if (preset === 'approved') {
      setUserName('Rameshwar Soren');
      setUserContact('+91 94311 20491');
      setUserEmail('rameshwar.soren@ecl.coalindia.in');
      setUserMine('Rajmahal Open Cast Project');
      setUserDesignation('Senior Extraction & Blasting Technician');
    } else if (preset === 'pending') {
      setUserName('Priya Sharma');
      setUserContact('+91 98712 34560');
      setUserEmail('priya.sharma@bccl.gov.in');
      setUserMine('Jharia Deep Seam Colliery');
      setUserDesignation('Assistant Strata Monitoring Engineer');
    } else {
      setUserName('Vikramaditya Singh');
      setUserContact('+91 98110 99823');
      setUserEmail('v.singh.contractor@external.net');
      setUserMine('Dipka Mega Open Cast Mine');
      setUserDesignation('Third-Party Haulage Contractor Operator');
    }
  };

  const handleUserSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userContact.trim() || !userEmail.trim()) {
      alert('Please provide your Full Name, Contact Number, and Email Address.');
      return;
    }
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
    setStep('USER_OTP');
  };

  const handleUserVerifyOtp = async () => {
    const fullOtp = otpDigits.join('');
    const res = await MineXAuthService.verifyOtp(fullOtp);
    if (!res.success) {
      setOtpError(res.error || 'Invalid OTP');
      return;
    }

    // Check approval status
    // 1. Check existing access requests
    const matchingReq = accessRequests.find(
      r => r.contactNumber.replace(/\s+/g, '') === userContact.replace(/\s+/g, '') ||
           r.email.toLowerCase() === userEmail.toLowerCase() ||
           r.fullName.toLowerCase() === userName.toLowerCase()
    );

    // 2. Check existing users
    const matchingUser = users.find(
      u => u.primaryContact.replace(/\s+/g, '') === userContact.replace(/\s+/g, '') ||
           u.email.toLowerCase() === userEmail.toLowerCase()
    );

    if (matchingReq) {
      if (matchingReq.status === 'APPROVED') {
        // Log in user
        const targetUser = matchingUser || currentUser;
        loginWithUser(targetUser);
      } else if (matchingReq.status === 'PENDING') {
        setStatusFeedbackUser({
          name: matchingReq.fullName,
          email: matchingReq.email,
          contact: matchingReq.contactNumber,
          mine: matchingReq.requestedMine,
          status: 'PENDING',
          notes: matchingReq.notes
        });
        setStep('USER_STATUS_PENDING');
      } else {
        setStatusFeedbackUser({
          name: matchingReq.fullName,
          email: matchingReq.email,
          contact: matchingReq.contactNumber,
          mine: matchingReq.requestedMine,
          status: 'REJECTED',
          notes: matchingReq.notes
        });
        setStep('USER_STATUS_REJECTED');
      }
    } else if (matchingUser) {
      if (matchingUser.accountStatus === 'active') {
        loginWithUser(matchingUser);
      } else if (matchingUser.accountStatus === 'suspended') {
        setStatusFeedbackUser({
          name: matchingUser.name,
          email: matchingUser.email,
          contact: matchingUser.primaryContact,
          mine: matchingUser.assignedMineName,
          status: 'REJECTED',
          notes: 'Account access suspended by Directorate Administrator.'
        });
        setStep('USER_STATUS_REJECTED');
      } else {
        setStatusFeedbackUser({
          name: matchingUser.name,
          email: matchingUser.email,
          contact: matchingUser.primaryContact,
          mine: matchingUser.assignedMineName,
          status: 'PENDING',
          notes: 'Account verification pending Directorate review.'
        });
        setStep('USER_STATUS_PENDING');
      }
    } else {
      // New user registering -> Automatically register as PENDING request
      submitAccessRequest({
        fullName: userName,
        contactNumber: userContact,
        email: userEmail,
        designation: userDesignation || 'Field Operative',
        requestedMine: userMine || 'Rajmahal Open Cast Project'
      });

      setStatusFeedbackUser({
        name: userName,
        email: userEmail,
        contact: userContact,
        mine: userMine || 'Rajmahal Open Cast Project',
        status: 'PENDING',
        notes: 'Your access request has been submitted to the Directorate Administrator for verification.'
      });
      setStep('USER_STATUS_PENDING');
    }
  };

  const handleAdminSubmitInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminName.trim() || !adminContact.trim() || !adminEmail.trim()) {
      alert('Please fill out all administrative credentials.');
      return;
    }
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
    setOtpError('');
    setStep('ADMIN_OTP');
  };

  const handleAdminVerifyOtp = async () => {
    const fullOtp = otpDigits.join('');
    const res = await MineXAuthService.verifyOtp(fullOtp);
    if (!res.success) {
      setOtpError(res.error || 'Invalid OTP');
      return;
    }
    setKeyError('');
    setStep('ADMIN_KEY');
  };

  const handleAdminVerifyKey = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setKeyError('');

    const res = await MineXAuthService.verifyAdminAccessKey(adminKey);
    setIsSubmitting(false);

    if (res.success) {
      loginWithAdmin();
    } else {
      setKeyError(res.error || 'Invalid Administrator Access Key.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF9F6] text-[#1F2937] font-sans antialiased">
      {/* Top Directorate Header Bar */}
      <header className="border-b border-[#E2DCD0] bg-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/minex-logo.jpg" 
            alt="MineX Logo" 
            className="w-9 h-9 rounded-md object-contain border border-[#E2DCD0] bg-black shrink-0 shadow-2xs"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-wider text-[#102A43]">MINEX</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#F5F1EB] text-[#64748B] border border-[#E2DCD0]">
                Enterprise Digital Platform
              </span>
            </div>
            <div className="text-[11px] text-[#64748B]">
              Ministry of Coal • Central Mine Planning & Design Institute
            </div>
          </div>
        </div>

        {/* Bilingual Switcher */}
        <div className="flex items-center gap-2">
          <Globe className="w-3.5 h-3.5 text-[#64748B]" />
          <div className="flex items-center bg-[#FAF9F6] border border-[#E2DCD0] rounded-md overflow-hidden text-xs">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 transition-colors font-medium ${
                currentLang === 'en' ? 'bg-[#102A43] text-white' : 'text-[#64748B] hover:text-[#102A43]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-2.5 py-1 transition-colors font-medium ${
                currentLang === 'hi' ? 'bg-[#102A43] text-white' : 'text-[#64748B] hover:text-[#102A43]'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:py-16">
        {/* ========================================================================= */}
        {/* STEP 1: INITIAL WELCOME / ROLE SELECTION SCREEN */}
        {/* ========================================================================= */}
        {step === 'WELCOME' && (
          <div className="w-full max-w-2xl bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-8 sm:p-12 text-center">
            {/* Brand Logo */}
            <div className="flex justify-center mb-5">
              <img 
                src="/minex-logo.jpg" 
                alt="MineX Logo" 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-contain border border-[#E2DCD0] bg-black shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#102A43] tracking-tight">
              MineX
            </h1>
            <p className="mt-1 text-sm font-semibold tracking-wide text-[#B45309] uppercase">
              Mining Intelligence • Data • Insights
            </p>

            {/* Platform Description */}
            <p className="mt-4 text-sm sm:text-base text-[#475569] leading-relaxed max-w-xl mx-auto">
              An AI-assisted platform for mining documents, operations, workforce information and data-driven insights.
            </p>

            {/* Two Large, Clean Options */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              {/* Option 1: Continue as User */}
              <div className="p-6 rounded-lg border border-[#E2DCD0] bg-[#FAF9F6] hover:bg-[#F5F1EB] hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-white border border-[#E2DCD0] flex items-center justify-center text-[#B45309]">
                      <HardHat className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#64748B]">
                      Field Operative
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102A43]">
                    CONTINUE AS USER
                  </h3>
                  <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                    Access assignments, mine information, documents and Mine Assist.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('USER_INPUT')}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors shadow-2xs"
                >
                  <span>Continue as User</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Option 2: Continue as Admin */}
              <div className="p-6 rounded-lg border border-[#E2DCD0] bg-[#FAF9F6] hover:bg-[#F5F1EB] hover:border-[#CBD5E1] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-[#102A43] text-amber-400 flex items-center justify-center">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-wider text-[#64748B]">
                      Directorate Admin
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#102A43]">
                    CONTINUE AS ADMIN
                  </h3>
                  <p className="mt-2 text-xs text-[#64748B] leading-relaxed">
                    Manage mines, workers, documents, users, data and analytics.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setStep('ADMIN_INPUT')}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#1F2937] hover:bg-[#111827] text-white text-sm font-semibold transition-colors shadow-2xs"
                >
                  <span>Continue as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Footer Trust Marker */}
            <div className="mt-8 pt-6 border-t border-[#E2DCD0] flex items-center justify-center gap-6 text-xs text-[#64748B]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-[#B45309]" />
                Role-Gated Access
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Official Data Provenance
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2A: USER LOGIN / ACCESS REQUEST INPUT */}
        {/* ========================================================================= */}
        {step === 'USER_INPUT' && (
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8">
            <button
              onClick={() => setStep('WELCOME')}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#102A43] mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#F5F1EB] border border-[#E2DCD0] flex items-center justify-center text-[#B45309]">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">User Login / Access</h2>
                <p className="text-xs text-[#64748B]">Field Operative Authentication Portal</p>
              </div>
            </div>

            {/* Quick Demo Selector */}
            <div className="mb-5 p-3 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0]">
              <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">
                Quick Demo Profile Presets:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => applyDemoUser('approved')}
                  className={`px-2.5 py-1.5 rounded border text-left transition-colors ${
                    userName === 'Rameshwar Soren' 
                      ? 'bg-[#102A43] text-white border-[#102A43] font-semibold' 
                      : 'bg-white text-[#1F2937] border-[#CBD5E1] hover:bg-[#F5F1EB]'
                  }`}
                >
                  <div className="truncate font-semibold">Rameshwar Soren</div>
                  <div className="text-[10px] text-emerald-500 font-medium">Approved Worker</div>
                </button>

                <button
                  type="button"
                  onClick={() => applyDemoUser('pending')}
                  className={`px-2.5 py-1.5 rounded border text-left transition-colors ${
                    userName === 'Priya Sharma' 
                      ? 'bg-[#102A43] text-white border-[#102A43] font-semibold' 
                      : 'bg-white text-[#1F2937] border-[#CBD5E1] hover:bg-[#F5F1EB]'
                  }`}
                >
                  <div className="truncate font-semibold">Priya Sharma</div>
                  <div className="text-[10px] text-amber-500 font-medium">Pending Request</div>
                </button>

                <button
                  type="button"
                  onClick={() => applyDemoUser('rejected')}
                  className={`px-2.5 py-1.5 rounded border text-left transition-colors ${
                    userName === 'Vikramaditya Singh' 
                      ? 'bg-[#102A43] text-white border-[#102A43] font-semibold' 
                      : 'bg-white text-[#1F2937] border-[#CBD5E1] hover:bg-[#F5F1EB]'
                  }`}
                >
                  <div className="truncate font-semibold">Vikramaditya</div>
                  <div className="text-[10px] text-red-500 font-medium">Rejected Request</div>
                </button>
              </div>
            </div>

            <form onSubmit={handleUserSubmitInput} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your full registered name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={userContact}
                    onChange={(e) => setUserContact(e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="name@ecl.coalindia.in or personal email"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors mt-6 shadow-2xs cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep('ADMIN_INPUT')}
                className="text-xs text-[#64748B] hover:text-[#102A43] underline transition-colors"
              >
                Need Administrator access instead? Switch to Admin Login
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2B: USER OTP VERIFICATION */}
        {/* ========================================================================= */}
        {step === 'USER_OTP' && (
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#F5F1EB] border border-[#E2DCD0] flex items-center justify-center text-[#B45309] mx-auto mb-4">
              <Phone className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#102A43]">Verify your contact</h2>
            <p className="text-xs text-[#64748B] mt-1">
              A 6-digit verification code has been dispatched to:
            </p>
            <div className="mt-1 text-sm font-semibold text-[#102A43]">
              {MineXAuthService.maskContact(userContact)}
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2.5 my-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newDigits = [...otpDigits];
                    newDigits[idx] = val.slice(-1);
                    setOtpDigits(newDigits);
                    if (val && idx < 5) {
                      document.getElementById(`otp-${idx + 1}`)?.focus();
                    }
                  }}
                  className="w-11 h-12 text-center text-lg font-bold border border-[#CBD5E1] rounded-md bg-white text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-600 mb-4 font-medium">{otpError}</p>
            )}

            {/* Prototype Simulation Note */}
            <div className="p-3 bg-[#FAF9F6] rounded-md border border-[#E2DCD0] text-left text-[11px] text-[#64748B] mb-6 leading-relaxed">
              <span className="font-semibold text-[#102A43]">Demonstration Authentication:</span> Simulated OTP provider. Enter any 6-digit OTP (e.g. 123456) to verify.
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleUserVerifyOtp}
                className="w-full py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Verify OTP
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => alert('Simulated code re-sent to: ' + userContact)}
                  className="text-[#B45309] hover:underline font-medium inline-flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resend OTP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('USER_INPUT')}
                  className="text-[#64748B] hover:text-[#102A43] underline"
                >
                  Change contact details
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2C: USER ACCESS APPROVAL WORKFLOW STATUS (PENDING) */}
        {/* ========================================================================= */}
        {step === 'USER_STATUS_PENDING' && (
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto mb-4">
              <Clock className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-[#102A43]">
              Access Request Under Review
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed max-w-md mx-auto">
              Your access request has been submitted to the Directorate Administrator for verification.
            </p>

            <div className="my-6 p-4 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0] text-left text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-[#E2DCD0] pb-2">
                <span className="text-[#64748B]">Verification Status</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                  Status: Pending Approval
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Applicant Name:</span>
                <span className="font-semibold text-[#102A43]">{statusFeedbackUser?.name || userName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Registered Contact:</span>
                <span className="font-semibold text-[#102A43]">{statusFeedbackUser?.contact || userContact}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Registered Email:</span>
                <span className="font-semibold text-[#102A43]">{statusFeedbackUser?.email || userEmail}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B]">Requested Colliery / Mine:</span>
                <span className="font-semibold text-[#102A43]">{statusFeedbackUser?.mine || userMine}</span>
              </div>
            </div>

            <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
              In an enterprise mining organization, workers cannot simply sign up and immediately see operational data. An Administrator must cross-reference your DGMS Competency and subsidiary muster rolls.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep('WELCOME')}
                className="flex-1 py-2.5 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-xs font-semibold transition-colors"
              >
                Return to Entry Screen
              </button>

              <button
                type="button"
                onClick={() => {
                  // Instant switch to admin to let the user approve this request
                  setStep('ADMIN_INPUT');
                }}
                className="flex-1 py-2.5 px-4 rounded-md bg-[#FAF9F6] border border-[#CBD5E1] text-[#102A43] hover:bg-[#F5F1EB] text-xs font-semibold transition-colors"
              >
                Switch to Admin to Approve
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2D: USER ACCESS APPROVAL WORKFLOW STATUS (REJECTED) */}
        {/* ========================================================================= */}
        {step === 'USER_STATUS_REJECTED' && (
          <div className="w-full max-w-lg bg-white rounded-xl border border-red-200 shadow-sm p-6 sm:p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center text-red-600 mx-auto mb-4">
              <XCircle className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-bold text-red-950">
              Access Denied
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed max-w-md mx-auto">
              Your registration request was rejected by the Directorate Administrator.
            </p>

            {statusFeedbackUser?.notes && (
              <div className="my-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-left text-xs text-red-900 leading-relaxed">
                <span className="font-bold">Rejection Note:</span> {statusFeedbackUser.notes}
              </div>
            )}

            <p className="text-xs text-[#64748B] mb-6 leading-relaxed">
              If this is an error, please present your DGMS Competency Certificate and identity verification to your colliery safety officer or regional CMPDI administration office.
            </p>

            <button
              type="button"
              onClick={() => setStep('WELCOME')}
              className="w-full py-2.5 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-xs font-semibold transition-colors"
            >
              Return to Entry Screen
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3A: ADMIN LOGIN INPUT */}
        {/* ========================================================================= */}
        {step === 'ADMIN_INPUT' && (
          <div className="w-full max-w-lg bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8">
            <button
              onClick={() => setStep('WELCOME')}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-[#64748B] hover:text-[#102A43] mb-4 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Role Selection</span>
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-[#102A43] text-amber-400 flex items-center justify-center shadow-xs">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#102A43]">Administrator Login</h2>
                <p className="text-xs text-[#64748B]">Directorate & Management Access Portal</p>
              </div>
            </div>

            {/* Admin Preset Banner */}
            <div className="mb-5 p-3 rounded-lg bg-[#FAF9F6] border border-[#E2DCD0] flex items-center justify-between text-xs">
              <div>
                <div className="font-semibold text-[#102A43]">Dr. Arvind Sharma (Chief GM)</div>
                <div className="text-[11px] text-[#64748B]">Central Mine Planning & Design Institute (HQ)</div>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                Authorized Admin
              </span>
            </div>

            <form onSubmit={handleAdminSubmitInput} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    placeholder="Enter official full name"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Contact Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={adminContact}
                    onChange={(e) => setAdminContact(e.target.value)}
                    placeholder="+91 94317 88400"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Official Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="arvind.sharma@cmpdi.gov.in"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors mt-6 shadow-2xs cursor-pointer"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setStep('USER_INPUT')}
                className="text-xs text-[#64748B] hover:text-[#102A43] underline transition-colors"
              >
                Looking for Field Worker portal? Switch to User Login
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3B: ADMIN OTP VERIFICATION */}
        {/* ========================================================================= */}
        {step === 'ADMIN_OTP' && (
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#102A43] text-amber-400 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#102A43]">Administrator OTP Verification</h2>
            <p className="text-xs text-[#64748B] mt-1">
              A 6-digit authentication code has been dispatched to:
            </p>
            <div className="mt-1 text-sm font-semibold text-[#102A43]">
              {MineXAuthService.maskContact(adminContact)}
            </div>

            {/* OTP Input Boxes */}
            <div className="flex justify-center gap-2.5 my-6">
              {otpDigits.map((digit, idx) => (
                <input
                  key={idx}
                  id={`admin-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const val = e.target.value;
                    const newDigits = [...otpDigits];
                    newDigits[idx] = val.slice(-1);
                    setOtpDigits(newDigits);
                    if (val && idx < 5) {
                      document.getElementById(`admin-otp-${idx + 1}`)?.focus();
                    }
                  }}
                  className="w-11 h-12 text-center text-lg font-bold border border-[#CBD5E1] rounded-md bg-white text-[#102A43] focus:outline-none focus:ring-2 focus:ring-[#102A43]"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-xs text-red-600 mb-4 font-medium">{otpError}</p>
            )}

            <div className="p-3 bg-[#FAF9F6] rounded-md border border-[#E2DCD0] text-left text-[11px] text-[#64748B] mb-6 leading-relaxed">
              <span className="font-semibold text-[#102A43]">Demonstration Authentication:</span> Simulated OTP provider. Enter any 6-digit code (e.g. 123456) to proceed.
            </div>

            <button
              type="button"
              onClick={handleAdminVerifyOtp}
              className="w-full py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors shadow-2xs cursor-pointer"
            >
              Verify OTP & Proceed
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3C: ADMIN ACCESS KEY (KEY: XYZW) */}
        {/* ========================================================================= */}
        {step === 'ADMIN_KEY' && (
          <div className="w-full max-w-md bg-white rounded-xl border border-[#E2DCD0] shadow-sm p-6 sm:p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#E2DCD0] flex items-center justify-center text-[#B45309] mx-auto mb-4">
              <KeyRound className="w-6 h-6" />
            </div>

            <h2 className="text-xl font-bold text-[#102A43]">Admin Access Key</h2>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Enter your designated Directorate Administrative Key to verify high-level clearance.
            </p>

            <form onSubmit={handleAdminVerifyKey} className="my-6 space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-[#102A43] mb-1">
                  Admin Access Key [ ******** ]
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-[#94A3B8] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter key (Prototype key: XYZW)"
                    className="w-full pl-9 pr-3 py-2.5 rounded-md border border-[#CBD5E1] bg-white text-sm tracking-widest font-mono focus:outline-none focus:ring-2 focus:ring-[#102A43] text-[#102A43]"
                  />
                </div>
              </div>

              {keyError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-700 text-left font-medium">
                  {keyError}
                </div>
              )}

              {/* Explicit Demo Disclaimer as mandated */}
              <div className="p-3.5 bg-[#FAF9F6] rounded-md border border-[#E2DCD0] text-left text-xs text-[#475569] space-y-1">
                <div className="font-bold text-[#B45309] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>DEMONSTRATION ACCESS KEY: XYZW</span>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  (In production, administrative access is gated by Directorate PKI / Hardware Security Token / Official SSO).
                </p>
                <button
                  type="button"
                  onClick={() => setAdminKey('XYZW')}
                  className="mt-1 text-[11px] font-semibold text-[#102A43] hover:underline"
                >
                  Click here to auto-fill prototype key "XYZW"
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-md bg-[#102A43] hover:bg-[#1B365D] text-white text-sm font-semibold transition-colors shadow-2xs cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Authorize & Open Admin Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <button
              type="button"
              onClick={() => setStep('WELCOME')}
              className="text-xs text-[#64748B] hover:text-[#102A43] underline transition-colors"
            >
              Cancel and return to Welcome
            </button>
          </div>
        )}
      </main>

      {/* Official Footnote */}
      <footer className="border-t border-[#E2DCD0] bg-white px-6 py-4 text-center text-xs text-[#64748B]">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
          <span>© 2025-2026 MineX Digital Mining Platform</span>
          <span>•</span>
          <span>Central Mine Planning & Design Institute (CMPDI)</span>
          <span>•</span>
          <span>Ministry of Coal, Government of India</span>
        </div>
      </footer>
    </div>
  );
};
