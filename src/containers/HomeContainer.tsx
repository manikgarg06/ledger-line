import React from 'react';
import type { Person } from '../interfaces/Person';
import { BalanceSummaryCard, PeopleList } from '../components/core';

export interface HomeContainerProps {
  people: Person[];
  totalBalance: number;
  onPersonClick: (p: Person) => void;
  onDeletePerson: (personId: number) => void;
}

const HomeContainer: React.FC<HomeContainerProps> = ({
  people,
  totalBalance,
  onPersonClick,
  onDeletePerson,
}) => {
  return (
    <>
      <BalanceSummaryCard total={totalBalance} />

      <h2 className="text-lg font-semibold text-gray-300 mb-3">People</h2>
      <PeopleList
        people={people}
        onPersonClick={onPersonClick}
        onDeletePerson={onDeletePerson}
      />
    </>
  );
};

export default HomeContainer;
