import React from 'react';
import type { FD } from '../../interfaces/FD';
import type { Person } from '../../interfaces/Person';
import { formatNumber } from '../../utils/Utility';

export interface FDListProps {
  people: Person[];
  fds: FD[];
  onSelectFD: (fd: FD) => void;
  scopedToSinglePerson?: boolean;
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

const FDItem: React.FC<{
  fd: FD;
  personName?: string;
  onClick: (fd: FD) => void;
}> = ({ fd, personName, onClick }) => {
  return (
    <div
      onClick={() => onClick(fd)}
      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-all duration-200"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-gray-300 truncate">{fd.fdName || fd.bank}</p>
          <StatusPill active={fd.isActive} />
        </div>
        <p className="text-xs text-gray-400 mt-1 truncate">
          {personName ? personName + ' • ' : ''}
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
  );
};


const FDList: React.FC<FDListProps> = ({ people, fds, onSelectFD, scopedToSinglePerson = false }) => {
  if (!fds.length) {
    return <p className="text-center text-gray-500 py-6">No FDs added yet <br /> Start investing now.</p>;
  }

  if (scopedToSinglePerson) {
    const sorted = [...fds].sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
    return (
      <div className="space-y-3">
        {sorted.map((fd) => (
          <FDItem key={fd.id} fd={fd} onClick={onSelectFD} />
        ))}
      </div>
    );
  }

  // Group by person
  const personMap = new Map<number, Person>();
  people.forEach((p) => personMap.set(p.id, p));

  const grouped = fds.reduce<Record<number, FD[]>>((acc, fd) => {
    if (!acc[fd.personId]) acc[fd.personId] = [];
    acc[fd.personId].push(fd);
    return acc;
  }, {});

  // Sort each group by startDate desc
  Object.values(grouped).forEach((arr) => {
    arr.sort((a, b) => (a.startDate < b.startDate ? 1 : -1));
  });

  const personIds = Object.keys(grouped)
    .map((x) => parseInt(x, 10))
    .sort((a, b) => {
      const pa = personMap.get(a)?.name || '';
      const pb = personMap.get(b)?.name || '';
      return pa.localeCompare(pb);
    });

  return (
    <div className="space-y-3">
      {personIds.map((pid) => {
        const person = personMap.get(pid);
        const list = grouped[pid];
        return (
          <div key={pid}>
            <div className="space-y-3">
              {list.map((fd) => (
                <FDItem
                  key={fd.id}
                  fd={fd}
                  personName={person?.name}
                  onClick={onSelectFD}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FDList;
