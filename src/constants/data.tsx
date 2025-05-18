const TRANSACTIONS = [
    { id: 1, personId: 1, type: 'given', amount: 250, note: 'Dinner at Bistro', date: '2025-05-15' },
    { id: 2, personId: 2, type: 'received', amount: 120, note: 'Movie tickets', date: '2025-05-14' },
    { id: 3, personId: 3, type: 'given', amount: 75, note: 'Coffee and snacks', date: '2025-05-16' },
    { id: 4, personId: 4, type: 'given', amount: 450, note: 'Concert tickets', date: '2025-05-10' },
    { id: 5, personId: 5, type: 'received', amount: 200, note: 'Shared taxi fare', date: '2025-05-12' },
    { id: 6, personId: 1, type: 'received', amount: 100, note: 'Partial payment', date: '2025-05-05' },
    { id: 7, personId: 1, type: 'given', amount: 350, note: 'Weekend trip expenses', date: '2025-04-28' },
]

const PEOPLE = [
    { id: 1, name: 'Alexander Mitchell', balance: 250 },
    { id: 2, name: 'Emily Richardson', balance: -120 },
    { id: 3, name: 'James Wilson', balance: 75 },
    { id: 4, name: 'Sophia Anderson', balance: 450 },
    { id: 5, name: 'Michael Thompson', balance: -200 },
]

export default {
    PEOPLE,
    TRANSACTIONS
}