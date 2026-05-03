import { db } from './config.js';
import {
    collection, doc,
    getDocs, getDoc,
    setDoc, addDoc,
    deleteDoc, query,
    where, WhereFilterOp
} from 'firebase/firestore';

export const Collections = {
    ITEMS:       'items',
    ENTITIES:    'entities',
    LOOT_TABLES: 'loot_tables',
    SCHEMETA:    'schemeta',
    ROOM:        'rooms',
    DUNGEONS:    'dungeons',
} as const;

export type CollectionName = typeof Collections[keyof typeof Collections];

export async function getAll<T>(collectionName: CollectionName): Promise<T[]> {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
}

export async function getById<T>(collectionName: CollectionName, id: string): Promise<T | null> {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } as T : null;
}

export async function create<T extends object>(collectionName: CollectionName, data: T): Promise<string> {
    const ref = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    return ref.id;
}

export async function upsert<T extends object>(collectionName: CollectionName, id: string, data: Partial<T>): Promise<void> {
    await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: Date.now(),
    }, { merge: true });
}

export async function remove(collectionName: CollectionName, id: string): Promise<void> {
    await deleteDoc(doc(db, collectionName, id));
}

export async function queryBy<T>(
    collectionName: CollectionName,
    field: string,
    op: WhereFilterOp,
    value: unknown
): Promise<T[]> {
    const q = query(collection(db, collectionName), where(field, op, value));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as T));
}