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

/**
 * Add months to a yyyy-mm-dd string and return yyyy-mm-dd
 */
export function addMonths(dateISO: string, months: number): string {
    const [y, m, d] = dateISO.split('-').map((v) => parseInt(v, 10));
    const date = new Date(y, m - 1, d);
    const targetMonth = date.getMonth() + months;
    const result = new Date(date);
    result.setMonth(targetMonth);

    // Handle end-of-month rollover (e.g., adding to Jan 31)
    if (result.getDate() !== date.getDate()) {
        result.setDate(0); // last day of previous month
    }

  const yyyy = result.getFullYear();
  const mm = String(result.getMonth() + 1).padStart(2, '0');
  const dd = String(result.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Add days to a yyyy-mm-dd string and return yyyy-mm-dd
 */
export function addDays(dateISO: string, days: number): string {
  const [y, m, d] = dateISO.split('-').map((v) => parseInt(v, 10));
  const date = new Date(y, m - 1, d);
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  const yyyy = result.getFullYear();
  const mm = String(result.getMonth() + 1).padStart(2, '0');
  const dd = String(result.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Days between two yyyy-mm-dd dates (end - start)
 */
export function daysBetween(startISO: string, endISO: string): number {
  const [ys, ms, ds] = startISO.split('-').map((v) => parseInt(v, 10));
  const [ye, me, de] = endISO.split('-').map((v) => parseInt(v, 10));
  const start = new Date(ys, ms - 1, ds);
  const end = new Date(ye, me - 1, de);
  const diffMs = end.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.floor(diffMs / oneDay));
}

/**
 * Compute current FD amount as of "today" (simple interest prorated by days).
 * Uses tenureMonths as the cap for accrued time.
 */
export function computeCurrentFDAmount(
  principal: number,
  ratePercent: number,
  startDateISO: string,
  tenureMonths: number,
  todayISO?: string
): number {
  const today = todayISO ? todayISO : new Date().toISOString().split('T')[0];
  const d = daysBetween(startDateISO, today);
  const elapsedMonths = Math.min(Math.max(0, tenureMonths), d / 30); // allow fractional months
  const r = ratePercent / 100;
  const interest = principal * r * (elapsedMonths / 12);
  return principal + interest;
}

/**
 * Simple interest calculation for FD
 * interest = P * (r/100) * (tenureMonths/12)
 */
export function computeFDInterest(principal: number, ratePercent: number, tenureMonths: number): {
    interest: number;
    maturityAmount: number;
} {
    const t = Math.max(0, tenureMonths) / 12;
    const r = ratePercent / 100;
    const interest = principal * r * t;
    return {
        interest,
        maturityAmount: principal + interest,
    };
}
