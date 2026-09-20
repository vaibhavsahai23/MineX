import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';

interface AddMineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMineModal: React.FC<AddMineModalProps> = ({ isOpen, onClose }) => {
  const { addMine, t } = useApp();

  const [name, setName] = useState('');
  const [mineCode, setMineCode] = useState('');
  const [mineType, setMineType] = useState<'Open Cast' | 'Underground' | 'Mixed Surface & Deep Seam'>('Open Cast');
  const [state, setState] = useState('Jharkhand');
  const [district, setDistrict] = useState('Dhanbad');
  const [dailyTarget, setDailyTarget] = useState('35000');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addMine({
      name,
      mineCode: mineCode || `M-${Math.floor(100 + Math.random() * 900)}`,
      mineType,
      state,
      district,
      location: `${district} Coalfield Basin`,
      dailyProductionTarget: parseInt(dailyTarget, 10) || 30000,
      currentProduction: Math.round((parseInt(dailyTarget, 10) || 30000) * 0.96),
      description: description || 'Registered under digital operational framework for monitoring.'
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t.addMine}
      subtitle="Register new operational coal block or colliery into the MineX master catalog"
      maxWidth="lg"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-md text-xs font-medium text-[#64748B] hover:bg-[#F5F1EB] border border-[#E2DCD0]"
          >
            {t.cancel}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 rounded-md text-xs font-medium bg-[#102A43] text-white hover:bg-[#1E3A8A]"
          >
            {t.confirm} & Register
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Mine Official Name</label>
          <input
            type="text"
            required
            placeholder="e.g. North Karanpura Super Pit"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Mine Identification Code</label>
            <input
              type="text"
              placeholder="e.g. NKRN-OCP-2"
              value={mineCode}
              onChange={e => setMineCode(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">Mine Classification</label>
            <select
              value={mineType}
              onChange={e => setMineType(e.target.value as any)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            >
              <option value="Open Cast">Open Cast (Surface)</option>
              <option value="Underground">Underground Colliery</option>
              <option value="Mixed Surface & Deep Seam">Mixed Surface & Deep Seam</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
          <div>
            <label className="block font-semibold text-[#102A43] mb-1">District / Coal Basin</label>
            <input
              type="text"
              value={district}
              onChange={e => setDistrict(e.target.value)}
              className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Daily Production Target (MT)</label>
          <input
            type="number"
            value={dailyTarget}
            onChange={e => setDailyTarget(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          />
        </div>

        <div>
          <label className="block font-semibold text-[#102A43] mb-1">Operational Summary</label>
          <textarea
            rows={2}
            placeholder="Geological seam particulars, infrastructure links, thermal power allocation..."
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full p-2 rounded border border-[#CBD5E1] bg-white text-xs focus:outline-none focus:border-[#102A43]"
          />
        </div>
      </form>
    </Modal>
  );
};
