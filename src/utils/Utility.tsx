import { CURRENCY } from "../constants";

export function generateId(): number {
    return Date.now();
}

export function formatNumber(amount: number): string {
    return CURRENCY + ' ' + amount.toLocaleString();
}