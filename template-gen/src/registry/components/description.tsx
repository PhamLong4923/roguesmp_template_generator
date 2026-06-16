import { AlignLeft } from "lucide-react";
import { McTextEditor } from "@/components/item/McTextEditor";
import { LoreContributor } from "@/type/lore";
import { ComponentDescriptor } from "./types";

const lore: LoreContributor<string[]> = {
    locationIndex: 1,
    componentKey: "description",
    buildLines: (data) => (data ?? []).filter((l) => l.trim()).map((text) => ({ text })),
};

/** Lore description lines. Plugin id "description" → string[]. */
export const descriptionComponent: ComponentDescriptor<string[]> = {
    key: "description",
    label: "Description",
    icon: AlignLeft,
    accent: "zinc",
    group: "core",
    createDefault: () => [],
    isEmpty: (v) => !v || v.filter((l) => l.trim()).length === 0,
    toJson: (v) => (v ?? []).filter((l) => l.trim()),
    fromJson: (raw) =>
        Array.isArray(raw) ? raw.map(String) : typeof raw === "string" ? [raw] : [],
    Editor: ({ value, onChange }) => (
        <McTextEditor
            label="Description"
            multiline
            value={(value ?? []).join("\n")}
            onChange={(s) => onChange(s.split("\n"))}
        />
    ),
    lore,
};
