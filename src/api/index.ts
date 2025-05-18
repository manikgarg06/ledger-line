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
    updatePersonBalance(newTransaction);
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
    const deletedTransaction = transactions.find(t => t.id === id);
    if (deletedTransaction) {
        transactions = transactions.filter(t => t.id !== id);
        let persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
        const index = persons.findIndex(p => p.id === deletedTransaction.personId);
        if (index > -1) {
            const person = persons[index];
            let newBalance = person.balance;
            if (deletedTransaction.type === 'given') {
                newBalance += deletedTransaction.amount;
            } else if (deletedTransaction.type === 'received') {
                newBalance -= deletedTransaction.amount;
            } else if (deletedTransaction.type === 'settled') {
                // For settled transactions, we need to calculate the previous balance
                const previousTransactions = transactions
                    .filter(t => t.id !== deletedTransaction.id && t.personId === person.id);
                newBalance = previousTransactions.reduce((sum, t) => {
                    if (t.type === 'given') return sum + t.amount;
                    if (t.type === 'received') return sum - t.amount;
                    return sum;
                }, 0);
            }
            person.balance = newBalance;
        }
        saveToLocalStorage(PERSONS_STORAGE_KEY, persons);
        saveToLocalStorage(TRANSACTIONS_STORAGE_KEY, transactions);
    }
    return Promise.resolve(transactions.length < initialLength);
}

export function fetchPerson(): Promise<Person[]> {
    const persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
    return Promise.resolve(persons);
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

export function updatePersonBalance(newTransaction: Transaction): void {
    let persons = getFromLocalStorage<Person>(PERSONS_STORAGE_KEY);
    const index = persons.findIndex(p => p.id === newTransaction.personId);
    if (index > -1) {
        const person = persons[index];
        let newBalance = person.balance;
        if (newTransaction.type === 'given') {
            newBalance += newTransaction.amount;
        } else if (newTransaction.type === 'received') {
            newBalance -= newTransaction.amount;
        } else if (newTransaction.type === 'settled') {
            newBalance = 0;
        }
        person.balance = newBalance;
    }
    saveToLocalStorage(PERSONS_STORAGE_KEY, persons);
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