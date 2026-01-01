import React from 'react';
import type { Person } from '../../interfaces/Person';
import { formatNumber } from '../../utils/Utility';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface PeopleListProps {
  people: Person[];
  type?: 'finance' | 'fd';
  fdTotals?: Record<number, number>;
  onPersonClick: (p: Person) => void;
  onDeletePerson: (personId: number) => void;
}

const PersonItem: React.FC<{
  person: Person;
  type?: 'finance' | 'fd';
  amount?: number;
  onClick: (p: Person) => void;
}> = ({ person, type='finance', amount, onClick }) => {
  return (
    <div
      onClick={() => onClick(person)}
      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-all duration-200"
    >
      <div>
        <p className="font-medium text-gray-300">{person.name}</p>
        {type == 'finance' && <p className="text-sm text-gray-400">
          {person.balance > 0 ? 'Owes you' : person.balance < 0 ? 'You owe' : 'Settled'}
        </p>}
      </div>
      <div className="flex items-center">
        <p className={`text-lg font-semibold mr-3 ${type === 'finance' ? (( (amount ?? person.balance) > 0 ? 'text-green-400' : ((amount ?? person.balance) < 0 ? 'text-red-400' : 'text-gray-400') )) : 'text-gray-300'}`}>
          {formatNumber(amount ?? person.balance)}
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </div>
  );
};

const PeopleList: React.FC<PeopleListProps> = ({ people, onPersonClick, onDeletePerson, type = 'finance', fdTotals }) => {
  if (!people.length) {
    return <p className="text-center text-gray-500 py-6">No people added yet</p>;
  }

  return (
    <div className="space-y-3">
      {people.map((person) => (
        <Swiper key={person.id} slidesPerView={1} spaceBetween={10} className="person-swiper">
          <SwiperSlide>
            <PersonItem type={type} person={person} amount={type === 'fd' && fdTotals ? fdTotals[person.id] : undefined} onClick={onPersonClick} />
          </SwiperSlide>
          <SwiperSlide>
            <button
              className="bg-red-500 rounded-lg p-4 py-[27px] w-full h-full flex items-center justify-center text-white cursor-pointer"
              onClick={() => onDeletePerson(person.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete
            </button>
          </SwiperSlide>
        </Swiper>
      ))}
    </div>
  );
};

export default PeopleList;
