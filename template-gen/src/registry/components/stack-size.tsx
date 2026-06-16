import { Layers } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Max stack size. Plugin id "stack_size" → bare int. */
export const stackSizeComponent: ComponentDescriptor<number> = {
    key: "stack_size",
    label: "Stack Size",
    icon: Layers,
    accent: "teal",
    group: "stats",
    createDefault: () => 64,
    isEmpty: (v) => !v || v <= 0,
    toJson: (v) => Math.trunc(v),
    fromJson: (raw) => Number(raw) || 0,
    Editor: ({ value, onChange }) => (
        <ScalarField label="Max stack size" type="number" value={value}
                     onChange={(v) => onChange(v as number)} hint="1–99" />
    ),
};
