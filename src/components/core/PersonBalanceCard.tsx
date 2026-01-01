import React from 'react';
import type { Person } from '../../interfaces/Person';
import { formatNumber } from '../../utils/Utility';

export interface PersonBalanceCardProps {
  person: Person;
}

const PersonBalanceCard: React.FC<PersonBalanceCardProps> = ({ person }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-5 mb-6 shadow-lg border border-gray-700">
      <p className="text-sm text-gray-400 mb-1">Current Balance</p>
      <p className={`text-3xl font-bold ${person.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {formatNumber(person.balance)}
      </p>
      <p className="text-sm text-gray-400 mt-1">
        {person.balance > 0
          ? `${person.name} owes you`
          : person.balance < 0
          ? `You owe ${person.name}`
          : 'All settled up'}
      </p>
    </div>
  );
};

export default PersonBalanceCard;
