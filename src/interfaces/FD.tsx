export interface FD {
  id: number;
  personId: number; // Associated user (Person)
  fdName: string; // FD name / product name
  holderName: string; // Name on which FD is done
  nomineeName: string; // Nominee of FD
  amount: number; // Principal amount
  startDate: string; // ISO date (yyyy-mm-dd)
  interestRate: number; // Annual interest rate in percent (e.g., 7.5)
  tenureMonths: number; // Tenure in months
  referenceNo: string; // FD Reference Number
  bank: string; // Associated Bank
  tentativeEndDate: string; // Derived: startDate + tenureMonths
  isActive: boolean; // Active/Inactive (soft-close)
}
