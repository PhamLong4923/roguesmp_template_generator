import { FlaskConical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectField } from "@/components/item/fields/SelectField";
import { ComponentDescriptor } from "./types";

export interface StoredEffect {
    effectType: string;
    duration: number; // ticks
    amplifier: number; // level - 1
}
export interface PotionContent {
    color: string; // "a,r,g,b"
    effects: StoredEffect[];
}

// Common vanilla mob-effect ids (minecraft namespace assumed by the plugin).
const EFFECT_TYPES = [
    "speed", "slowness", "haste", "mining_fatigue", "strength", "instant_health",
    "instant_damage", "jump_boost", "nausea", "regeneration", "resistance",
    "fire_resistance", "water_breathing", "invisibility", "blindness", "night_vision",
    "hunger", "weakness", "poison", "wither", "health_boost", "absorption",
    "saturation", "glowing", "levitation", "luck", "unluck", "slow_falling",
    "conduit_power", "dolphins_grace", "bad_omen", "hero_of_the_village", "darkness",
];

// --- ARGB string <-> hex helpers ---
function parseArgb(s: string): { a: number; r: number; g: number; b: number } {
    const [a = 255, r = 130, g = 80, b = 200] = (s ?? "").split(",").map((n) => parseInt(n, 10) || 0);
    return { a, r, g, b };
}
function toHex({ r, g, b }: { r: number; g: number; b: number }): string {
    const h = (n: number) => n.toString(16).padStart(2, "0");
    return `#${h(r)}${h(g)}${h(b)}`;
}
function fromHex(hex: string): { r: number; g: number; b: number } {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16),
    };
}

/** Potion contents. Plugin id "potion_content" → { color:"a,r,g,b", effects:[{effectType,duration,amplifier}] }. */
export const potionContentComponent: ComponentDescriptor<PotionContent> = {
    key: "potion_content",
    label: "Potion",
    icon: FlaskConical,
    accent: "rose",
    group: "consume",
    createDefault: () => ({ color: "255,130,80,200", effects: [] }),
    toJson: (v) => v,
    fromJson: (raw) => {
        const p = raw as Partial<PotionContent>;
        return {
            color: p?.color ?? "255,130,80,200",
            effects: Array.isArray(p?.effects) ? p.effects : [],
        };
    },
    Editor: ({ value, onChange }) => {
        const argb = parseArgb(value.color);

        const setColorPart = (next: Partial<{ a: number; r: number; g: number; b: number }>) => {
            const c = { ...argb, ...next };
            onChange({ ...value, color: `${c.a},${c.r},${c.g},${c.b}` });
        };

        const addEffect = () =>
            onChange({ ...value, effects: [...value.effects, { effectType: "speed", duration: 200, amplifier: 0 }] });
        const removeEffect = (i: number) =>
            onChange({ ...value, effects: value.effects.filter((_, j) => j !== i) });
        const updateEffect = (i: number, patch: Partial<StoredEffect>) =>
            onChange({ ...value, effects: value.effects.map((e, j) => (j === i ? { ...e, ...patch } : e)) });

        return (
            <div className="space-y-3">
                {/* Color */}
                <div className="flex items-center gap-3">
                    <Label className="text-xs text-zinc-400 w-16 shrink-0">Color</Label>
                    <input
                        type="color"
                        value={toHex(argb)}
                        onChange={(e) => setColorPart(fromHex(e.target.value))}
                        className="h-7 w-12 rounded bg-zinc-900 border border-zinc-700 cursor-pointer"
                    />
                    <div className="w-20">
                        <Input
                            type="number" min={0} max={255}
                            value={argb.a}
                            onChange={(e) => setColorPart({ a: parseInt(e.target.value, 10) || 0 })}
                            className="h-7 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2"
                        />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-mono">alpha · {value.color}</span>
                </div>

                {/* Effects */}
                <div className="flex items-center justify-between">
                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                        Effects
                        <Badge className="ml-2 text-[10px] bg-zinc-800 text-zinc-400 border-zinc-700">{value.effects.length}</Badge>
                    </p>
                    <Button size="sm" variant="ghost" onClick={addEffect}
                            className="h-6 px-2 text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-900/20 gap-1">
                        <Plus size={11} /> Add effect
                    </Button>
                </div>

                <div className="space-y-1.5">
                    {value.effects.map((eff, i) => (
                        <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-700/60 bg-zinc-900/50">
                            <div className="flex-1">
                                <SelectField
                                    value={eff.effectType}
                                    onChange={(t) => updateEffect(i, { effectType: t })}
                                    options={EFFECT_TYPES}
                                />
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Label className="text-[10px] text-zinc-500">dur</Label>
                                <Input type="number" value={eff.duration}
                                       onChange={(e) => updateEffect(i, { duration: parseInt(e.target.value, 10) || 0 })}
                                       className="h-7 w-20 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2 text-center" />
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                                <Label className="text-[10px] text-zinc-500">amp</Label>
                                <Input type="number" value={eff.amplifier}
                                       onChange={(e) => updateEffect(i, { amplifier: parseInt(e.target.value, 10) || 0 })}
                                       className="h-7 w-16 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2 text-center" />
                            </div>
                            <button type="button" onClick={() => removeEffect(i)}
                                    className="p-1 rounded text-zinc-600 hover:text-red-400 hover:bg-red-900/20 transition-colors">
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    },
};
