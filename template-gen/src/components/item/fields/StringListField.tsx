import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface StringListFieldProps {
    label?: string;
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    addLabel?: string;
}

/** Ordered list of string rows with add/remove/move. Used by the description component. */
export function StringListField({ label, value, onChange, placeholder, addLabel }: StringListFieldProps): JSX.Element {
    const rows = value ?? [];

    const update = (i: number, text: string) => onChange(rows.map((r, j) => (j === i ? text : r)));
    const remove = (i: number) => onChange(rows.filter((_, j) => j !== i));
    const add = () => onChange([...rows, ""]);
    const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= rows.length) return;
        const next = [...rows];
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                    {label ?? "Lines"}
                    <Badge className="ml-2 text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{rows.length}</Badge>
                </p>
                <Button size="sm" variant="ghost" onClick={add}
                        className="h-6 px-2 text-[11px] text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20 gap-1">
                    <Plus size={11} /> {addLabel ?? "Add line"}
                </Button>
            </div>

            {rows.length === 0 && (
                <p className="text-xs text-zinc-600 italic pl-1">Chưa có dòng nào.</p>
            )}

            <div className="space-y-1.5">
                {rows.map((row, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                        <span className="text-[10px] text-zinc-600 w-5 text-right font-mono">{i + 1}</span>
                        <Input
                            value={row}
                            onChange={(e) => update(i, e.target.value)}
                            placeholder={placeholder ?? "<gray>..."}
                            className="h-7 flex-1 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 font-mono px-2"
                        />
                        <div className="flex flex-col">
                            <button type="button" onClick={() => move(i, -1)}
                                    className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30" disabled={i === 0}>
                                <ChevronUp size={11} />
                            </button>
                            <button type="button" onClick={() => move(i, 1)}
                                    className="text-zinc-600 hover:text-zinc-300 disabled:opacity-30" disabled={i === rows.length - 1}>
                                <ChevronDown size={11} />
                            </button>
                        </div>
                        <button type="button" onClick={() => remove(i)}
                                className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                            <Trash2 size={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
