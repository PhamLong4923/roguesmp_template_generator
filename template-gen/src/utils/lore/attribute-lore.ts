// utils/lore/attribute-lore.ts

import {ATTRIBUTE_META_MAP, LoreType} from "@/registry/attribute-registry";

function formatValue(value: number, loreType: LoreType): string {
    const prefix = value > 0 ? "+" : "";
    const num = parseFloat(value.toFixed(3));   // bỏ trailing zero
    if (loreType === "percent") return `${prefix}${(value * 100).toFixed(1)}%`;
    return `${prefix}${num}`;
}

export function buildAttributeLoreLine(id: string, value: number): string | null {
    if (value === 0) return null;
    const meta = ATTRIBUTE_META_MAP[id];
    if (!meta) return `<gray>${id}: ${value}`;   // fallback

    const color = value > 0 ? meta.color.positive : meta.color.negative;
    const formatted = formatValue(value, meta.loreType);
    return `${color}${formatted} ${meta.simpleName}`;
}