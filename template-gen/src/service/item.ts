import {Collections, create, getAll, getById, queryBy, remove, upsert} from '@/firebase/firestoreService';
import {Item} from '@/data/item';

const COL = Collections.ITEMS;

export type CreateItemDto = Omit<Item, 'id'>;
export type UpdateItemDto = Partial<Omit<Item, 'id'>>;

function normalizeItem(item: Item): Item {
    const consumable = item.components?.consumable;
    if (consumable && !Array.isArray(consumable.effects)) {
        consumable.effects = Object.values(consumable.effects ?? {});
    }
    return item;
}

export const itemService = {
    getAll: (): Promise<Item[]> =>
        getAll<Item>(COL).then((items) => items.map(normalizeItem)),

    getById: (id: string): Promise<Item> =>
        getById<Item>(COL, id).then((item) => {
            if (!item) throw new Error(`Item not found: ${id}`);
            return normalizeItem(item);
        }),

    create: (data: CreateItemDto): Promise<string> =>
        create<CreateItemDto>(COL, data),

    update: (id: string, data: UpdateItemDto): Promise<void> =>
        upsert<Item>(COL, id, data),

    remove: (id: string): Promise<void> =>
        remove(COL, id),

    getByBase: (base: string): Promise<Item[]> =>
        queryBy<Item>(COL, 'base', '==', base),
};