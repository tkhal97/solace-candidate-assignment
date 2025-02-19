// src/types/advocate.ts

export interface Advocate {
  id?: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: string;
}

// Cache storage
export interface AdvocatesCache {
  data: Advocate[];
  timestamp: number;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
