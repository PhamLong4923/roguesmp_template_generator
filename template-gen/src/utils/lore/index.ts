import {attributeLoreContributor, consumableLoreContributor} from "@/utils/lore/consumable-contributor";
import {enchantLoreContributor} from "@/utils/lore/enchant-contributor";

export const LORE_CONTRIBUTORS = [
    enchantLoreContributor,
    consumableLoreContributor,
    attributeLoreContributor,
].sort((a, b) => a.locationIndex - b.locationIndex);