// utils/lore/effect-displayer.ts

import { Effect } from "@/data/cpn/consumable";
import {EFFECT_META_MAP} from "@/registry/effect-registry";

function formatDecimal(n: number): string {
    // mirror Utils.formatDecimal — bỏ trailing zero
    return parseFloat(n.toFixed(2)).toString();
}

export function buildEffectDisplay(eff: Effect): string {
    const meta = EFFECT_META_MAP[eff.id];

    if (!meta) return `<gray>${eff.id}`;

    const color  = eff.value > 0 ? meta.positiveColor : meta.negativeColor;
    const prefix = eff.value > 0 ? "+" : "";

    let formatted: string;
    if (meta.valueFormat === "percent") {
        // SpeedEffect: value * 100 + "%"
        formatted = `${prefix}${formatDecimal(eff.value * 100)}% ${meta.simpleName}`;
    } else {
        // DamageIncreaseEffect: value
        formatted = `${prefix}${formatDecimal(eff.value)} ${meta.simpleName}`;
    }

    return `${color}${formatted}`;
}