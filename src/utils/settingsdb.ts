import { openDB, IDBPDatabase } from 'idb';

interface UserSettings {
    theme: string;
    language: string;
    wallpaper: string;
    username: string;
    iconSize: string;
    [key: string]: any;
}

const DB_NAME = 'user_settings';
const STORE_NAME = 'settings';

let db: IDBPDatabase | null = null;

export async function getDB() {
    if (!db) { 
        db = await openDB(DB_NAME, 1, {
            upgrade(database) {
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    database.createObjectStore(STORE_NAME);
                }
            },
        });
    }

    return db;
}

export async function getSetting(key: string): Promise<any> {
    const db = await getDB();
    return db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);
}

export async function setSetting(key: string, value: any): Promise<void> {
    const db = await getDB();
    await db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(value, key);
}

export async function deleteSetting(key: string): Promise<void> {
    const db = await getDB();
    await db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).delete(key);
}