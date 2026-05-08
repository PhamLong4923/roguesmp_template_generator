// ── Schema Types ─────────────────────────────────────────────
export interface LootTable {
    id: string;
    pools: PoolInfo[];
}

export interface PoolInfo {
    rolls: number;
    bonus_rolls: number;
    entries: LootEntry[];
}

export type LootEntry = ItemEntry | LootTableEntry | EmptyEntry;

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

// ── UI Metadata ───────────────────────────────────────────────
export interface MCItem {
    id: string;
    name: string;
    icon: string;
}

export interface LootTableMeta {
    id: string;
    pools: number;
    entries: number;
}

// ── Mock data — swap with real hooks in production ────────────
export const MC_ITEMS: MCItem[] = [
    {id: "diamond_sword", name: "Diamond Sword", icon: "⚔️"},
    {id: "iron_pickaxe", name: "Iron Pickaxe", icon: "⛏️"},
    {id: "golden_apple", name: "Golden Apple", icon: "🍎"},
    {id: "diamond", name: "Diamond", icon: "💎"},
    {id: "emerald", name: "Emerald", icon: "💚"},
    {id: "bow", name: "Bow", icon: "🏹"},
    {id: "arrow", name: "Arrow", icon: "🏹"},
    {id: "leather_helmet", name: "Leather Helmet", icon: "🪖"},
    {id: "iron_ingot", name: "Iron Ingot", icon: "🔩"},
    {id: "gold_ingot", name: "Gold Ingot", icon: "🟡"},
    {id: "coal", name: "Coal", icon: "⬛"},
    {id: "bread", name: "Bread", icon: "🍞"},
    {id: "book", name: "Book", icon: "📖"},
    {id: "torch", name: "Torch", icon: "🕯️"},
    {id: "oak_log", name: "Oak Log", icon: "🪵"},
    {id: "ender_pearl", name: "Ender Pearl", icon: "🔮"},
    {id: "blaze_rod", name: "Blaze Rod", icon: "🔥"},
    {id: "nether_star", name: "Nether Star", icon: "⭐"},
    {id: "totem", name: "Totem", icon: "🗿"},
    {id: "trident", name: "Trident", icon: "🔱"},
];

export const LOOT_TABLE_METAS: LootTableMeta[] = [
    {id: "common_loot", pools: 2, entries: 5},
    {id: "dungeon/mob_drop", pools: 1, entries: 3},
    {id: "chest/village_smith", pools: 3, entries: 8},
    {id: "chest/nether_fortress", pools: 2, entries: 6},
    {id: "entities/zombie", pools: 1, entries: 4},
    {id: "chest/stronghold", pools: 3, entries: 10},
    {id: "entities/skeleton", pools: 2, entries: 3},
];

// ── Helpers ───────────────────────────────────────────────────
export function getItemMeta(id: string): MCItem {
    return MC_ITEMS.find((i) => i.id === id) ?? {id, name: id, icon: "📦"};
}

export function buildCleanLootTable(id: string, pools: PoolInfo[]): LootTable {
    return {
        id,
        pools: pools.map((p) => ({
            rolls: p.rolls,
            bonus_rolls: p.bonus_rolls,
            entries: p.entries.map((e) => {
                if (e.type === "item")
                    return {
                        type: "item" as const,
                        item_id: e.item_id,
                        min_amount: e.min_amount,
                        max_amount: e.max_amount,
                        weight: e.weight,
                    };
                if (e.type === "loot_table")
                    return {type: "loot_table" as const, name: e.name, weight: e.weight};
                return {type: "empty" as const, weight: e.weight};
            }),
        })),
    };
}