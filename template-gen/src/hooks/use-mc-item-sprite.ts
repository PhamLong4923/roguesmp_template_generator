import { SpriteInfo } from "@/type/item-creator";

const COLOR_MAP: Record<string, string> = {
    LAPIS_LAZULI:       "#1a6eb5",
    BLACK_STAINED_GLASS:"#1a1a1a",
    DIAMOND_SWORD:      "#48d1cc",
    GOLDEN_APPLE:       "#ffd700",
    IRON_PICKAXE:       "#c0c0c0",
    EMERALD:            "#50c878",
    NETHERITE_INGOT:    "#3d3340",
    ENDER_PEARL:        "#3e7c5e",
    BLAZE_ROD:          "#e8a020",
    SHIELD:             "#8b6914",
};

function getItemImagePath(itemName: string): string{
    const formattedName = itemName.startsWith('minecraft:') ? itemName.replace(':', '_') : `minecraft_${itemName}`;
    const itemImagePath = `../../public/data/item_texture/${formattedName}.png`;
    const barrierPath = `../../public/data/item_texture/minecraft_barrier.png`;

    return itemName.length > 0 ? itemImagePath : barrierPath;
}

export function useMcItemSprite(base: string): SpriteInfo {
    return {
        spriteUrl: getItemImagePath(base), // TODO: map base -> real sprite URL
        fallbackColor: COLOR_MAP[base] ?? "#555",
        label: base,
    };
}