import { db } from './firebase';
import {
    collection, doc,
    getDocs, getDoc,
    setDoc, addDoc,
    deleteDoc, query,
    where
} from 'firebase/firestore';

export const Collections = {
    ITEMS:       'items',
    ENTITIES:    'entities',
    LOOT_TABLES: 'loot_tables',
    SCHEMETA:    'schemeta',
    ROOM:        'rooms',
    DUNGEONS:    'dungeons',
};

export async function getAll(collectionName) {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getById(collectionName, id) {
    const snap = await getDoc(doc(db, collectionName, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function create(collectionName, data) {
    const ref = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    return ref.id;
}

export async function upsert(collectionName, id, data) {
    await setDoc(doc(db, collectionName, id), {
        ...data,
        updatedAt: Date.now(),
    }, { merge: true });
}

export async function remove(collectionName, id) {
    await deleteDoc(doc(db, collectionName, id));
}

export async function queryBy(collectionName, field, value) {
    const q = query(
        collection(db, collectionName),
        where(field, '==', value)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
}