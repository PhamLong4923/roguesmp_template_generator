import { Wrench } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Max durability. Plugin id "durability" → bare int. */
export const durabilityComponent: ComponentDescriptor<number> = {
    key: "durability",
    label: "Durability",
    icon: Wrench,
    accent: "orange",
    group: "stats",
    createDefault: () => 100,
    isEmpty: (v) => !v || v <= 0,
    toJson: (v) => Math.trunc(v),
    fromJson: (raw) => Number(raw) || 0,
    Editor: ({ value, onChange }) => (
        <ScalarField label="Max durability" type="number" value={value}
                     onChange={(v) => onChange(v as number)} />
    ),
};
