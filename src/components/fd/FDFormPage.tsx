import React, { useEffect, useState } from 'react';
import type { Person } from '../../interfaces/Person';
import { CURRENCY } from '../../constants';
import { addMonths } from '../../utils/Utility';

export interface FDFormPageProps {
  title?: string;

  people: Person[];
  personId: number | '';
  fdName: string;
  holderName: string;
  nomineeName: string;
  amount: string;
  startDate: string;
  interestRate: string; // percent as string
  tenureMonths: string; // months as string
  referenceNo: string;
  bank: string;
  tentativeEndDate: string; // computed

  setPersonId: (v: number | '') => void;
  setFdName: (v: string) => void;
  setHolderName: (v: string) => void;
  setNomineeName: (v: string) => void;
  setAmount: (v: string) => void;
  setStartDate: (v: string) => void;
  setInterestRate: (v: string) => void;
  setTenureMonths: (v: string) => void;
  setReferenceNo: (v: string) => void;
  setBank: (v: string) => void;
  setTentativeEndDate: (v: string) => void;

  onCancel: () => void;
  onSave: () => void;
}

const StepIndicator: React.FC<{ step: number; total: number }> = ({ step, total }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`h-2 w-8 rounded-full ${idx <= step ? 'bg-gray-300' : 'bg-gray-700'}`}
        />
      ))}
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 shadow-md border border-gray-700">
    <h3 className="text-md font-semibold text-gray-300 mb-3">{title}</h3>
    {children}
  </div>
);

const FDFormPage: React.FC<FDFormPageProps> = ({
  title = 'Add Fixed Deposit',

  people,
  personId,
  fdName,
  holderName,
  nomineeName,
  amount,
  startDate,
  interestRate,
  tenureMonths,
  referenceNo,
  bank,
  tentativeEndDate,

  setPersonId,
  setFdName,
  setHolderName,
  setNomineeName,
  setAmount,
  setStartDate,
  setInterestRate,
  setTenureMonths,
  setReferenceNo,
  setBank,
  setTentativeEndDate,

  onCancel,
  onSave,
}) => {
  const [step, setStep] = useState(0);
  const totalSteps = 3;

  // Auto-compute tentative end date when startDate or tenure changes
  useEffect(() => {
    const tenure = parseInt(tenureMonths || '0', 10);
    if (startDate && tenure > 0) {
      setTentativeEndDate(addMonths(startDate, tenure));
    } else {
      setTentativeEndDate('');
    }
  }, [startDate, tenureMonths, setTentativeEndDate]);

  const canGoNext = () => {
    if (step === 0) {
      // Basic validations
      return true; // keep light; person can be selected later, but allow progression
    }
    if (step === 1) {
      // Financial validations can be soft; final validation in Save handler in App
      return true;
    }
    return true;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-300">{title}</h2>
      <StepIndicator step={step} total={totalSteps} />

      {step === 0 && (
        <Section title="Basics">
          <div className="space-y-4">
            {/* Person */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">User (Person)</label>
              <select
                value={personId === '' ? '' : String(personId)}
                onChange={(e) => {
                  const val = e.target.value;
                  setPersonId(val ? parseInt(val, 10) : '');
                }}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
              >
                <option value="">Select Person</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FD Name */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">FD Name</label>
              <input
                type="text"
                value={fdName}
                onChange={(e) => setFdName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="e.g., Tax Saver FD"
              />
            </div>

            {/* Bank and Reference */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Associated Bank</label>
                <input
                  type="text"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                  placeholder="Bank Name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">FD Reference No.</label>
                <input
                  type="text"
                  value={referenceNo}
                  onChange={(e) => setReferenceNo(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                  placeholder="Reference Number"
                />
              </div>
            </div>
          </div>
        </Section>
      )}

      {step === 1 && (
        <Section title="Financials">
          <div className="space-y-4">
            {/* Amount and Interest */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">{CURRENCY}</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value) || value === '') setAmount(value);
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  value={interestRate}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) || value === '') setInterestRate(value);
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                  placeholder="e.g., 7.5"
                />
              </div>
            </div>

            {/* Dates and Tenure */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Tenure (Months)</label>
                <input
                  type="number"
                  value={tenureMonths}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === '') setTenureMonths(value);
                  }}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                  placeholder="e.g., 12"
                />
              </div>
            </div>

            {/* Tentative End Date */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Tentative End Date</label>
              <input
                type="text"
                readOnly
                value={tentativeEndDate}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 focus:outline-none"
                placeholder="Auto-calculated"
              />
            </div>
          </div>
        </Section>
      )}

      {step === 2 && (
        <Section title="Holder & Nominee">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name on FD</label>
              <input
                type="text"
                value={holderName}
                onChange={(e) => setHolderName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Holder Name"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Nominee</label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Nominee Name"
              />
            </div>
          </div>
        </Section>
      )}

      {/* Footer actions */}
      <div className="flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
            >
              Back
            </button>
          )}
          {step < totalSteps - 1 ? (
            <button
              disabled={!canGoNext()}
              onClick={() => setStep((s) => Math.min(totalSteps - 1, s + 1))}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer !rounded-button"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 cursor-pointer !rounded-button"
            >
              Save FD
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FDFormPage;
