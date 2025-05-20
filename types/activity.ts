export interface Activity {
  id: string;
  tripId: string;
  title: string;
  date: string;
  time?: string;
  duration?: string;
  location?: string;
  description?: string;
  category?: string;
  photos?: string[];
  cost?: number;
  participants?: string[];
  createdAt: string;
  updatedAt: string;
}