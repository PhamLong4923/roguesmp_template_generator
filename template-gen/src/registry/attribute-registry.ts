// data/registry/attribute-registry.ts
//
// Mirror of RogueSmpCore `com.roguesmp.constant.Attributes` (@SerializedName ids).
// The `id` strings MUST match the plugin's @SerializedName exactly — they become the
// JSON keys inside the "attribute" component, so the generated JSON imports directly.

export type LoreType = "flat" | "percent" | "none";

export interface AttributeMeta {
    id: string;
    simpleName: string;       // mirror getSimpleName() Java
    loreType: LoreType;       // flat = +X, percent = +X%
    color: {
        positive: string;
        negative: string;
    };
}

const OFFENSE = { positive: "<blue>", negative: "<red>" };
const VITALS = { positive: "<green>", negative: "<red>" };

export const ATTRIBUTE_REGISTRY: AttributeMeta[] = [
    // --- COMBAT & OFFENSE ---
    { id: "melee_damage_base",         simpleName: "Sát thương cận chiến",   loreType: "flat",    color: OFFENSE },
    { id: "attack_speed_base",         simpleName: "Tốc độ tấn công",        loreType: "flat",    color: OFFENSE },
    { id: "projectile_damage_base",    simpleName: "Sát thương phóng",       loreType: "flat",    color: OFFENSE },
    { id: "projectile_speed_base",     simpleName: "Tốc độ phóng",           loreType: "flat",    color: OFFENSE },
    { id: "throw_rate_base",           simpleName: "Tốc độ ném",             loreType: "flat",    color: OFFENSE },
    { id: "throw_rate_percent",        simpleName: "Tốc độ ném",             loreType: "percent", color: OFFENSE },
    { id: "projectile_damage_percent", simpleName: "Sát thương phóng",       loreType: "percent", color: OFFENSE },
    { id: "projectile_speed_percent",  simpleName: "Tốc độ phóng",           loreType: "percent", color: OFFENSE },
    { id: "crit_damage_flat",          simpleName: "Sát thương chí mạng",    loreType: "flat",    color: OFFENSE },
    { id: "attack_knockback",          simpleName: "Đẩy lùi",                loreType: "flat",    color: OFFENSE },
    { id: "sweeping_damage_ratio",     simpleName: "Sát thương chém quét",   loreType: "percent", color: OFFENSE },

    // --- DEFENSE & VITALS ---
    { id: "defense_flat",          simpleName: "Phòng thủ",        loreType: "flat",    color: VITALS },
    { id: "max_health_flat",       simpleName: "Máu tối đa",       loreType: "flat",    color: VITALS },
    { id: "max_health_percent",    simpleName: "Máu tối đa",       loreType: "percent", color: VITALS },
    { id: "knockback_resistance",  simpleName: "Kháng đẩy lùi",    loreType: "flat",    color: VITALS },

    // --- LAND MOVEMENT ---
    { id: "speed_flat",          simpleName: "Tốc độ",                loreType: "flat",    color: VITALS },
    { id: "speed_percent",       simpleName: "Tốc độ",                loreType: "percent", color: VITALS },
    { id: "sneaking_speed",      simpleName: "Tốc độ lén",            loreType: "flat",    color: VITALS },
    { id: "movement_efficiency", simpleName: "Hiệu suất di chuyển",   loreType: "flat",    color: VITALS },

    // --- VERTICAL & PHYSICS ---
    { id: "jump_strength",      simpleName: "Sức nhảy",            loreType: "flat", color: VITALS },
    { id: "gravity",            simpleName: "Trọng lực",           loreType: "flat", color: VITALS },
    { id: "step_height",        simpleName: "Độ cao bước",         loreType: "flat", color: VITALS },
    { id: "fall_damage",        simpleName: "Sát thương rơi",      loreType: "flat", color: VITALS },
    { id: "safe_fall_distance", simpleName: "Khoảng rơi an toàn",  loreType: "flat", color: VITALS },

    // --- AQUATIC ---
    { id: "water_movement_efficiency", simpleName: "Di chuyển dưới nước",   loreType: "flat", color: VITALS },
    { id: "submerged_mining_speed",    simpleName: "Tốc độ đào dưới nước",  loreType: "flat", color: VITALS },
    { id: "oxygen_bonus",              simpleName: "Oxy thêm",              loreType: "flat", color: VITALS },

    // --- UTILITY & WORLD ---
    { id: "entity_reach", simpleName: "Tầm với thực thể", loreType: "flat", color: VITALS },
    { id: "block_reach",  simpleName: "Tầm với khối",     loreType: "flat", color: VITALS },
    { id: "burning_time", simpleName: "Thời gian cháy",   loreType: "flat", color: VITALS },
    { id: "scale",        simpleName: "Kích thước",       loreType: "flat", color: VITALS },
    { id: "luck",         simpleName: "May mắn",          loreType: "flat", color: VITALS },
];

export const ATTRIBUTE_KEYS: string[] = ATTRIBUTE_REGISTRY.map((a) => a.id);

export const ATTRIBUTE_META_MAP = Object.fromEntries(
    ATTRIBUTE_REGISTRY.map((a) => [a.id, a])
) as Record<string, AttributeMeta>;
