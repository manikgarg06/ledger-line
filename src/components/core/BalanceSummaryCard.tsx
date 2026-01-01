import React from 'react';
import { formatNumber } from '../../utils/Utility';

export interface BalanceSummaryCardProps {
  total: number;
  type?: 'finance' | 'fd';
}

const BalanceSummaryCard: React.FC<BalanceSummaryCardProps> = ({ total, type = "finance" }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-5 mb-6 shadow-lg border border-gray-700">
      <p className="text-sm text-gray-400 mb-1">Total Balance</p>
      <p className={`text-3xl font-bold ${total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {formatNumber(total)}
      </p>
      {type == 'finance' && <p className="text-sm text-gray-400 mt-1">
        {total >= 0 ? 'People owe you' : 'You owe people'}
      </p>}
    </div>
  );
};

export default BalanceSummaryCard;
