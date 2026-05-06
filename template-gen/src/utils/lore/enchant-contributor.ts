import { LoreContributor, LoreLine } from "@/type/lore";
import { Enchant } from "@/data/cpn/enchant";
import { buildEnchantDisplay } from "@/utils/lore/enchant-displayer";
import {ENCHANT_REGISTRY} from "@/registry/enchant-registry";

export const enchantLoreContributor: LoreContributor<Enchant> = {
    locationIndex: 3,
    componentKey: "enchant",
    buildLines: (data) => {
        const lines: LoreLine[] = [];

        const enchants = data.enchants ?? {};

        for (const meta of ENCHANT_REGISTRY) {
            const level = enchants[meta.id];
            if (!level || level <= 0) continue;

            const line = buildEnchantDisplay(meta.id, level);
            if (line) lines.push({ text: line });
        }

        return lines;
    },
};