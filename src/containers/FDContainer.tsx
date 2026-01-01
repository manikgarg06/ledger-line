import React from 'react';
import type { FD } from '../interfaces/FD';
import type { Person } from '../interfaces/Person';
import { BalanceSummaryCard, PeopleList } from '../components/core';
import { computeCurrentFDAmount } from '../utils/Utility';

export interface FDContainerProps {
  people: Person[];
  fds: FD[];
  onPersonClick: (p: Person) => void;
  onDeletePerson: (personId: number) => void;
}

const FDContainer: React.FC<FDContainerProps> = ({ people, fds, onPersonClick, onDeletePerson }) => {
  const today = new Date().toISOString().split('T')[0];
  const activeFDs = fds.filter((fd) => fd.isActive);
  const totalFD = activeFDs.reduce(
    (sum, fd) =>
      sum + computeCurrentFDAmount(fd.amount, fd.interestRate, fd.startDate, fd.tenureMonths, today),
    0
  );
  const fdTotals = people.reduce<Record<number, number>>((acc, p) => {
    const list = activeFDs.filter((fd) => fd.personId === p.id);
    const sum = list.reduce(
      (s, fd) => s + computeCurrentFDAmount(fd.amount, fd.interestRate, fd.startDate, fd.tenureMonths, today),
      0
    );
    acc[p.id] = sum;
    return acc;
  }, {});

  return (
    <>
      <BalanceSummaryCard total={totalFD} type="fd" />

      <h2 className="text-lg font-semibold text-gray-300 mb-3">People</h2>
      <PeopleList
        people={people}
        type="fd"
        fdTotals={fdTotals}
        onPersonClick={onPersonClick}
        onDeletePerson={onDeletePerson}
      />
    </>
  );
};

export default FDContainer;
