import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import type { LoreContributor } from "@/type/lore";

/** Props every component Editor receives. */
export interface ComponentEditorProps<T> {
    value: T;
    onChange: (next: T) => void;
}

/** Icon type — lucide-react icons. */
export type IconType = LucideIcon;

export type ComponentGroup = "core" | "stats" | "gem" | "consume" | "cosmetic";

/**
 * Self-contained definition of a single item component — the web mirror of the plugin's
 * `ItemComponent` + its registered `ComponentCodec`. Bundles everything needed to edit,
 * serialize, deserialize and preview one component.
 *
 * To add a new component: create one descriptor file and register it in `index.ts`.
 */
export interface ComponentDescriptor<T = any> {
    /** JSON key — MUST equal the plugin registry id ("name", "attribute", "enchant", …). */
    key: string;
    label: string;
    icon: IconType;
    /** Tailwind hue token used for accents, e.g. "sky" | "amber" | "purple". */
    accent: string;
    group: ComponentGroup;
    /** When true the component is always serialized and cannot be toggled off (e.g. name). */
    alwaysOn?: boolean;

    /** Fresh default value — never share references. */
    createDefault: () => T;
    /** When true the component is omitted from output JSON even if enabled. */
    isEmpty?: (value: T) => boolean;

    /** Serialize to the EXACT plugin JSON shape (bare value for single-arg components, object otherwise). */
    toJson: (value: T) => unknown;
    /** Parse plugin JSON back into editor state (used by the update/edit flow). */
    fromJson: (raw: unknown) => T;

    Editor: ComponentType<ComponentEditorProps<T>>;
    /** Optional lore contribution (the "display" half). */
    lore?: LoreContributor<T>;
}

/** Hue → tailwind class fragments for accents (text / active dot / checkbox). */
export const ACCENT_CLASS: Record<string, { text: string; dot: string; check: string }> = {
    sky:     { text: "text-sky-400",     dot: "bg-sky-400",     check: "data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600" },
    amber:   { text: "text-amber-400",   dot: "bg-amber-400",   check: "data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" },
    purple:  { text: "text-purple-400",  dot: "bg-purple-400",  check: "data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" },
    emerald: { text: "text-emerald-400", dot: "bg-emerald-400", check: "data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600" },
    rose:    { text: "text-rose-400",    dot: "bg-rose-400",    check: "data-[state=checked]:bg-rose-600 data-[state=checked]:border-rose-600" },
    cyan:    { text: "text-cyan-400",    dot: "bg-cyan-400",    check: "data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600" },
    orange:  { text: "text-orange-400",  dot: "bg-orange-400",  check: "data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" },
    teal:    { text: "text-teal-400",    dot: "bg-teal-400",    check: "data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600" },
    fuchsia: { text: "text-fuchsia-400", dot: "bg-fuchsia-400", check: "data-[state=checked]:bg-fuchsia-600 data-[state=checked]:border-fuchsia-600" },
    zinc:    { text: "text-zinc-400",    dot: "bg-zinc-400",    check: "data-[state=checked]:bg-zinc-600 data-[state=checked]:border-zinc-600" },
};

export const GROUP_LABEL: Record<ComponentGroup, string> = {
    core:     "Core",
    stats:    "Stats",
    gem:      "Gem",
    consume:  "Consumable",
    cosmetic: "Cosmetic",
};
