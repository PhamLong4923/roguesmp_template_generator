import {ENCHANT_META_MAP, toRoman} from "@/registry/enchant-registry";

export function buildEnchantDisplay(id: string, level: number): string | null {
    if (level <= 0) return null;

    const meta = ENCHANT_META_MAP[id];
    if (!meta) return `<gray>${id} ${toRoman(level)}`;

    switch (meta.displayType) {
        case "name_only":
            // AquaAffinity — chỉ hiện tên, không có level
            return `${meta.color}${meta.simpleName}`;

        case "name_level":
            // BaneOfArthropods — "Diệt chân đốt II"
            return `${meta.color}${meta.simpleName} ${toRoman(level)}`;

        case "name_level_value":
            // nếu sau này cần hiện value — "Tên II (+4 dmg)"
            const val = (meta.valuePerLevel ?? 0) * level;
            return `${meta.color}${meta.simpleName} ${toRoman(level)} <dark_gray>(+${val}${meta.valueUnit ?? ""})`;
    }
}