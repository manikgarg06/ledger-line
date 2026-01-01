import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Person } from '../interfaces/Person';
import type { Transaction } from '../interfaces/Transaction';
import { HomeContainer, DetailContainer } from '../containers';
import {
  FloatingActionButton,
  AddPersonModal,
  AddTransactionModal,
} from '../components/core';
import {
  addPerson,
  deletePerson,
  fetchPerson,
  fetchTransactions,
  addTransaction,
  deleteTransaction,
} from '../api';

const HomeTab: React.FC<{
  detail: boolean;
}> = ({detail = false}) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

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

  const navigate = useNavigate();
  const params = useParams<{ personId?: string }>();

  useEffect(() => {
    fetchPerson().then((lPerson) => {
      if (lPerson) setPeople(lPerson);
    });
  }, []);

  useEffect(() => {
    fetchTransactions().then((lTransactions) => {
      if (lTransactions) setTransactions(lTransactions);
    });
  }, []);

  // Sync selected person with route param and keep reference up to date
  useEffect(() => {
    const idStr = params.personId;
    if (!idStr) {
      setSelectedPerson(null);
      return;
    }
    const id = Number(idStr);
    setSelectedPerson(people.find((p) => p.id === id) || null);
  }, [people, params.personId]);

  const getTotalBalance = () => {
    return people.reduce((sum, person) => sum + person.balance, 0);
  };

  const getPersonTransactions = (personId: number) => {
    return transactions.filter((transaction) => transaction.personId === personId);
  };

  const handlePersonClick = (person: Person) => {
    setSelectedPerson(person);
    navigate(`/finance/${person.id}`);
  };

  const handleAddPerson = () => {
    if (newPersonName.trim()) {
      const payload = {
        name: newPersonName.trim(),
        balance: 0,
      };
      addPerson(payload).then(() => {
        fetchPerson().then((lPerson) => {
          if (lPerson) setPeople(lPerson);
        });
        setNewPersonName('');
        setIsAddPersonModalOpen(false);
      });
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
        date: newTransaction.date,
      }).then(() => {
        fetchTransactions().then((lTransactions) => {
          if (lTransactions) setTransactions(lTransactions);
        });
        fetchPerson().then((lPerson) => {
          if (lPerson) setPeople(lPerson);
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
    setNewTransaction((prev) => ({
      ...prev,
      type,
    }));
    setIsAddTransactionModalOpen(true);
  };

  const handleDeletePerson = (personId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete?');
    if (!confirmDelete) return;
    deletePerson(personId).then(() => {
      fetchPerson().then((lPerson) => {
        if (lPerson) setPeople(lPerson);
      });
      if (selectedPerson?.id === personId) {
        setSelectedPerson(null);
        navigate('/finance');
      }
    });
  };

  const handleDeleteTransaction = (transactionId: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmDelete) return;
    deleteTransaction(transactionId).then(() => {
      fetchTransactions().then((lTransactions) => {
        if (lTransactions) setTransactions(lTransactions);
      });
      fetchPerson().then((lPerson) => {
        if (lPerson) setPeople(lPerson);
      });
    });
  };

  return (
    <>
      {!detail && <div className="container mx-auto px-4 pt-4">
        <HomeContainer
          people={people}
          totalBalance={getTotalBalance()}
          onPersonClick={handlePersonClick}
          onDeletePerson={handleDeletePerson}
        />
      </div>}

      {selectedPerson && (
        <div className="container mx-auto px-4 pt-4">
          <DetailContainer
            person={selectedPerson}
            transactions={getPersonTransactions(selectedPerson.id)}
            onQuickAction={handleQuickAction}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </div>
      )}

      <FloatingActionButton
        onClick={() => {
          if (selectedPerson) {
            setIsAddTransactionModalOpen(true);
          } else {
            setIsAddPersonModalOpen(true);
          }
        }}
      />

      <AddPersonModal
        isOpen={isAddPersonModalOpen}
        name={newPersonName}
        onChangeName={setNewPersonName}
        onCancel={() => setIsAddPersonModalOpen(false)}
        onAdd={handleAddPerson}
      />

      <AddTransactionModal
        isOpen={isAddTransactionModalOpen}
        type={newTransaction.type}
        amount={newTransaction.amount}
        note={newTransaction.note}
        date={newTransaction.date}
        setType={(t) => setNewTransaction((prev) => ({ ...prev, type: t }))}
        setAmount={(v) => setNewTransaction((prev) => ({ ...prev, amount: v }))}
        setNote={(v) => setNewTransaction((prev) => ({ ...prev, note: v }))}
        setDate={(v) => setNewTransaction((prev) => ({ ...prev, date: v }))}
        onCancel={() => setIsAddTransactionModalOpen(false)}
        onSave={handleAddTransaction}
      />
    </>
  );
};

export default HomeTab;
