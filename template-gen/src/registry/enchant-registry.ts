// Mirror of RogueSmpCore `com.roguesmp.constant.Enchants` (@SerializedName ids).
// The `id` strings MUST match the plugin enum exactly — they become the JSON keys
// inside the "enchant" component (`enchants: { <id>: level }`).

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
    { id: "fire_protection",       simpleName: "Chống lửa",            displayType: "name_level", color: "<gray>" },
    { id: "feather_falling",       simpleName: "Rơi nhẹ",              displayType: "name_level", color: "<gray>" },
    { id: "blast_protection",      simpleName: "Chống nổ",             displayType: "name_level", color: "<gray>" },
    { id: "projectile_protection", simpleName: "Chống đạn",            displayType: "name_level", color: "<gray>" },
    { id: "respiration",           simpleName: "Hô hấp",               displayType: "name_level", color: "<gray>" },
    { id: "aqua_affinity",         simpleName: "Đào nhanh dưới nước",  displayType: "name_only",  color: "<gray>" },
    { id: "thorns",                simpleName: "Gai",                  displayType: "name_level", color: "<gray>" },
    { id: "depth_strider",         simpleName: "Sải nước",             displayType: "name_level", color: "<gray>" },
    { id: "frost_walker",          simpleName: "Bước băng",            displayType: "name_level", color: "<gray>" },
    { id: "soul_speed",            simpleName: "Tốc độ linh hồn",      displayType: "name_level", color: "<gray>" },
    { id: "swift_sneak",           simpleName: "Lén nhanh",            displayType: "name_level", color: "<gray>" },
    { id: "smite",                 simpleName: "Trừng phạt",           displayType: "name_level", color: "<gray>" },
    { id: "bane_of_arthropods",    simpleName: "Diệt chân đốt",        displayType: "name_level", color: "<gray>" },
    { id: "knockback",             simpleName: "Đẩy lùi",              displayType: "name_level", color: "<gray>" },
    { id: "fire_aspect",           simpleName: "Đốt cháy",             displayType: "name_level", color: "<gray>" },
    { id: "looting",               simpleName: "Cướp bóc",             displayType: "name_level", color: "<gray>" },
    { id: "sweeping_edge",         simpleName: "Lưỡi chém quét",       displayType: "name_level", color: "<gray>" },
    { id: "efficiency",            simpleName: "Hiệu quả",             displayType: "name_level", color: "<gray>" },
    { id: "silk_touch",            simpleName: "Tay tơ",               displayType: "name_only",  color: "<gray>" },
    { id: "fortune",               simpleName: "Vận may",              displayType: "name_level", color: "<gray>" },
    { id: "retrieval",             simpleName: "Thu hồi",              displayType: "name_level", color: "<gray>" },
    { id: "punch",                 simpleName: "Đấm",                  displayType: "name_level", color: "<gray>" },
    { id: "flame",                 simpleName: "Lửa",                  displayType: "name_only",  color: "<gray>" },
    { id: "luck_of_the_sea",       simpleName: "Vận may biển cả",      displayType: "name_level", color: "<gray>" },
    { id: "lure",                  simpleName: "Mồi nhử",              displayType: "name_level", color: "<gray>" },
    { id: "impaling",              simpleName: "Đâm xuyên",            displayType: "name_level", color: "<gray>" },
    { id: "riptide",               simpleName: "Lao nước",             displayType: "name_level", color: "<gray>" },
    { id: "channeling",            simpleName: "Dẫn điện",             displayType: "name_only",  color: "<gray>" },
    { id: "multishot",             simpleName: "Đa mũi tên",           displayType: "name_only",  color: "<gray>" },
    { id: "quick_charge",          simpleName: "Nạp nhanh",            displayType: "name_level", color: "<gray>" },
    { id: "piercing",              simpleName: "Xuyên thấu",           displayType: "name_level", color: "<gray>" },
    { id: "density",               simpleName: "Mật độ",               displayType: "name_level", color: "<gray>" },
    { id: "wind_burst",            simpleName: "Bùng gió",             displayType: "name_level", color: "<gray>" },
    { id: "mending",               simpleName: "Vá lành",              displayType: "name_only",  color: "<gray>" },
    { id: "greed",                 simpleName: "Tham lam",             displayType: "name_level", color: "<gray>" },
    { id: "explosive",             simpleName: "Nổ",                   displayType: "name_level", color: "<gray>" },
];

export const ENCHANT_META_MAP = Object.fromEntries(
    ENCHANT_REGISTRY.map((e) => [e.id, e])
) as Record<string, EnchantMeta>;

// Roman numeral helper — mirror defaultLoreProvider Java
const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
export function toRoman(n: number): string {
    return ROMAN[n] ?? `${n}`;
}
