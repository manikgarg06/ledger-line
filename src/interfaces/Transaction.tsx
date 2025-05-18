export interface Transaction {
    id: number;
    personId: number;
    type: 'given' | 'received' | 'settled';
    amount: number;
    note: string;
    date: string;
}