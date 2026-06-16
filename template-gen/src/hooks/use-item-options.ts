import { useMemo } from "react";
import { useItems } from "@/hooks/use-item";
import allItemsData from "@/public/data/items/_all.json";

export interface ItemOption {
    id: string;            // value stored in loot entry's item_id
    name: string;          // human-readable label
    base: string;          // material/sprite key for ItemSpritePreview
    kind: "custom" | "vanilla";
}

/** Strip MiniMessage-style <tags> so custom item names render plainly in pickers. */
function stripMc(s: string): string {
    return s.replace(/<[^>]*>/g, "").trim();
}

function titleCase(key: string): string {
    return key
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

const VANILLA: ItemOption[] = Object.keys(allItemsData as Record<string, unknown>).map((k) => ({
    id: k,
    name: titleCase(k),
    base: k,
    kind: "vanilla" as const,
}));

/**
 * Unified item option list for loot-table entry pickers: custom items created in the
 * Item editor (from firestore) plus all vanilla Minecraft items. `byId` resolves an
 * entry's stored `item_id` back to its display name + sprite base.
 */
export function useItemOptions() {
    const { data: items = [] } = useItems();

    return useMemo(() => {
        const custom: ItemOption[] = items.map((it) => ({
            id: it.id,
            name: stripMc((it.components?.name as string) ?? it.id),
            base: it.base,
            kind: "custom" as const,
        }));

        const byId: Record<string, ItemOption> = {};
        for (const o of [...custom, ...VANILLA]) if (!(o.id in byId)) byId[o.id] = o;

        return { custom, vanilla: VANILLA, byId };
    }, [items]);
}
