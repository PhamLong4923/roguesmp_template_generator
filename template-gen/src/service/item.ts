import { getAll, getById, create, upsert, remove, queryBy, Collections } from '@/firebase/firestoreService';
import { Item } from '@/data/Item';

const COL = Collections.ITEMS;

export type CreateItemDto = Omit<Item, 'id'>;
export type UpdateItemDto = Partial<Omit<Item, 'id'>>;

export const itemService = {
    getAll: (): Promise<Item[]> =>
        getAll<Item>(COL),

    getById: (id: string): Promise<Item | null> =>
        getById<Item>(COL, id),

    create: (data: CreateItemDto): Promise<string> =>
        create<CreateItemDto>(COL, data),

    update: (id: string, data: UpdateItemDto): Promise<void> =>
        upsert<Item>(COL, id, data),

    remove: (id: string): Promise<void> =>
        remove(COL, id),

    getByBase: (base: string): Promise<Item[]> =>
        queryBy<Item>(COL, 'base', '==', base),
};