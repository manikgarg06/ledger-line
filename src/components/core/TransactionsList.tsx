import React from 'react';
import type { Transaction } from '../../interfaces/Transaction';
import { formatNumber } from '../../utils/Utility';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface TransactionsListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onDeleteTransaction,
}) => {
  if (!transactions.length) {
    return <p className="text-center text-gray-500 py-6">No transactions yet</p>;
  }

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="space-y-3">
      {sorted.map((transaction) => (
        <Swiper key={transaction.id} slidesPerView={1} spaceBetween={10} className="transaction-swiper">
          <SwiperSlide>
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 relative group">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  {transaction.type === 'given' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                      </svg>
                    </div>
                  )}
                  {transaction.type === 'received' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                      </svg>
                    </div>
                  )}
                  {transaction.type === 'settled' && (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-300 capitalize">{transaction.type}</p>
                    <p className="text-sm text-gray-400">{transaction.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      transaction.type === 'given'
                        ? 'text-green-400'
                        : transaction.type === 'received'
                        ? 'text-red-400'
                        : 'text-blue-400'
                    }`}
                  >
                    {formatNumber(transaction.amount)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(transaction.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <button
              className="bg-red-500 rounded-lg p-4 py-[27px] h-full w-full flex items-center justify-center text-white cursor-pointer"
              onClick={() => onDeleteTransaction(transaction.id)}
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

export default TransactionsList;
