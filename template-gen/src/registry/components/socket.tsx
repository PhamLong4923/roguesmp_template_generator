import { CircleDot } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Gem socket count. Plugin id "socket" → bare int. */
export const socketComponent: ComponentDescriptor<number> = {
    key: "socket",
    label: "Gem Socket",
    icon: CircleDot,
    accent: "fuchsia",
    group: "gem",
    createDefault: () => 1,
    isEmpty: (v) => !v || v <= 0,
    toJson: (v) => Math.trunc(v),
    fromJson: (raw) => Number(raw) || 0,
    Editor: ({ value, onChange }) => (
        <ScalarField label="Socket count" type="number" value={value}
                     onChange={(v) => onChange(v as number)} />
    ),
};
