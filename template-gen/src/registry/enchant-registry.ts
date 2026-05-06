export type EnchantDisplayType = "name_only" | "name_level" | "name_level_value";

export interface EnchantMeta {
    id: string;
    simpleName: string;
    displayType: EnchantDisplayType;
    color: string;
    /** Chỉ dùng khi displayType = "name_level_value" — value mỗi level */
    valuePerLevel?: number;
    valueUnit?: string;
}

export const ENCHANT_REGISTRY: EnchantMeta[] = [
    {
        id: "aqua_affinity",
        simpleName: "Đào nhanh dưới nước",
        displayType: "name_only",
        color: "<gray>",
    },
    {
        id: "bane_of_arthropods",
        simpleName: "Diệt chân đốt",
        displayType: "name_level",       //"Tên IV"
        color: "<gray>",
    },
    {
        id: "sharpness",
        simpleName: "Sắc bén",
        displayType: "name_level",
        color: "<gray>",
    },
    {
        id: "protection",
        simpleName: "Bảo vệ",
        displayType: "name_level",
        color: "<gray>",
    },
    // thêm enchant mới vào đây
];

export const ENCHANT_META_MAP = Object.fromEntries(
    ENCHANT_REGISTRY.map((e) => [e.id, e])
) as Record<string, EnchantMeta>;

// Roman numeral helper — mirror defaultLoreProvider Java
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
export function toRoman(n: number): string {
    return ROMAN[n] ?? `${n}`;
}