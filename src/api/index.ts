import type { Person } from '../interfaces/Person';
import type { Transaction } from '../interfaces/Transaction';
import { generateId } from '../utils/Utility';

const TRANSACTIONS_STORAGE_KEY = 'transactions';
const PERSONS_STORAGE_KEY = 'persons';

function getFromLocalStorage<T>(key: string): T[] {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

function saveToLocalStorage<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
}



export function fetchTransactions(): Promise<Transaction[]> {
    return Promise.resolve(getFromLocalStorage<Transaction>(TRANSACTIONS_STORAGE_KEY));
}

export function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const transactions = getFromLocalStorage<Transaction>(TRANSACTIONS_STORAGE_KEY);
    const newTransaction: Transaction = { ...transaction, id: generateId() };
    transactions.push(newTransaction);
    saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, transactions);
    return Promise.resolve(newTransaction);
}

export function editTransaction(transaction: Transaction): Promise<Transaction> {
    const transactions = getFromLocalStorage<Transaction>(TRANSACTIONS_STORAGE_KEY);
    const index = transactions.findIndex(t => t.id === transaction.id);
    if (index === -1) {
        return Promise.reject(new Error('Transaction not found'));
    }
    transactions[index] = transaction;
    saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, transactions);
    return Promise.resolve(transaction);
}

export function deleteTransaction(id: number): Promise<boolean> {
    let transactions = getFromLocalStorage<Transaction>(TRANSACTIONS_STORAGE_KEY);
    const initialLength = transactions.length;
    transactions = transactions.filter(t => t.id !== id);
    saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, transactions);
    return Promise.resolve(transactions.length < initialLength);
}

export function fetchPerson(id: number): Promise<Person | undefined> {
    const persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
    const person = persons.find(p => p.id === id);
    return Promise.resolve(person);
}

export function addPerson(person: Omit<Person, 'id'>): Promise<Person> {
    const persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
    const newPerson: Person = { ...person, id: generateId() };
    persons.push(newPerson);
    saveToLocalStorage(PERSONS_STORAGE_KEY, persons);
    return Promise.resolve(newPerson);
}

export function deletePerson(id: number): Promise<boolean> {
    let persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
    const initialLength = persons.length;
    persons = persons.filter(p => p.id !== id);
    saveToLocalStorage(PERSONS_STORAGE_KEY, persons);
    return Promise.resolve(persons.length < initialLength);
}

// Initial data setup (optional - for testing)
/*
function initializeData() {
  const initialPersons: Person[] = [
    { id: generateId(), name: 'Alice', balance: 100 },
    { id: generateId(), name: 'Bob', balance: -50 },
  ];
  saveToLocalStorage(PERSONS_STORAGE_KEY, initialPersons);

  const initialTransactions: Transaction[] = []; // Add some initial transactions if needed
  saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, initialTransactions);
}

// Uncomment to run initial data setup on first load
// if (!localStorage.getItem(PERSONS_STORAGE_KEY) && !localStorage.getItem(TRANSACTIONS_STORAGE_KEY)) {
//   initializeData();
// }
*/