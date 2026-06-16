// ─── Types ────────────────────────────────────────────────────────────────────

// Mirror of plugin `EquipSlot` enum constant names. Serialized UPPERCASE (Gson .name()).
export type Slot =
    | "MAINHAND"
    | "OFFHAND"
    | "HEAD"
    | "CHEST"
    | "LEGS"
    | "FEET"
    | "PROJECTILE";

export const SLOTS: Slot[] = ["MAINHAND", "OFFHAND", "HEAD", "CHEST", "LEGS", "FEET", "PROJECTILE"];

// Mirror of Paper `ItemUseAnimation`. Serialized UPPERCASE (.name()).
export type ItemUseAnimation =
    | "NONE"
    | "EAT"
    | "DRINK"
    | "BLOCK"
    | "BOW"
    | "SPEAR"
    | "CROSSBOW"
    | "SPYGLASS"
    | "TOOT_HORN"
    | "BRUSH"
    | "BUNDLE";

export const ITEM_USE_ANIMATIONS: ItemUseAnimation[] = [
    "NONE", "EAT", "DRINK", "BLOCK", "BOW", "SPEAR",
    "CROSSBOW", "SPYGLASS", "TOOT_HORN", "BRUSH", "BUNDLE",
];

export interface McColor {
    tag: string;
    label: string;
    color: string;
}

export interface McFormat {
    tag: string;
    label: string;
}

export interface TextSegment {
    text: string;
    color: string;
    italic: boolean;
    bold: boolean;
}

export interface FieldDef {
    key: string;
    type: "number" | "string" | "boolean";
}

export interface SpriteInfo {
    spriteUrl: string | null;
    fallbackColor: string;
    label: string;
}