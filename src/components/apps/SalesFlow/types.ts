export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  clientId?: number;
  company: string;
  location: string;
  lastContact: string;
  status: 'active' | 'inactive';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id?: number;
  name: string;
  industry: string;
  website: string;
  annualRevenue?: number;
  employeeCount?: number;
  status: 'active' | 'inactive';
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Opportunity {
  id?: number;
  title: string;
  clientId: number;
  contactId: number;
  value: number;
  stage: 'lead' | 'qualified' | 'pending' | 'won' | 'implemented';
  probability: number;
  expectedCloseDate: string;
  products: {
    productId: number;
    quantity: number;
    price: number;
  }[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id?: number;
  name: string;
  category: string;
  price: number;
  sku: string;
  stock: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  companyName: string;
  currency: string;
  dateFormat: string;
  emailNotifications: boolean;
  apiKey: string;
}

export interface SalesMetrics {
  totalRevenue: number;
  totalLeads: number;
  conversionRate: number;
  activeDeals: number;
  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
  pipelineDistribution: {
    stage: string;
    count: number;
    value: number;
  }[];
}