import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Enchant } from "@/data/cpn/enchant";
import {ENCHANT_REGISTRY} from "@/registry/enchant-registry";

interface EnchantListProps {
    enchant: Record<string, number>;
    onChange: (enchant: Record<string, number>) => void;
}

export function EnchantList({ enchant, onChange }: EnchantListProps) {
    const entries = Object.entries(enchant); // [id, level][]

    const usedIds = new Set(Object.keys(enchant));
    const available = ENCHANT_REGISTRY.filter((e) => !usedIds.has(e.id));

    const addEnchant = () => {
        if (available.length === 0) return;
        const first = available[0];
        onChange({ ...enchant, [first.id]: 1 });
    };

    const removeEnchant = (id: string) => {
        const next = { ...enchant };
        delete next[id];
        onChange(next);
    };

    const changeId = (oldId: string, newId: string) => {
        const next = { ...enchant };
        const level = next[oldId];
        delete next[oldId];
        next[newId] = level;
        onChange(next);
    };

    const changeLevel = (id: string, level: number) => {
        onChange({ ...enchant, [id]: Math.max(1, level) });
    };

    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                    Enchants
                    <Badge className="ml-2 text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">
                        {entries.length}
                    </Badge>
                </p>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={addEnchant}
                    disabled={available.length === 0}
                    className="h-6 px-2 text-[11px] text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 gap-1"
                >
                    <Plus size={11} />
                    Add Enchant
                </Button>
            </div>

            {entries.length === 0 && (
                <p className="text-xs text-zinc-600 italic pl-1">
                    Chưa có enchant nào. Nhấn "+ Add Enchant" để thêm.
                </p>
            )}

            {/* Enchant rows */}
            <div className="space-y-1.5">
                {entries.map(([id, level]) => {
                    // dropdown options: enchant hiện tại + các enchant chưa dùng
                    const options = ENCHANT_REGISTRY.filter(
                        (e) => e.id === id || !usedIds.has(e.id)
                    );

                    return (
                        <div
                            key={id}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700/60 bg-zinc-900/50"
                        >
                            {/* Enchant id dropdown */}
                            <Select value={id} onValueChange={(newId) => changeId(id, newId)}>
                                <SelectTrigger className="h-7 flex-1 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 font-mono">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                    {options.map((e) => (
                                        <SelectItem key={e.id} value={e.id} className="text-xs">
                                            <span className="font-mono">{e.id}</span>
                                            <span className="text-zinc-500 ml-2">{e.simpleName}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Level input */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Label className="text-[10px] text-zinc-500">Lv</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={level}
                                    onChange={(e) => changeLevel(id, parseInt(e.target.value) || 1)}
                                    className="h-7 w-16 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2 text-center"
                                />
                            </div>

                            {/* Remove */}
                            <button
                                type="button"
                                onClick={() => removeEnchant(id)}
                                className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}