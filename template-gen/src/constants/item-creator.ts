import { FieldDef, McColor, McFormat } from "@/type/item-creator";
import { Consumable, Effect } from "@/data/cpn/consumable";

// Single source of truth for attribute ids — mirrors the plugin enum.
export { ATTRIBUTE_KEYS } from "@/registry/attribute-registry";

// ─── Mock data ────────────────────────────────────────────────────────────────

export const MOCK_BASES: string[] = [
    "LAPIS_LAZULI", "BLACK_STAINED_GLASS", "DIAMOND_SWORD", "GOLDEN_APPLE",
    "IRON_PICKAXE", "EMERALD", "NETHERITE_INGOT", "ENDER_PEARL", "BLAZE_ROD", "SHIELD",
];

// ─── MC tag constants ─────────────────────────────────────────────────────────

export const MC_COLORS: McColor[] = [
    { tag: "<black>",        label: "Black",        color: "#000000" },
    { tag: "<dark_blue>",    label: "Dark Blue",    color: "#0000AA" },
    { tag: "<dark_green>",   label: "Dark Green",   color: "#00AA00" },
    { tag: "<dark_aqua>",    label: "Dark Aqua",    color: "#00AAAA" },
    { tag: "<dark_red>",     label: "Dark Red",     color: "#AA0000" },
    { tag: "<dark_purple>",  label: "Dark Purple",  color: "#AA00AA" },
    { tag: "<gold>",         label: "Gold",         color: "#FFAA00" },
    { tag: "<gray>",         label: "Gray",         color: "#AAAAAA" },
    { tag: "<dark_gray>",    label: "Dark Gray",    color: "#555555" },
    { tag: "<blue>",         label: "Blue",         color: "#5555FF" },
    { tag: "<green>",        label: "Green",        color: "#55FF55" },
    { tag: "<aqua>",         label: "Aqua",         color: "#55FFFF" },
    { tag: "<red>",          label: "Red",          color: "#FF5555" },
    { tag: "<light_purple>", label: "Light Purple", color: "#FF55FF" },
    { tag: "<yellow>",       label: "Yellow",       color: "#FFFF55" },
    { tag: "<white>",        label: "White",        color: "#FFFFFF" },
];

export const MC_FORMATS: McFormat[] = [
    { tag: "<bold>", label: "Bold" },
    { tag: "<!i>",   label: "No Italic" },
    { tag: "<i>",    label: "Italic" },
    { tag: "<u>",    label: "Underline" },
    { tag: "<st>",   label: "Strikethrough" },
    { tag: "<obf>",  label: "Obfuscated" },
];

// ─── Field definitions ────────────────────────────────────────────────────────

// `animation` is handled separately via an enum select; `sound` is a namespaced key string.
export const CONSUMABLE_FIELDS: FieldDef[] = [
    { key: "hunger",         type: "number"  },
    { key: "saturation",     type: "number"  },
    { key: "consumeSeconds", type: "number"  },
    { key: "canAlwaysEat",   type: "boolean" },
    { key: "sound",          type: "string"  },
    { key: "hasParticles",   type: "boolean" },
];

// id đặt đầu để user nhìn thấy context trước khi điền các field còn lại
export const EFFECT_FIELDS: FieldDef[] = [
    { key: "id",            type: "string"  },
    { key: "duration",      type: "number"  },
    { key: "value",         type: "number"  },
    { key: "modifierId",    type: "string"  },
    { key: "deathBehavior", type: "string"  },
    { key: "display",       type: "boolean" },
];

// ─── Default factories ────────────────────────────────────────────────────────

/** Tạo một Effect rỗng mới — dùng factory thay vì object literal để tránh shared reference */
export const makeDefaultEffect = (): Effect => ({
    id:            "",
    duration:      0,
    deathBehavior: "",
    value:         0,
    modifierId:    "",
    display:       true,
});

export const DEFAULT_CONSUMABLE: Consumable = {
    hunger:        0,
    saturation:    0,
    canAlwaysEat:  false,
    consumeSeconds: 1.6,
    animation:     "EAT",
    sound:         "minecraft:entity.generic.eat",
    hasParticles:  true,
    effects:       [],
};