import { CURRENCY } from "../constants";

export function generateId(): number {
    return Date.now();
}

export function formatNumber(amount: number): string {   
    return CURRENCY + ' ' + Math.abs(amount).toLocaleString('en-US',{
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    });
}