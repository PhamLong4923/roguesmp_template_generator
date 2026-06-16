import { Zap } from "lucide-react";
import { FieldRow } from "@/components/item/FieldRow";
import { EffectList } from "@/components/item/EffectList";
import { SelectField } from "@/components/item/fields/SelectField";
import { Separator } from "@/components/ui/separator";
import { Consumable, Effect } from "@/data/cpn/consumable";
import { ItemUseAnimation, ITEM_USE_ANIMATIONS } from "@/type/item-creator";
import { CONSUMABLE_FIELDS, DEFAULT_CONSUMABLE } from "@/constants/item-creator";
import { consumableLoreContributor } from "@/utils/lore/consumable-contributor";
import { ComponentDescriptor } from "./types";

type ConsumableField = keyof Omit<Consumable, "effects" | "animation">;

/** Consumable / food. Plugin id "consumable" → full object with effects[]. */
export const consumableComponent: ComponentDescriptor<Consumable> = {
    key: "consumable",
    label: "Consumable",
    icon: Zap,
    accent: "amber",
    group: "consume",
    createDefault: () => ({ ...DEFAULT_CONSUMABLE, effects: [] }),
    toJson: (v) => v,
    fromJson: (raw) => {
        const c = raw as Partial<Consumable>;
        return {
            ...DEFAULT_CONSUMABLE,
            ...c,
            effects: Array.isArray(c?.effects) ? c.effects : Object.values(c?.effects ?? {}),
        };
    },
    Editor: ({ value, onChange }) => {
        const setField = <K extends ConsumableField>(key: K, val: Consumable[K]) =>
            onChange({ ...value, [key]: val });

        return (
            <div className="space-y-3">
                <div className="space-y-0.5">
                    {CONSUMABLE_FIELDS.map((f) => (
                        <FieldRow
                            key={f.key}
                            label={f.key}
                            type={f.type}
                            value={value[f.key as ConsumableField] as string | number | boolean}
                            onChange={(val) => setField(f.key as ConsumableField, val as never)}
                        />
                    ))}
                    <div className="pt-2">
                        <SelectField
                            inline
                            label="animation"
                            value={value.animation}
                            onChange={(a) => onChange({ ...value, animation: a as ItemUseAnimation })}
                            options={ITEM_USE_ANIMATIONS as unknown as string[]}
                        />
                    </div>
                </div>
                <Separator className="bg-zinc-800" />
                <EffectList
                    effects={value.effects}
                    onChange={(effects: Effect[]) => onChange({ ...value, effects })}
                />
            </div>
        );
    },
    lore: consumableLoreContributor,
};
