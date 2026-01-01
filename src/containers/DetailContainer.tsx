import React from 'react';
import type { Person } from '../interfaces/Person';
import type { Transaction } from '../interfaces/Transaction';
import { PersonBalanceCard, QuickActions, TransactionsList } from '../components/core';

export interface DetailContainerProps {
  person: Person;
  transactions: Transaction[];
  onQuickAction: (type: 'given' | 'received' | 'settled') => void;
  onDeleteTransaction: (transactionId: number) => void;
}

const DetailContainer: React.FC<DetailContainerProps> = ({
  person,
  transactions,
  onQuickAction,
  onDeleteTransaction,
}) => {
  return (
    <>
      <PersonBalanceCard person={person} />
      <QuickActions onQuickAction={onQuickAction} />
      <h2 className="text-lg font-semibold text-gray-300 mb-3">Transaction History</h2>
      <TransactionsList
        transactions={transactions}
        onDeleteTransaction={onDeleteTransaction}
      />
    </>
  );
};

export default DetailContainer;
