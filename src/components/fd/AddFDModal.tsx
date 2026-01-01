import React, { useEffect } from 'react';
import type { Person } from '../../interfaces/Person';
import { CURRENCY } from '../../constants';
import { addMonths, addDays, computeFDInterest, formatNumber } from '../../utils/Utility';

export interface AddFDModalProps {
  isOpen: boolean;
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
  tenureType: 'years' | 'months' | 'days';
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
  setTenureType: (v: 'years' | 'months' | 'days') => void;
  setReferenceNo: (v: string) => void;
  setBank: (v: string) => void;
  setTentativeEndDate: (v: string) => void;

  onCancel: () => void;
  onSave: () => void;
}

const AddFDModal: React.FC<AddFDModalProps> = ({
  isOpen,
  title = 'Add Fixed Deposit',
  people,
  personId,
  fdName,
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
  setTenureType,
  setReferenceNo,
  setBank,
  setTentativeEndDate,
  onCancel,
  onSave,
  tenureType,
}) => {
  useEffect(() => {
    const tenure = parseInt(tenureMonths || '0', 10);
    if (startDate && tenure > 0) {
      let end = '';
      if (tenureType === 'years') end = addMonths(startDate, tenure * 12);
      else if (tenureType === 'months') end = addMonths(startDate, tenure);
      else end = addDays(startDate, tenure);
      setTentativeEndDate(end);
    } else {
      setTentativeEndDate('');
    }
  }, [startDate, tenureMonths, tenureType]);

  const tVal = parseInt(tenureMonths || '0', 10);
  const monthsCalc = tenureType === 'years' ? tVal * 12 : tenureType === 'days' ? Math.ceil(tVal / 30) : tVal;
  const amtNum = parseFloat(amount || '0');
  const rateNum = parseFloat(interestRate || '0');
  const { interest, maturityAmount } = computeFDInterest(amtNum || 0, rateNum || 0, monthsCalc || 0);

  const bankOptions = ['SBI', 'PNB', 'ICICI', 'AXIS', 'HDFC'];
  const bankInList = bankOptions.includes(bank);
  const selectedBankOption = bankInList ? bank : 'other';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-11/12 max-w-md p-5 shadow-xl border border-gray-700 animate-slideUp max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">{title}</h2>

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Basics</h3>
        {/* Person */}
        <div className="mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">User (Person)</label>
          {personId === '' ? (
            <select
              value=""
              onChange={(e) => {
                const val = e.target.value;
                const id = val ? parseInt(val, 10) : '';
                setPersonId(id);
                if (id !== '') {
                  const p = people.find((x) => x.id === id);
                  setHolderName(p?.name || '');
                } else {
                  setHolderName('');
                }
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
          ) : (
            <input
              type="text"
              readOnly
              value={people.find((p) => p.id === personId)?.name || ''}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 focus:outline-none"
            />
          )}
        </div>

        {/* FD Name */}
        <div className="mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">FD Name</label>
          <input
            type="text"
            value={fdName}
            onChange={(e) => setFdName(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
            placeholder="e.g., Tax Saver FD"
          />
        </div>

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Holder & Nominee</h3>
        <div className="grid grid-cols-1 gap-4 mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
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

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Financials</h3>
        <div className="grid grid-cols-2 gap-4 mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
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

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Dates & Tenure</h3>
        <div className="grid gap-4 mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
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
            <label className="block text-sm text-gray-400 mb-2">Tenure</label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value as 'years' | 'months' | 'days')}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
                <option value="days">Days</option>
              </select>
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
        </div>

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Maturity Preview</h3>
        <div className="mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">Tentative End Date</label>
          <input
            type="text"
            readOnly
            value={tentativeEndDate}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-gray-400 focus:outline-none"
            placeholder="Auto-calculated"
          />
          <div className="mt-3 flex justify-between text-sm">
            <span className="text-gray-400">Estimated Interest</span>
            <span className="text-green-400">{formatNumber(interest)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-gray-400">Maturity Amount</span>
            <span className="text-gray-300">{formatNumber(maturityAmount)}</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-gray-400 mb-2">Reference & Bank</h3>
        <div className="grid grid-cols-1 gap-4 mb-4 bg-gray-900 border border-gray-700 rounded-lg p-4">
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
          <div>
            <label className="block text-sm text-gray-400 mb-2">Associated Bank</label>
            <select
              value={selectedBankOption}
              onChange={(e) => {
                const v = e.target.value;
                if (v === 'other') {
                  if (bankOptions.includes(bank)) {
                    setBank('');
                  }
                } else {
                  setBank(v);
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
            >
              <option value="">Select Bank</option>
              {bankOptions.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
              <option value="other">Other...</option>
            </select>
            {selectedBankOption === 'other' && (
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Enter bank name"
              />
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 cursor-pointer !rounded-button"
          >
            Save FD
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFDModal;
