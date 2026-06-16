import { Type } from "lucide-react";
import { McTextEditor } from "@/components/item/McTextEditor";
import { ComponentDescriptor } from "./types";

/** Display name. Plugin id "name" → bare string. Always present. */
export const nameComponent: ComponentDescriptor<string> = {
    key: "name",
    label: "Name",
    icon: Type,
    accent: "emerald",
    group: "core",
    alwaysOn: true,
    createDefault: () => "",
    isEmpty: (v) => !v || !v.trim(),
    toJson: (v) => v ?? "",
    fromJson: (raw) => (typeof raw === "string" ? raw : String(raw ?? "")),
    Editor: ({ value, onChange }) => (
        <McTextEditor label="Name" value={value} onChange={onChange} />
    ),
};
