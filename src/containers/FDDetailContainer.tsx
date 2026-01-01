import React, { useState, useEffect } from 'react';
import type { FD } from '../interfaces/FD';
import type { Person } from '../interfaces/Person';
import { CURRENCY } from '../constants';
import { computeFDInterest, computeCurrentFDAmount, formatNumber } from '../utils/Utility';

export interface FDDetailContainerProps {
  person: Person;
  fds: FD[];
  onEditFD: (fd: FD) => void;
  onCloseFD: (fdId: number) => void;
}

const StatusPill: React.FC<{ active: boolean }> = ({ active }) => (
  <span
    className={`text-[10px] px-2 py-1 rounded-full border ${
      active
        ? 'bg-green-900/30 text-green-300 border-green-600'
        : 'bg-gray-800 text-gray-400 border-gray-600'
    }`}
  >
    {active ? 'Active' : 'Inactive'}
  </span>
);

const DetailRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex justify-between text-sm py-1">
    <span className="text-gray-400">{label}</span>
    <span className="text-gray-300">{value}</span>
  </div>
);

const FDDetailsCard: React.FC<{
  fd: FD;
  person?: Person;
  onEdit: (fd: FD) => void;
  onClose: (id: number) => void;
}> = ({ fd, onEdit, onClose }) => {
  const { interest, maturityAmount } = computeFDInterest(fd.amount, fd.interestRate, fd.tenureMonths);
  const currentAmount = computeCurrentFDAmount(fd.amount, fd.interestRate, fd.startDate, fd.tenureMonths);

  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 shadow-md border border-gray-700 mt-4">
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-200 truncate">
              {fd.fdName || fd.bank}
            </h3>
            <StatusPill active={fd.isActive} />
          </div>
          <div className="text-xs text-gray-400 mt-1 truncate">
            {fd.bank} • Ref: {fd.referenceNo || '-'}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Principal</div>
          <div className="text-lg font-semibold text-gray-200">{formatNumber(fd.amount)}</div>
          <div className="text-xs text-gray-400 mt-1">Current</div>
          <div className="text-md font-semibold text-gray-200">{formatNumber(currentAmount)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <DetailRow label="Nominee" value={fd.nomineeName || 'N/A'} />
        <DetailRow label="Interest Rate" value={fd.interestRate ? `${fd.interestRate}%` : 'N/A'} />
        <DetailRow label="Tenure" value={fd.tenureMonths ? `${fd.tenureMonths} months` : 'N/A'} />
        <DetailRow label="Start Date" value={fd.startDate || 'N/A'} />
        <DetailRow label="End Date" value={fd.tentativeEndDate || 'N/A'} />
      </div>

      <div className="mt-3 p-3 bg-gray-900 border border-gray-700 rounded-lg">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Estimated Interest</span>
          <span className="text-green-400">{formatNumber(interest)}</span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-400">Tentative Maturity</span>
          <span className="text-gray-300">{CURRENCY} {maturityAmount.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <button
          onClick={() => onEdit(fd)}
          disabled={!fd.isActive}
          className={`px-4 py-2 rounded-lg !rounded-button ${!fd.isActive ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'}`}
        >
          Edit
        </button>
        {fd.isActive && (
          <button
            onClick={() => onClose(fd.id)}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-gray-200 rounded-lg cursor-pointer !rounded-button"
          >
            Close FD
          </button>
        )}
      </div>
    </div>
  );
};

const FDDetailContainer: React.FC<FDDetailContainerProps> = ({ person, fds, onEditFD, onCloseFD }) => {
  const [selectedFD, setSelectedFD] = useState<FD | null>(null);

  // Keep selected FD in sync after edits (or any fds update)
  useEffect(() => {
    if (!selectedFD) return;
    const updated = fds.find((x) => x.id === selectedFD.id) || null;
    setSelectedFD(updated);
  }, [fds]);

  return (
    <>
      <h2 className="text-lg font-semibold text-gray-300 mb-3">{person.name}'s Fixed Deposits</h2>

      <div className="space-y-3">
        {[...fds].sort((a, b) => (a.startDate < b.startDate ? 1 : -1)).map((fd) => (
          <div key={fd.id}>
            <div
              onClick={() =>
                setSelectedFD((prev) => (prev && prev.id === fd.id ? null : fd))
              }
              className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-all duration-200"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-300 truncate">{fd.fdName || fd.bank}</p>
                  <StatusPill active={fd.isActive} />
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {fd.bank} • Ref: {fd.referenceNo || '-'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {fd.startDate} → {fd.tentativeEndDate}
                </p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-300">{formatNumber(fd.amount)}</p>
                <p className="text-xs text-gray-400">{fd.interestRate}% • {fd.tenureMonths} mo</p>
              </div>
            </div>

            {selectedFD && selectedFD.id === fd.id && (
              <FDDetailsCard
                fd={selectedFD}
                onEdit={onEditFD}
                onClose={(id) => {
                  onCloseFD(id);
                  setSelectedFD(null);
                }}
              />
            )}
          </div>
        ))}
      </div>

    </>
  );
};

export default FDDetailContainer;
