export interface Expense {
  id: string;
  tripId: string;
  title: string;
  amount: number;
  currency?: string;
  category: string;
  date: string;
  paidBy: string;
  sharedWith: string[];
  splitMethod?: 'equal' | 'percentage' | 'custom';
  splitDetails?: Record<string, number>;
  receipt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}