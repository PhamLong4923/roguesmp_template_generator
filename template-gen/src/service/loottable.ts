import {Collections, create, getAll, getById, queryBy, remove, upsert} from "@/firebase/firestoreService";
import {LootTable} from "@/type/loottable";

const COL = Collections.LOOT_TABLES;

export type CreateLootDto = Omit<LootTable, 'id'>;
export type UpdateLootDto = Partial<Omit<LootTable, 'id'>>;

export const loottableService = {
    getAll: (): Promise<LootTable[]> => getAll<LootTable>(COL),

    getById: (id: string): Promise<LootTable | null> => getById(COL, id),

    create: (data: CreateLootDto): Promise<string> => create<CreateLootDto>(COL, data),

    update: (id: string, data: UpdateLootDto): Promise<void> => upsert<LootTable>(COL, id, data),

    remove: (id: string): Promise<void> => remove(COL, id),

    getByPath: (path: string): Promise<LootTable[]> => queryBy<LootTable>(COL, 'id', 'array-contains', path)
}