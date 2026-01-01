import React from 'react';
import { CURRENCY } from '../../constants';

export interface AddTransactionModalProps {
  isOpen: boolean;
  type: 'given' | 'received' | 'settled';
  amount: string;
  note: string;
  date: string;
  setType: (t: 'given' | 'received' | 'settled') => void;
  setAmount: (v: string) => void;
  setNote: (v: string) => void;
  setDate: (v: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  type,
  amount,
  note,
  date,
  setType,
  setAmount,
  setNote,
  setDate,
  onCancel,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-11/12 max-w-md p-5 shadow-xl border border-gray-700 animate-slideUp">
        <h2 className="text-xl font-semibold text-gray-300 mb-4">Add Transaction</h2>
        {/* Transaction Type */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Transaction Type</label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setType('given')}
              className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${
                type === 'given'
                  ? 'bg-gray-700 text-green-400 border border-green-500'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              } !rounded-button`}
            >
              <i className="fas fa-arrow-up mr-2"></i>
              Given
            </button>
            <button
              onClick={() => setType('received')}
              className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${
                type === 'received'
                  ? 'bg-gray-700 text-red-400 border border-red-500'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              } !rounded-button`}
            >
              <i className="fas fa-arrow-down mr-2"></i>
              Received
            </button>
            <button
              onClick={() => setType('settled')}
              className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${
                type === 'settled'
                  ? 'bg-gray-700 text-blue-400 border border-blue-500'
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              } !rounded-button`}
            >
              <i className="fas fa-check-circle mr-2"></i>
              Settled
            </button>
          </div>
        </div>
        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Amount</label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500">{CURRENCY}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*\.?\d*$/.test(value) || value === '') {
                  setAmount(value);
                }
              }}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
              placeholder="0.00"
            />
          </div>
        </div>
        {/* Date */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
          />
        </div>
        {/* Note */}
        <div className="mb-4">
          <label className="block text-sm text-gray-400 mb-2">Note (Optional)</label>
          <textarea
            value={note}
            maxLength={50}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600 resize-none"
            placeholder="Add a note"
            rows={2}
          ></textarea>
          <div className="text-xs text-gray-600 text-right">max 50 chars.</div>
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
            Save Transaction
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
