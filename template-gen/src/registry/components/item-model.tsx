import { Box } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Custom item model key. Plugin id "item_model" → bare string (e.g. "namespace:path"). */
export const itemModelComponent: ComponentDescriptor<string> = {
    key: "item_model",
    label: "Item Model",
    icon: Box,
    accent: "rose",
    group: "cosmetic",
    createDefault: () => "",
    isEmpty: (v) => !v || !v.trim(),
    toJson: (v) => v,
    fromJson: (raw) => String(raw ?? ""),
    Editor: ({ value, onChange }) => (
        <ScalarField label="Model key" type="string" value={value}
                     onChange={(v) => onChange(v as string)}
                     hint="vd: minecraft:diamond_sword" />
    ),
};
