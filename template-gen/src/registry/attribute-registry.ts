// data/registry/attribute-registry.ts

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

export const ATTRIBUTE_REGISTRY: AttributeMeta[] = [
    {
        id: "attack_knockback",
        simpleName: "Đẩy lùi",
        loreType: "flat",
        color: { positive: "<blue>", negative: "<red>" },
    },
    {
        id: "attack_speed_base",
        simpleName: "Tốc độ tấn công",
        loreType: "flat",
        color: { positive: "<blue>", negative: "<red>" },
    },
    {
        id: "max_health_flat",
        simpleName: "Máu tối đa",
        loreType: "flat",
        color: { positive: "<green>", negative: "<red>" },
    },
    {
        id: "max_health_percent",
        simpleName: "Máu tối đa",
        loreType: "percent",
        color: { positive: "<green>", negative: "<red>" },
    },
    {
        id: "speed_flat",
        simpleName: "Tốc độ",
        loreType: "flat",
        color: { positive: "<green>", negative: "<red>" },
    },
    {
        id: "speed_percent",
        simpleName: "Tốc độ",
        loreType: "percent",
        color: { positive: "<green>", negative: "<red>" },
    },
    {
        id: "melee_damage_base",
        simpleName: "Sát thương cận chiến",
        loreType: "flat",
        color: { positive: "<blue>", negative: "<red>" },
    },
    {
        id: "defense_flat",
        simpleName: "Phòng thủ",
        loreType: "flat",
        color: { positive: "<blue>", negative: "<red>" },
    },
    {
        id: "critical_damage_flat",
        simpleName: "Sát thương chí mạng",
        loreType: "flat",
        color: { positive: "<blue>", negative: "<red>" },
    },
    // ... các attribute còn lại
];

export const ATTRIBUTE_META_MAP = Object.fromEntries(
    ATTRIBUTE_REGISTRY.map((a) => [a.id, a])
) as Record<string, AttributeMeta>;