import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface MapOption {
    value: string;
    label?: string;
    hint?: string;
}

interface KeyedNumberMapFieldProps {
    label?: string;
    value: Record<string, number>;
    onChange: (next: Record<string, number>) => void;
    options: MapOption[];
    /** value input step; use a fraction (e.g. 0.01) for decimals (attributes). */
    step?: number;
    /** minimum value (e.g. 1 for enchant level). */
    min?: number;
    /** default value for a freshly added entry. */
    defaultValue?: number;
    valueLabel?: string;        // short label next to the value input, e.g. "Lv"
    addLabel?: string;
}

/**
 * Editor for `Record<enumId, number>` maps, choosing keys from a fixed option set.
 * Generalizes the old EnchantList and the attribute grid.
 * Serialized 1:1 as the JSON object (`{ "<id>": <number> }`).
 */
export function KeyedNumberMapField({
    label, value, onChange, options, step = 1, min, defaultValue = 1,
    valueLabel, addLabel,
}: KeyedNumberMapFieldProps): JSX.Element {
    const entries = Object.entries(value ?? {});
    const used = new Set(Object.keys(value ?? {}));
    const available = options.filter((o) => !used.has(o.value));

    const add = () => {
        if (available.length === 0) return;
        onChange({ ...value, [available[0].value]: defaultValue });
    };
    const remove = (id: string) => {
        const next = { ...value };
        delete next[id];
        onChange(next);
    };
    const changeId = (oldId: string, newId: string) => {
        const next = { ...value };
        const v = next[oldId];
        delete next[oldId];
        next[newId] = v;
        onChange(next);
    };
    const changeVal = (id: string, v: number) => {
        onChange({ ...value, [id]: min !== undefined ? Math.max(min, v) : v });
    };

    const addColor = "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20";

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                    {label ?? "Entries"}
                    <Badge className="ml-2 text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{entries.length}</Badge>
                </p>
                <Button size="sm" variant="ghost" onClick={add} disabled={available.length === 0}
                        className={`h-6 px-2 text-[11px] gap-1 ${addColor}`}>
                    <Plus size={11} /> {addLabel ?? "Add"}
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-xs text-zinc-600 italic pl-1">Chưa có mục nào.</p>
            )}

            <div className="space-y-1.5">
                {entries.map(([id, v]) => {
                    const opts = options.filter((o) => o.value === id || !used.has(o.value));
                    return (
                        <div key={id} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700/60 bg-zinc-900/50">
                            <Select value={id} onValueChange={(newId) => changeId(id, newId)}>
                                <SelectTrigger className="h-7 flex-1 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                    {opts.map((o) => (
                                        <SelectItem key={o.value} value={o.value} className="text-xs">
                                            <span className="font-mono">{o.value}</span>
                                            {o.hint && <span className="text-zinc-500 ml-2">{o.hint}</span>}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <div className="flex items-center gap-1.5 shrink-0">
                                {valueLabel && <Label className="text-[10px] text-zinc-500">{valueLabel}</Label>}
                                <Input
                                    type="number"
                                    step={step}
                                    min={min}
                                    value={v}
                                    onChange={(e) => changeVal(id, parseFloat(e.target.value) || 0)}
                                    className="h-7 w-20 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2 text-center"
                                />
                            </div>

                            <button type="button" onClick={() => remove(id)}
                                    className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
