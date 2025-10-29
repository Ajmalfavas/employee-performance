export interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  joinDate: string;
  performance?: PerformanceMetrics;
}

export interface PerformanceMetrics {
  employeeId: string;
  period: string;
  overallScore: number;
  categories: PerformanceCategory[];
}

export interface PerformanceCategory {
  name: string;
  score: number;
  maxScore: number;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export type Theme = 'light' | 'dark';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

