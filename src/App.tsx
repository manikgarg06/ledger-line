import React, { useState, useEffect } from 'react';
import './App.css'
import type { Person } from './interfaces/Person';
import type { Transaction } from './interfaces/Transaction';
import { CURRENCY } from './constants';
import { formatNumber } from './utils/Utility';
import { addPerson, addTransaction, deletePerson, deleteTransaction, fetchPerson, fetchTransactions } from './api';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'

const App: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'home' | 'detail'>('home');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [newTransaction, setNewTransaction] = useState<{
    type: 'given' | 'received' | 'settled';
    amount: string;
    note: string;
    date: string;
  }>({
    type: 'given',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPerson().then(lPerson => {
      if (lPerson)
        setPeople(lPerson);
    });
  }, [])

  useEffect(() => {
    fetchTransactions().then(lTransactions => {
      if (lTransactions)
        setTransactions(lTransactions);
    });
  }, [])

  useEffect(() => {
    if (selectedPerson) {
      setSelectedPerson(people.find(p => p.id === selectedPerson.id) || null);
    }
  }, [people, selectedPerson])

  const getTotalBalance = () => {
    return people.reduce((sum, person) => sum + person.balance, 0);
  };

  const getPersonTransactions = (personId: number) => {
    return transactions.filter(transaction => transaction.personId === personId);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    setActiveTab('detail');
  };

  const handleBackClick = () => {
    setActiveTab('home');
    setSelectedPerson(null);
  };

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      addPerson({
        name: newPersonName.trim(),
        balance: 0
      }).then(() => {
        fetchPerson().then(lPerson => {
          if (lPerson)
            setPeople(lPerson);
        });
        setNewPersonName('');
        setIsAddPersonModalOpen(false);
      })
    }
  };

  const handleAddTransaction = () => {
    if (selectedPerson && newTransaction.amount && parseFloat(newTransaction.amount) > 0) {
      const amount = parseFloat(newTransaction.amount);

      addTransaction({
        personId: selectedPerson.id,
        type: newTransaction.type,
        amount,
        note: newTransaction.note,
        date: newTransaction.date
      }).then(() => {
        fetchTransactions().then(lTransactions => {
          if (lTransactions)
            setTransactions(lTransactions);
        });
        fetchPerson().then(lPerson => {
          if (lPerson)
            setPeople(lPerson);

        });
        // Reset form
        setNewTransaction({
          type: 'given',
          amount: '',
          note: '',
          date: new Date().toISOString().split('T')[0],
        });
        setIsAddTransactionModalOpen(false);
      });
    }
  };

  const handleQuickAction = (type: 'given' | 'received' | 'settled') => {
    setNewTransaction({
      ...newTransaction,
      type
    });
    setIsAddTransactionModalOpen(true);
  };

  const handleDeletePerson = (personId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      deletePerson(personId).then(() => {
        fetchPerson().then(lPerson => {
          if (lPerson)
            setPeople(lPerson);
        })
      });
    }
  }

  const handleDeleteTransaction = (transactionId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this transaction?');
    if (confirmDelete) {
      deleteTransaction(transactionId).then(() => {
        fetchTransactions().then(lTransactions => {
          if (lTransactions)
            setTransactions(lTransactions);
        });
        fetchPerson().then(lPerson => {
          if (lPerson)
            setPeople(lPerson);
        });
      });
    }
  }

  return (
    <div className="bg-black min-h-screen text-gray-200 relative pb-16">
      {/* Status Bar */}
      <div className="fixed top-0 w-full z-10 bg-gradient-to-r from-gray-900 to-black border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4">
          {activeTab === 'home' ? (
            <h1 className="text-xl font-semibold text-gray-300">Finance Tracker</h1>
          ) : (
            <div className="flex items-center">
              <button
                onClick={handleBackClick}
                className="mr-3 text-gray-400 hover:text-gray-200 cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                </svg>

              </button>
              <h1 className="text-xl font-semibold text-gray-300">
                {selectedPerson?.name}
              </h1>
            </div>
          )}
        </div>
      </div>
      {/* Main Content */}
      <div className="pt-16 pb-4">
        {activeTab === 'home' && (
          <div className="container mx-auto px-4 pt-4">
            {/* Balance Summary Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-5 mb-6 shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Total Balance</p>
              <p className={`text-3xl font-bold ${getTotalBalance() >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatNumber(getTotalBalance())}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {getTotalBalance() >= 0 ? 'People owe you' : 'You owe people'}
              </p>
            </div>
            {/* People List */}
            <h2 className="text-lg font-semibold text-gray-300 mb-3">People</h2>
            <div className="space-y-3">
              {people.length > 0 ? people.map(person => (
                <Swiper
                  key={person.id}
                  slidesPerView={1}
                  spaceBetween={10}
                  className="person-swiper">
                  <SwiperSlide>
                    <div
                      key={person.id}
                      onClick={() => handlePersonClick(person)}
                      className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 flex justify-between items-center cursor-pointer hover:bg-gray-800 transition-all duration-200"
                    >
                      <div>
                        <p className="font-medium text-gray-300">{person.name}</p>
                        <p className="text-sm text-gray-400">
                          {person.balance > 0
                            ? 'Owes you'
                            : person.balance < 0
                              ? 'You owe'
                              : 'Settled'}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <p className={`text-lg font-semibold mr-3 ${person.balance > 0 ? 'text-green-400' : person.balance < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                          {formatNumber(person.balance)}
                        </p>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                    </div>
                  </SwiperSlide>
                  <SwiperSlide>
                    <button
                      className="bg-red-500 rounded-lg p-4 py-[27px] w-full h-full flex items-center justify-center text-white cursor-pointer"
                      onClick={() => handleDeletePerson(person.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                      Delete
                    </button>
                  </SwiperSlide>
                </Swiper>

              )) : <p className="text-center text-gray-500 py-6">No people added yet</p>}
            </div>
          </div>
        )}
        {activeTab === 'detail' && selectedPerson && (
          <div className="container mx-auto px-4 pt-4">
            {/* Person Balance Card */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-5 mb-6 shadow-lg border border-gray-700">
              <p className="text-sm text-gray-400 mb-1">Current Balance</p>
              <p className={`text-3xl font-bold ${selectedPerson.balance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatNumber(selectedPerson.balance)}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {selectedPerson.balance > 0
                  ? `${selectedPerson.name} owes you`
                  : selectedPerson.balance < 0
                    ? `You owe ${selectedPerson.name}`
                    : 'All settled up'}
              </p>
            </div>
            {/* Quick Action Buttons */}
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => handleQuickAction('given')}
                className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-green-400 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                </svg>
                <span>Given</span>
              </button>
              <button
                onClick={() => handleQuickAction('received')}
                className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-red-400 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                </svg>
                Received
              </button>
              <button
                onClick={() => handleQuickAction('settled')}
                className="flex flex-1 items-center justify-center bg-gray-800 hover:bg-gray-700 text-gray-300 py-3 rounded-lg shadow-md border border-gray-700 cursor-pointer !rounded-button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 text-blue-400 mr-1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Settled
              </button>
            </div>
            {/* Transactions List */}
            <h2 className="text-lg font-semibold text-gray-300 mb-3">Transaction History</h2>
            <div className="space-y-3">
              {getPersonTransactions(selectedPerson.id).length > 0 ? (
                getPersonTransactions(selectedPerson.id)
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map(transaction => (
                    <Swiper
                      key={transaction.id}
                      slidesPerView={1}
                      spaceBetween={10}
                      className="transaction-swiper">
                      <SwiperSlide>
                        <div
                          key={transaction.id}
                          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 shadow-md border border-gray-700 relative group"
                        >
                          {/* <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          
                          className="text-gray-500 hover:text-red-400 transition-colors p-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                        </button>
                      </div> */}
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
                              <p className={`font-semibold ${transaction.type === 'given'
                                ? 'text-green-400'
                                : transaction.type === 'received'
                                  ? 'text-red-400'
                                  : 'text-blue-400'
                                }`}>
                                {formatNumber(transaction.amount)}
                              </p>
                              <p className="text-xs text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <button
                          className="bg-red-500 rounded-lg p-4 py-[27px] h-full w-full flex items-center justify-center text-white cursor-pointer"
                          onClick={() => handleDeleteTransaction(transaction.id)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                          </svg>
                          Delete
                        </button>
                      </SwiperSlide>
                    </Swiper>
                  ))
              ) : (
                <p className="text-center text-gray-500 py-6">No transactions yet</p>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          onClick={() => activeTab === 'home'
            ? setIsAddPersonModalOpen(true)
            : setIsAddTransactionModalOpen(true)
          }
          className="w-14 h-14 rounded-[7px] bg-gradient-to-r from-gray-700 to-gray-800 shadow-lg flex items-center justify-center border border-gray-600 cursor-pointer !rounded-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-xl text-gray-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      {/* Tab Bar */}
      <div className="fixed bottom-0 w-full bg-gradient-to-r from-gray-900 to-black border-t border-gray-800 shadow-lg z-10">
        <div className={`grid grid-cols-2 h-16`}>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform active:scale-95 ${activeTab === 'home' ? 'text-gray-300' : 'text-gray-500'} !rounded-button`}
          >
            <div className={`'text-lg transition-colors duration-200' ${activeTab === 'home' ? 'text-gray-300' : 'text-gray-500'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
                <path fillRule="evenodd" d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z" clipRule="evenodd" />
              </svg>

            </div>
            <span className="text-xs mt-1 transition-colors duration-200">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-200 transform active:scale-95 ${activeTab === 'home' ? 'text-gray-300' : 'text-gray-500'} !rounded-button`}
          >
            <div className={`'text-lg transition-colors duration-200'`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
              </svg>
            </div>
            <span className="text-xs mt-1 transition-colors duration-200">Stats</span>
          </button>
        </div>
      </div>
      {/* Add Person Modal */}
      {isAddPersonModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-11/12 max-w-md p-5 shadow-xl border border-gray-700 animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Add New Person</h2>
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Name</label>
              <input
                type="text"
                value={newPersonName}
                onChange={(e) => setNewPersonName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
                placeholder="Enter name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddPersonModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPerson}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 cursor-pointer !rounded-button"
              >
                Add Person
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Add Transaction Modal */}
      {isAddTransactionModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-20">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg w-11/12 max-w-md p-5 shadow-xl border border-gray-700 animate-slideUp">
            <h2 className="text-xl font-semibold text-gray-300 mb-4">Add Transaction</h2>
            {/* Transaction Type */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Transaction Type</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'given' })}
                  className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${newTransaction.type === 'given'
                    ? 'bg-gray-700 text-green-400 border border-green-500'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                    } !rounded-button`}
                >
                  <i className="fas fa-arrow-up mr-2"></i>
                  Given
                </button>
                <button
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'received' })}
                  className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${newTransaction.type === 'received'
                    ? 'bg-gray-700 text-red-400 border border-red-500'
                    : 'bg-gray-800 text-gray-400 border border-gray-700'
                    } !rounded-button`}
                >
                  <i className="fas fa-arrow-down mr-2"></i>
                  Received
                </button>
                <button
                  onClick={() => setNewTransaction({ ...newTransaction, type: 'settled' })}
                  className={`py-2 rounded-lg flex items-center justify-center cursor-pointer ${newTransaction.type === 'settled'
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
                  value={newTransaction.amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*\.?\d*$/.test(value) || value === '') {
                      setNewTransaction({ ...newTransaction, amount: value });
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
                value={newTransaction.date}
                onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600"
              />
            </div>
            {/* Note */}
            <div className="mb-4">
              <label className="block text-sm text-gray-400 mb-2">Note (Optional)</label>
              <textarea
                value={newTransaction.note}
                maxLength={50}
                onChange={(e) => setNewTransaction({ ...newTransaction, note: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-gray-600 resize-none"
                placeholder="Add a note"
                rows={2}
              ></textarea>
              <div className='text-xs text-gray-600 text-right'>max 50 chars.</div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddTransactionModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 cursor-pointer !rounded-button"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-4 py-2 bg-gray-600 text-gray-200 rounded-lg hover:bg-gray-500 cursor-pointer !rounded-button"
              >
                Save Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App
