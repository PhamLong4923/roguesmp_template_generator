import { Wallet } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Currency wallet type. Plugin id "wallet" → bare string. */
export const walletComponent: ComponentDescriptor<string> = {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,
    accent: "amber",
    group: "cosmetic",
    createDefault: () => "",
    isEmpty: (v) => !v || !v.trim(),
    toJson: (v) => v,
    fromJson: (raw) => String(raw ?? ""),
    Editor: ({ value, onChange }) => (
        <ScalarField label="Currency type" type="string" value={value}
                     onChange={(v) => onChange(v as string)} />
    ),
};
