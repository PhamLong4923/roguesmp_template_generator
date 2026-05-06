// data/registry/effect-registry.ts

export type EffectValueFormat = "percent" | "flat";

export interface EffectMeta {
    id: string;
    simpleName: string;
    valueFormat: EffectValueFormat;
    positiveColor: string;
    negativeColor: string;
}

export const EFFECT_REGISTRY: EffectMeta[] = [
    {
        id: "speed",
        simpleName: "tốc chạy",
        valueFormat: "percent",          // value * 100
        positiveColor: "<green>",
        negativeColor: "<red>",
    },
    {
        id: "damage_increase",
        simpleName: "sát thương",
        valueFormat: "flat",             // value thẳng
        positiveColor: "<green>",
        negativeColor: "<red>",
    },
    // thêm effect mới vào đây
];

export const EFFECT_META_MAP = Object.fromEntries(
    EFFECT_REGISTRY.map((e) => [e.id, e])
) as Record<string, EffectMeta>;