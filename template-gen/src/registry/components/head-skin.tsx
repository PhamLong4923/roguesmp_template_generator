import { User } from "lucide-react";
import { ScalarField } from "@/components/item/fields/ScalarField";
import { ComponentDescriptor } from "./types";

/** Player head skin id. Plugin id "head_skin" → bare string. */
export const headSkinComponent: ComponentDescriptor<string> = {
    key: "head_skin",
    label: "Head Skin",
    icon: User,
    accent: "cyan",
    group: "cosmetic",
    createDefault: () => "",
    isEmpty: (v) => !v || !v.trim(),
    toJson: (v) => v,
    fromJson: (raw) => String(raw ?? ""),
    Editor: ({ value, onChange }) => (
        <ScalarField label="Skin id / texture" type="string" value={value}
                     onChange={(v) => onChange(v as string)}
                     hint="base64 texture value hoặc skin id" />
    ),
};
