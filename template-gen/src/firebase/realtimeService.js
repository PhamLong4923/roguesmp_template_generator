import { rtdb } from './config.js';
import { ref, set, get, child, remove as rtRemove } from 'firebase/database';

export async function uploadSchem(id, name, fileBuffer) {
    const base64 = btoa(
        String.fromCharCode(...new Uint8Array(fileBuffer))
    );
    await set(ref(rtdb, `schematics/${id}`), {
        name,
        data: base64,
        createdAt: Date.now(),
    });
}

export async function downloadSchem(id) {
    const snap = await get(child(ref(rtdb), `schematics/${id}`));
    if (!snap.exists()) return null;
    const { name, data } = snap.val();
    const binary = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    return { name, buffer: binary.buffer };
}

export async function listSchematics() {
    const snap = await get(ref(rtdb, 'schematics'));
    if (!snap.exists()) return [];
    return Object.entries(snap.val()).map(([id, val]) => ({
        id,
        name: val.name,
        createdAt: val.createdAt,
    }));
}

export async function deleteSchem(id) {
    await rtRemove(ref(rtdb, `schematics/${id}`));
}