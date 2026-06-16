import { Sword } from "lucide-react";
import { KeyedNumberMapField } from "@/components/item/fields/KeyedNumberMapField";
import { SelectField } from "@/components/item/fields/SelectField";
import { Attribute } from "@/data/cpn/attribute";
import { Slot, SLOTS } from "@/type/item-creator";
import { ATTRIBUTE_REGISTRY } from "@/registry/attribute-registry";
import { attributeLoreContributor } from "@/utils/lore/consumable-contributor";
import { ComponentDescriptor } from "./types";

const OPTIONS = ATTRIBUTE_REGISTRY.map((a) => ({ value: a.id, hint: a.simpleName }));

/** Equip attributes. Plugin id "attribute" → { attributes: { <id>: num }, slot: "MAINHAND" }. */
export const attributeComponent: ComponentDescriptor<Attribute> = {
    key: "attribute",
    label: "Attribute",
    icon: Sword,
    accent: "sky",
    group: "stats",
    createDefault: () => ({ attributes: {}, slot: "MAINHAND" }),
    isEmpty: (v) => Object.keys(v.attributes ?? {}).length === 0,
    toJson: (v) => {
        // strip effective-zero entries; keep the plugin's { attributes, slot } shape
        const attributes: Record<string, number> = {};
        for (const [k, val] of Object.entries(v.attributes ?? {})) {
            if (val !== 0) attributes[k] = val;
        }
        return { attributes, slot: v.slot };
    },
    fromJson: (raw) => ({
        attributes: (raw as Attribute)?.attributes ?? {},
        slot: ((raw as Attribute)?.slot ?? "MAINHAND") as Slot,
    }),
    Editor: ({ value, onChange }) => (
        <div className="space-y-3">
            <SelectField
                inline
                label="Slot"
                value={value.slot}
                onChange={(slot) => onChange({ ...value, slot: slot as Slot })}
                options={SLOTS as unknown as string[]}
            />
            <KeyedNumberMapField
                label="Attributes"
                value={value.attributes}
                onChange={(attributes) => onChange({ ...value, attributes })}
                options={OPTIONS}
                step={0.01}
                defaultValue={0}
                addLabel="Add attribute"
            />
        </div>
    ),
    lore: attributeLoreContributor,
};
