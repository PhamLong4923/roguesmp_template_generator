import { Gem, Plus, Trash2 } from "lucide-react";
import { KeyedNumberMapField } from "@/components/item/fields/KeyedNumberMapField";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Slot, SLOTS } from "@/type/item-creator";
import { ATTRIBUTE_REGISTRY, ATTRIBUTE_META_MAP } from "@/registry/attribute-registry";
import { LoreContributor } from "@/type/lore";
import { ComponentDescriptor } from "./types";

export interface GemData {
    // slot (UPPERCASE) → attribute id → value
    attributes: Record<string, Record<string, number>>;
}

const OPTIONS = ATTRIBUTE_REGISTRY.map((a) => ({ value: a.id, hint: a.simpleName }));

const lore: LoreContributor<GemData> = {
    locationIndex: 105,
    componentKey: "gem_data",
    buildLines: (data) => {
        const lines: { text: string; indent?: boolean }[] = [];
        for (const [slot, map] of Object.entries(data.attributes ?? {})) {
            const entries = Object.entries(map).filter(([, v]) => v !== 0);
            if (entries.length === 0) continue;
            lines.push({ text: `<gray>Khi khảm trang bị ${slot}:` });
            for (const [id, v] of entries) {
                const meta = ATTRIBUTE_META_MAP[id];
                const name = meta?.simpleName ?? id;
                const color = v >= 0 ? "<green>" : "<red>";
                const sign = v >= 0 ? "+" : "";
                lines.push({ text: `${color}${sign}${parseFloat(v.toFixed(3))} ${name}`, indent: true });
            }
        }
        return lines;
    },
};

/** Gem stat bonuses per slot. Plugin id "gem_data" → { attributes: { "<SLOT>": { <id>: num } } }. */
export const gemDataComponent: ComponentDescriptor<GemData> = {
    key: "gem_data",
    label: "Gem Data",
    icon: Gem,
    accent: "fuchsia",
    group: "gem",
    createDefault: () => ({ attributes: {} }),
    isEmpty: (v) =>
        Object.values(v.attributes ?? {}).every((m) => Object.keys(m).length === 0),
    toJson: (v) => {
        const out: Record<string, Record<string, number>> = {};
        for (const [slot, map] of Object.entries(v.attributes ?? {})) {
            const cleaned: Record<string, number> = {};
            for (const [k, val] of Object.entries(map)) if (val !== 0) cleaned[k] = val;
            if (Object.keys(cleaned).length > 0) out[slot] = cleaned;
        }
        return { attributes: out };
    },
    fromJson: (raw) => ({ attributes: (raw as GemData)?.attributes ?? {} }),
    Editor: ({ value, onChange }) => {
        const slots = Object.keys(value.attributes);
        const available = (SLOTS as Slot[]).filter((s) => !(s in value.attributes));

        const addSlot = (s: string) =>
            onChange({ attributes: { ...value.attributes, [s]: {} } });
        const removeSlot = (s: string) => {
            const next = { ...value.attributes };
            delete next[s];
            onChange({ attributes: next });
        };
        const setSlotMap = (s: string, map: Record<string, number>) =>
            onChange({ attributes: { ...value.attributes, [s]: map } });

        return (
            <div className="space-y-3">
                {available.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Select value="" onValueChange={addSlot}>
                            <SelectTrigger className="h-7 w-48 text-xs bg-zinc-900 border-zinc-700 text-zinc-100">
                                <SelectValue placeholder="+ Add slot..." />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                {available.map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs font-mono">{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <span className="text-[11px] text-zinc-600 flex items-center gap-1">
                            <Plus size={11} /> thêm slot khảm
                        </span>
                    </div>
                )}

                {slots.length === 0 && (
                    <p className="text-xs text-zinc-600 italic pl-1">Chưa có slot nào. Chọn slot ở trên để thêm.</p>
                )}

                {slots.map((slot) => (
                    <div key={slot} className="rounded-lg border border-zinc-700/60 bg-zinc-900/40 p-3">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-fuchsia-300">{slot}</span>
                            <Button size="sm" variant="ghost" onClick={() => removeSlot(slot)}
                                    className="h-6 px-2 text-[11px] text-zinc-600 hover:text-red-400 hover:bg-red-900/20 gap-1">
                                <Trash2 size={11} /> Remove
                            </Button>
                        </div>
                        <KeyedNumberMapField
                            value={value.attributes[slot]}
                            onChange={(map) => setSlotMap(slot, map)}
                            options={OPTIONS}
                            step={0.01}
                            defaultValue={0}
                            addLabel="Add attribute"
                        />
                    </div>
                ))}
            </div>
        );
    },
    lore,
};
