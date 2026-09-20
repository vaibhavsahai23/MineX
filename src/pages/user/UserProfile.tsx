import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Award, 
  HardHat, 
  Check, 
  Globe, 
  Save, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const UserProfile: React.FC = () => {
  const { currentUser, updateWorkerProfile, currentLang, setLanguage, t } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [contactNumber, setContactNumber] = useState(currentUser.primaryContact);
  const [altContact, setAltContact] = useState(currentUser.altContact);
  const [email, setEmail] = useState(currentUser.email);
  const [emergencyName, setEmergencyName] = useState(currentUser.emergencyContact.name);
  const [emergencyPhone, setEmergencyPhone] = useState(currentUser.emergencyContact.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWorkerProfile({
      primaryContact: contactNumber,
      altContact,
      email,
      emergencyContact: {
        ...currentUser.emergencyContact,
        name: emergencyName,
        phone: emergencyPhone
      }
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              {t.navMyProfile}
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-[#102A43] tracking-tight mt-0.5">
              Personnel Service Record
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Centralized Employee Dossier • DGMS Statutory Register ID: <strong>{currentUser.employeeId}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 rounded-md bg-[#102A43] text-white text-xs font-semibold hover:bg-[#1E3A8A] transition-colors"
              >
                {t.edit} Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="px-3.5 py-2 rounded-md bg-[#FAF9F6] text-[#64748B] text-xs font-semibold hover:bg-[#F5F1EB] border border-[#E2DCD0]"
              >
                {t.cancel}
              </button>
            )}
          </div>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Contact details and emergency dispatch numbers successfully synchronized.</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Photo & Key Metrics */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs text-center">
            <div className="relative inline-block mx-auto mb-3">
              <img
                src={currentUser.avatarUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#FAF9F6] shadow-xs"
              />
              <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>

            <h2 className="text-base font-bold text-[#102A43]">{currentUser.name}</h2>
            <p className="text-xs text-[#64748B]">{currentUser.designation}</p>
            <div className="mt-2">
              <StatusBadge status={currentUser.accountStatus} size="sm" />
            </div>

            <div className="mt-5 pt-4 border-t border-[#F1EFEA] text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Employee Code:</span>
                <span className="font-mono font-semibold text-[#102A43]">{currentUser.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Joining Date:</span>
                <span className="font-medium text-[#102A43]">{currentUser.joiningDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Department:</span>
                <span className="font-medium text-[#102A43]">{currentUser.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Work Location:</span>
                <span className="font-medium text-[#102A43]">{currentUser.workLocation}</span>
              </div>
            </div>
          </div>

          {/* Language Preference Setting */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#102A43]" />
              <span>{t.navLanguage} Preference</span>
            </h3>
            <p className="text-xs text-[#64748B] mb-3">
              Select your interface language for field alerts, assignments, and Mine Assist.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`py-2 px-3 rounded-md text-xs font-medium border text-center transition-colors ${
                  currentLang === 'en'
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-[#FAF9F6] text-[#64748B] border-[#E2DCD0] hover:bg-[#F5F1EB]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`py-2 px-3 rounded-md text-xs font-medium border text-center transition-colors ${
                  currentLang === 'hi'
                    ? 'bg-[#102A43] text-white border-[#102A43]'
                    : 'bg-[#FAF9F6] text-[#64748B] border-[#E2DCD0] hover:bg-[#F5F1EB]'
                }`}
              >
                हिन्दी (Hindi)
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Contact Information & Qualifications */}
        <div className="lg:col-span-2 space-y-6">
          {/* Operational Allocation Card */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
              <span>Field Assignment Dossier</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] block text-[11px]">Primary Mine</span>
                <span className="font-semibold text-[#102A43] mt-0.5 block">{currentUser.assignedMineName}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] block text-[11px]">Operational Zone</span>
                <span className="font-semibold text-[#102A43] mt-0.5 block">{currentUser.assignedZone}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] block text-[11px]">Shift Timing</span>
                <span className="font-semibold text-[#102A43] mt-0.5 block">{currentUser.shift}</span>
              </div>
              <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                <span className="text-[#64748B] block text-[11px]">Shift Supervisor</span>
                <span className="font-semibold text-[#102A43] mt-0.5 block">{currentUser.supervisor}</span>
              </div>
            </div>
          </div>

          {/* Contact Details (Form or View) */}
          <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#F1EFEA] pb-3 mb-4">
              <h3 className="text-xs font-bold text-[#102A43] uppercase tracking-wider">
                Official Contact & Dispatch Channels
              </h3>
              {isEditing && (
                <span className="text-xs text-amber-700 font-medium">Editing Active</span>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-[#102A43] mb-1">Primary Mobile Contact</label>
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={e => setContactNumber(e.target.value)}
                      className="w-full p-2.5 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#102A43] mb-1">Alternative Contact</label>
                    <input
                      type="tel"
                      value={altContact}
                      onChange={e => setAltContact(e.target.value)}
                      className="w-full p-2.5 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#102A43] mb-1">Institutional Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
                  />
                </div>

                <div className="pt-2 border-t border-[#F1EFEA]">
                  <h4 className="font-bold text-[#102A43] mb-2">Emergency Response Contact</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#64748B] mb-1">Contact Name & Relation</label>
                      <input
                        type="text"
                        value={emergencyName}
                        onChange={e => setEmergencyName(e.target.value)}
                        className="w-full p-2.5 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
                      />
                    </div>
                    <div>
                      <label className="block text-[#64748B] mb-1">Emergency Telephone</label>
                      <input
                        type="tel"
                        value={emergencyPhone}
                        onChange={e => setEmergencyPhone(e.target.value)}
                        className="w-full p-2.5 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-[#102A43] text-white font-semibold text-xs hover:bg-[#1E3A8A] transition-colors"
                  >
                    {t.save}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                    <span className="text-[#64748B] block text-[11px]">Primary Contact</span>
                    <span className="font-mono font-semibold text-[#102A43] mt-0.5 block">{currentUser.primaryContact}</span>
                  </div>
                  <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                    <span className="text-[#64748B] block text-[11px]">Alternative Contact</span>
                    <span className="font-mono font-semibold text-[#102A43] mt-0.5 block">{currentUser.altContact}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#FAF9F6] rounded border border-[#E2DCD0]">
                  <span className="text-[#64748B] block text-[11px]">Enterprise Email</span>
                  <span className="font-semibold text-[#102A43] mt-0.5 block">{currentUser.email}</span>
                </div>

                <div className="p-3 bg-red-50/50 border border-red-200/60 rounded text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-red-950 block">Designated Emergency Dispatch Contact:</span>
                    <span className="text-red-900">{currentUser.emergencyContact.name} ({currentUser.emergencyContact.relation})</span>
                  </div>
                  <span className="font-mono font-bold text-red-950">{currentUser.emergencyContact.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Certifications & Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
              <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-blue-700" />
                <span>Statutory Mining Certifications</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-[#475569]">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>DGMS Shotfirer / Blaster Certificate #SF-4091</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>St. John Ambulance First-Aid Statutory Endorsement</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Gas Testing Competency Certificate (CMR 2017)</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Annual Medical Examination (AME) Form 'O' Clearance (Fit for Mining Operations)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border border-[#E2DCD0] rounded-lg p-5 shadow-xs">
              <h4 className="text-xs font-bold text-[#102A43] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HardHat className="w-3.5 h-3.5 text-[#B45309]" />
                <span>Operational Competencies</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {['Controlled Blasting', 'Seismic Vibration Monitoring', 'Electric Detonator Handling', 'Highwall Bench Safety', 'Pre-Split Drilling'].map((skill, idx) => (
                  <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-[#FAF9F6] border border-[#E2DCD0] text-[#334155]">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
