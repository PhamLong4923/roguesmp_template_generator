import {SpriteInfo} from "@/type/item-creator";

const COLOR_MAP: Record<string, string> = {
    LAPIS_LAZULI: "#1a6eb5",
    BLACK_STAINED_GLASS: "#1a1a1a",
    DIAMOND_SWORD: "#48d1cc",
    GOLDEN_APPLE: "#ffd700",
    IRON_PICKAXE: "#c0c0c0",
    EMERALD: "#50c878",
    NETHERITE_INGOT: "#3d3340",
    ENDER_PEARL: "#3e7c5e",
    BLAZE_ROD: "#e8a020",
    SHIELD: "#8b6914",
};

function getItemImagePath(itemName: string): string {
    const lower = itemName.toLowerCase();
    const formattedName = lower.startsWith('minecraft:')
        ? lower.replace(':', '_')
        : `minecraft_${lower}`;

    return itemName.length > 0
        ? `../../public/data/item_texture/${formattedName}.png`
        : `../../public/data/item_texture/minecraft_barrier.png`;
}

export function useMcItemSprite(base: string): SpriteInfo {
    return {
        spriteUrl: getItemImagePath(base), // TODO: map base -> real sprite URL
        fallbackColor: COLOR_MAP[base] ?? "#555",
        label: base,
    };
}