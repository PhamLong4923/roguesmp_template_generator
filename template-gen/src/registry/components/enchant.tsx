import { Sparkles } from "lucide-react";
import { KeyedNumberMapField } from "@/components/item/fields/KeyedNumberMapField";
import { Enchant } from "@/data/cpn/enchant";
import { ENCHANT_REGISTRY } from "@/registry/enchant-registry";
import { enchantLoreContributor } from "@/utils/lore/enchant-contributor";
import { ComponentDescriptor } from "./types";

const OPTIONS = ENCHANT_REGISTRY.map((e) => ({ value: e.id, hint: e.simpleName }));

/** Enchantments. Plugin id "enchant" → { enchants: { <id>: level } }. */
export const enchantComponent: ComponentDescriptor<Enchant> = {
    key: "enchant",
    label: "Enchant",
    icon: Sparkles,
    accent: "purple",
    group: "stats",
    createDefault: () => ({ enchants: {} }),
    isEmpty: (v) => Object.keys(v.enchants ?? {}).length === 0,
    toJson: (v) => ({ enchants: v.enchants }),
    fromJson: (raw) => ({
        enchants: (raw as Enchant)?.enchants ?? {},
    }),
    Editor: ({ value, onChange }) => (
        <KeyedNumberMapField
            label="Enchants"
            value={value.enchants}
            onChange={(enchants) => onChange({ enchants })}
            options={OPTIONS}
            min={1}
            step={1}
            defaultValue={1}
            valueLabel="Lv"
            addLabel="Add enchant"
        />
    ),
    lore: enchantLoreContributor,
};
