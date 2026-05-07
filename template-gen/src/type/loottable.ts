export interface LootTable {
    id: string;
    pools: PoolInfo[];
}

export interface PoolInfo {
    rolls: number;
    bonus_rolls: number;
    entries: LootEntry[];
}

export type LootEntry =
    | ItemEntry
    | LootTableEntry
    | EmptyEntry;

export interface BaseEntry {
    weight: number;
}

export interface ItemEntry extends BaseEntry {
    type: "item";
    item_id: string;
    min_amount: number;
    max_amount: number;
}

export interface LootTableEntry extends BaseEntry {
    type: "loot_table";
    name: string;
}

export interface EmptyEntry extends BaseEntry {
    type: "empty";
}