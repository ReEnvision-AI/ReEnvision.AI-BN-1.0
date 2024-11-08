import { create } from 'zustand';
import { getDB } from './db';
import { Contact, Client, Product, Opportunity, Settings } from '../types';

interface SalesFlowState {
  contacts: Contact[];
  clients: Client[];
  opportunities: Opportunity[];
  products: Product[];
  settings: Settings;
  isLoading: boolean;
  error: string | null;

  // Contact actions
  loadContacts: () => Promise<void>;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateContact: (id: number, contact: Partial<Contact>) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;

  // Client actions
  loadClients: () => Promise<void>;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateClient: (id: number, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;

  // Opportunity actions
  loadOpportunities: () => Promise<void>;
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateOpportunity: (id: number, opportunity: Partial<Opportunity>) => Promise<void>;
  deleteOpportunity: (id: number) => Promise<void>;

  // Product actions
  loadProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  // Settings
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useSalesFlowStore = create<SalesFlowState>((set, get) => ({
  contacts: [],
  clients: [],
  opportunities: [],
  products: [],
  settings: {
    companyName: 'My Company',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    apiKey: ''
  },
  isLoading: false,
  error: null,

  // Contact actions
  loadContacts: async () => {
    try {
      set({ isLoading: true });
      const db = await getDB();
      const contacts = await db.getAll('contacts');
      set({ contacts, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load contacts', isLoading: false });
    }
  },

  addContact: async (contact) => {
    try {
      const db = await getDB();
      const timestamp = new Date().toISOString();
      const newContact = {
        ...contact,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await db.add('contacts', newContact);
      get().loadContacts();
    } catch (error) {
      set({ error: 'Failed to add contact' });
    }
  },

  updateContact: async (id, contact) => {
    try {
      const db = await getDB();
      const existing = await db.get('contacts', id);
      const updatedContact = {
        ...existing,
        ...contact,
        updatedAt: new Date().toISOString()
      };
      await db.put('contacts', updatedContact);
      get().loadContacts();
    } catch (error) {
      set({ error: 'Failed to update contact' });
    }
  },

  deleteContact: async (id) => {
    try {
      const db = await getDB();
      await db.delete('contacts', id);
      get().loadContacts();
    } catch (error) {
      set({ error: 'Failed to delete contact' });
    }
  },

  // Client actions
  loadClients: async () => {
    try {
      set({ isLoading: true });
      const db = await getDB();
      const clients = await db.getAll('clients');
      set({ clients, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load clients', isLoading: false });
    }
  },

  addClient: async (client) => {
    try {
      const db = await getDB();
      const timestamp = new Date().toISOString();
      const newClient = {
        ...client,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await db.add('clients', newClient);
      get().loadClients();
    } catch (error) {
      set({ error: 'Failed to add client' });
    }
  },

  updateClient: async (id, client) => {
    try {
      const db = await getDB();
      const existing = await db.get('clients', id);
      const updatedClient = {
        ...existing,
        ...client,
        updatedAt: new Date().toISOString()
      };
      await db.put('clients', updatedClient);
      get().loadClients();
    } catch (error) {
      set({ error: 'Failed to update client' });
    }
  },

  deleteClient: async (id) => {
    try {
      const db = await getDB();
      await db.delete('clients', id);
      get().loadClients();
    } catch (error) {
      set({ error: 'Failed to delete client' });
    }
  },

  // Opportunity actions
  loadOpportunities: async () => {
    try {
      set({ isLoading: true });
      const db = await getDB();
      const opportunities = await db.getAll('opportunities');
      set({ opportunities, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load opportunities', isLoading: false });
    }
  },

  addOpportunity: async (opportunity) => {
    try {
      const db = await getDB();
      const timestamp = new Date().toISOString();
      const newOpportunity = {
        ...opportunity,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await db.add('opportunities', newOpportunity);
      get().loadOpportunities();
    } catch (error) {
      set({ error: 'Failed to add opportunity' });
    }
  },

  updateOpportunity: async (id, opportunity) => {
    try {
      const db = await getDB();
      const existing = await db.get('opportunities', id);
      const updatedOpportunity = {
        ...existing,
        ...opportunity,
        updatedAt: new Date().toISOString()
      };
      await db.put('opportunities', updatedOpportunity);
      get().loadOpportunities();
    } catch (error) {
      set({ error: 'Failed to update opportunity' });
    }
  },

  deleteOpportunity: async (id) => {
    try {
      const db = await getDB();
      await db.delete('opportunities', id);
      get().loadOpportunities();
    } catch (error) {
      set({ error: 'Failed to delete opportunity' });
    }
  },

  // Product actions
  loadProducts: async () => {
    try {
      set({ isLoading: true });
      const db = await getDB();
      const products = await db.getAll('products');
      set({ products, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to load products', isLoading: false });
    }
  },

  addProduct: async (product) => {
    try {
      const db = await getDB();
      const timestamp = new Date().toISOString();
      const newProduct = {
        ...product,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      await db.add('products', newProduct);
      get().loadProducts();
    } catch (error) {
      set({ error: 'Failed to add product' });
    }
  },

  updateProduct: async (id, product) => {
    try {
      const db = await getDB();
      const existing = await db.get('products', id);
      const updatedProduct = {
        ...existing,
        ...product,
        updatedAt: new Date().toISOString()
      };
      await db.put('products', updatedProduct);
      get().loadProducts();
    } catch (error) {
      set({ error: 'Failed to update product' });
    }
  },

  deleteProduct: async (id) => {
    try {
      const db = await getDB();
      await db.delete('products', id);
      get().loadProducts();
    } catch (error) {
      set({ error: 'Failed to delete product' });
    }
  },

  // Settings
  updateSettings: (settings) => {
    set((state) => ({
      settings: { ...state.settings, ...settings }
    }));
  }
}));