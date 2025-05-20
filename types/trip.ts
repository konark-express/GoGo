import { Expense } from './expense';
import { Activity } from './activity';

export interface Participant {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Trip {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  location?: string;
  coverImage: string;
  participants: Participant[];
  expenses: Expense[];
  activities: Activity[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}