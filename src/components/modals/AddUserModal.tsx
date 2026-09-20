import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({ isOpen, onClose }) => {
  const { addUser, mines, t } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('Mining Safety Inspector');
  const [department, setDepartment] = useState('Safety & Compliance');
  const [assignedMine, setAssignedMine] = useState('Rajmahal Open Cast Project');
  const [role, setRole] = useState<'USER' | 'ADMIN'>('USER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addUser({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@minex.gov.in`,
      primaryContact: phone || '+91 94310 00000',
      designation,
      department,
      assignedMineName: assignedMine,
      role
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.addUser}
      subtitle="Provision access credentials for field personnel, safety auditors, or administrators"
      maxWidth="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:bg-[#F5F1EB] border border-[#E2DCD0]"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A]"
          >
            Provision User
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3 text-xs">
        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Alok Ranjan Tiwary"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Official Email</label>
            <input
              type="email"
              placeholder="name@cmpdi.gov.in"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Contact Phone</label>
            <input
              type="tel"
              placeholder="+91 94311 00000"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={e => setDesignation(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Portal Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value as any)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            >
              <option value="USER">User / Field Worker</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Department</label>
          <input
            type="text"
            value={department}
            onChange={e => setDepartment(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Primary Mine Allocation</label>
          <select
            value={assignedMine}
            onChange={e => setAssignedMine(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          >
            {mines.map(m => (
              <option key={m.id} value={m.name}>{m.name}</option>
            ))}
          </select>
        </div>
      </form>
    </Modal>
  );
};
