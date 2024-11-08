import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { Contact, Client, Product, Opportunity } from '../types';

interface SalesFlowDB extends DBSchema {
  contacts: {
    key: number;
    value: Contact;
    indexes: {
      'by-email': string;
      'by-client': number;
    };
  };
  clients: {
    key: number;
    value: Client;
    indexes: {
      'by-name': string;
    };
  };
  opportunities: {
    key: number;
    value: Opportunity;
    indexes: {
      'by-client': number;
      'by-contact': number;
      'by-stage': string;
    };
  };
  products: {
    key: number;
    value: Product;
    indexes: {
      'by-category': string;
    };
  };
}

let db: IDBPDatabase<SalesFlowDB>;

export async function initDB() {
  db = await openDB<SalesFlowDB>('salesflow-db', 1, {
    upgrade(db) {
      // Contacts store
      const contactsStore = db.createObjectStore('contacts', {
        keyPath: 'id',
        autoIncrement: true
      });
      contactsStore.createIndex('by-email', 'email', { unique: true });
      contactsStore.createIndex('by-client', 'clientId', { unique: false });

      // Clients store
      const clientsStore = db.createObjectStore('clients', {
        keyPath: 'id',
        autoIncrement: true
      });
      clientsStore.createIndex('by-name', 'name', { unique: false });

      // Opportunities store
      const opportunitiesStore = db.createObjectStore('opportunities', {
        keyPath: 'id',
        autoIncrement: true
      });
      opportunitiesStore.createIndex('by-client', 'clientId', { unique: false });
      opportunitiesStore.createIndex('by-contact', 'contactId', { unique: false });
      opportunitiesStore.createIndex('by-stage', 'stage', { unique: false });

      // Products store
      const productsStore = db.createObjectStore('products', {
        keyPath: 'id',
        autoIncrement: true
      });
      productsStore.createIndex('by-category', 'category', { unique: false });
    }
  });

  return db;
}

export async function getDB() {
  if (!db) {
    await initDB();
  }
  return db;
}