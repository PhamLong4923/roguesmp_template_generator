import { Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";import { Badge } from "@/components/ui/badge";
import { Effect } from "@/data/cpn/consumable";
import { EFFECT_FIELDS, makeDefaultEffect } from "@/constants/item-creator";
import { FieldRow } from "./FieldRow";
import {EFFECT_REGISTRY} from "@/registry/effect-registry";

interface EffectListProps {
    effects: Effect[];
    onChange: (effects: Effect[]) => void;
}

export function EffectList({ effects, onChange }: EffectListProps) {
    // track which effect panels are collapsed
    const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

    const addEffect = () => {
        onChange([...effects, makeDefaultEffect()]);
    };

    const removeEffect = (index: number) => {
        onChange(effects.filter((_, i) => i !== index));
        setCollapsed((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const updateEffect = <K extends keyof Effect>(index: number, key: K, val: Effect[K]) => {
        onChange(effects.map((eff, i) => i === index ? { ...eff, [key]: val } : eff));
    };

    const toggleCollapse = (index: number) =>
        setCollapsed((prev) => ({ ...prev, [index]: !prev[index] }));

    return (
        <div className="space-y-2">
            {/* Header row */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                    Effects
                    <Badge className="ml-2 text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">
                        {effects.length}
                    </Badge>
                </p>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={addEffect}
                    className="h-6 px-2 text-[11px] text-amber-400 hover:text-amber-300 hover:bg-amber-900/20 gap-1"
                >
                    <Plus size={11} />
                    Add Effect
                </Button>
            </div>

            {effects.length === 0 && (
                <p className="text-xs text-zinc-600 italic pl-1">
                    Chưa có effect nào. Nhấn "+ Add Effect" để thêm.
                </p>
            )}

            {/* Effect cards */}
            <div className="space-y-2">
                {effects.map((eff, index) => {
                    const isCollapsed = collapsed[index];
                    // label hiển thị: dùng id nếu có, fallback về index
                    const label = eff.id ? eff.id : `effect_${index + 1}`;

                    return (
                        <div
                            key={index}
                            className="rounded-lg border border-zinc-700/60 bg-zinc-900/50 overflow-hidden"
                        >
                            {/* Card header */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50">
                                <button
                                    type="button"
                                    onClick={() => toggleCollapse(index)}
                                    className="flex items-center gap-1.5 flex-1 text-left"
                                >
                                    {isCollapsed
                                        ? <ChevronDown size={12} className="text-zinc-500" />
                                        : <ChevronUp   size={12} className="text-zinc-500" />
                                    }
                                    <span className="text-xs font-mono text-amber-300/80">
                                        #{index + 1}
                                    </span>
                                    <span className="text-xs text-zinc-400 font-mono truncate">
                                        {label}
                                    </span>
                                    {eff.value !== 0 && (
                                        <Badge className="text-[10px] bg-zinc-700 text-zinc-300 border-zinc-600 ml-1">
                                            ×{eff.value}
                                        </Badge>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeEffect(index)}
                                    className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>

                            {/* Card body */}
                            {!isCollapsed && (
                                <div className="px-3 py-2 space-y-0.5 border-t border-zinc-700/40">
                                    <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-zinc-800/60 group">
                                        <Label className="text-xs text-zinc-400 w-44 shrink-0 group-hover:text-zinc-300">
                                            id
                                        </Label>
                                        <Select
                                            value={eff.id}
                                            onValueChange={(v) => updateEffect(index, "id", v)}
                                        >
                                            <SelectTrigger className="h-6 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2">
                                                <SelectValue placeholder="Chọn effect..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                {EFFECT_REGISTRY.map((e) => (
                                                    <SelectItem key={e.id} value={e.id} className="text-xs font-mono">
                                                        <span className="font-mono">{e.id}</span>
                                                        <span className="text-zinc-500 ml-2">{e.simpleName}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* các field còn lại — bỏ qua id */}
                                    {EFFECT_FIELDS.filter((f) => f.key !== "id").map((f) => (
                                        <FieldRow
                                            key={f.key}
                                            label={f.key}
                                            type={f.type}
                                            value={eff[f.key as keyof Effect] as string | number | boolean}
                                            onChange={(v) => updateEffect(index, f.key as keyof Effect, v as never)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}