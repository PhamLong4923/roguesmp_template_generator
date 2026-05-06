import {LoreContributor, LoreLine} from "@/type/lore";
import {Consumable} from "@/data/cpn/consumable";
import {buildEffectDisplay} from "@/utils/lore/effect-displayer";
import {Attribute, Attributes} from "@/data/cpn/attribute";
import {ATTRIBUTE_REGISTRY} from "@/registry/attribute-registry";
import {buildAttributeLoreLine} from "@/utils/lore/attribute-lore";

export const consumableLoreContributor: LoreContributor<Consumable> = {
    locationIndex: 5,
    componentKey: "consumable",
    buildLines: (data) => {
        if (data.effects.length === 0) return [];
        const lines: LoreLine[] = [{ text: "<gray>Khi sử dụng:" }];
        for (const eff of data.effects) {
            if (!eff.display) continue;
            const display  = buildEffectDisplay(eff);
            const duration = formatDuration(eff.duration);
            lines.push({ text: `${display} <gray>(${duration})`, indent: true });
        }
        return lines;
    },
}

export const attributeLoreContributor: LoreContributor<Attribute> = {
    locationIndex: 100,
    componentKey: "attribute",
    buildLines: (data) => {
        const lines: LoreLine[] = [];

        // Giữ thứ tự theo ATTRIBUTE_REGISTRY thay vì Object.entries random
        for (const meta of ATTRIBUTE_REGISTRY) {
            const value = data.attributes[meta.id as keyof Attributes];
            if (value === undefined || value === 0) continue;

            const line = buildAttributeLoreLine(meta.id, value);
            if (line) lines.push({ text: line });
        }

        if (lines.length === 0) return [];

        // Thêm header "Khi cầm:" trước danh sách
        return [
            { text: `<gray>Khi cầm (${data.slot}):` },
            ...lines,
        ];
    },
};

export function formatDuration(ticks: number): string {
    const totalSeconds = Math.floor(ticks / 20);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes === 0) return `${seconds}s`;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}