import {useState, useCallback} from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Switch} from "@/components/ui/switch";
import {Textarea} from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Save, RefreshCw, Code2, Sword, Zap, Sparkles} from "lucide-react";
import {useCreateItem} from "@/hooks/use-item";
import {Item} from "@/data/Item";
import {Attributes, Attribute} from "@/data/cpn/attribute";
import {Consumable, Effect} from "@/data/cpn/consumable";

// ─── Types ────────────────────────────────────────────────────────────────────

type Slot = "MAINHAND" | "OFFHAND";

interface McColor {
    tag: string;
    label: string;
    color: string;
}

interface McFormat {
    tag: string;
    label: string;
}

interface TextSegment {
    text: string;
    color: string;
    italic: boolean;
    bold: boolean;
}

interface FieldDef {
    key: string;
    type: "number" | "string" | "boolean";
}

interface SpriteInfo {
    spriteUrl: string | null;
    fallbackColor: string;
    label: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_BASES: string[] = [
    "LAPIS_LAZULI",
    "BLACK_STAINED_GLASS",
    "DIAMOND_SWORD",
    "GOLDEN_APPLE",
    "IRON_PICKAXE",
    "EMERALD",
    "NETHERITE_INGOT",
    "ENDER_PEARL",
    "BLAZE_ROD",
    "SHIELD",
];

// ─── Hook stub ────────────────────────────────────────────────────────────────

function useMcItemSprite(base: string): SpriteInfo {
    const colorMap: Record<string, string> = {
        LAPIS_LAZULI: "#1a6eb5",
        BLACK_STAINED_GLASS: "#1a1a1a",
        DIAMOND_SWORD: "#48d1cc",
        GOLDEN_APPLE: "#ffd700",
        IRON_PICKAXE: "#c0c0c0",
        EMERALD: "#50c878",
        NETHERITE_INGOT: "#3d3340",
        ENDER_PEARL: "#3e7c5e",
        BLAZE_ROD: "#e8a020",
        SHIELD: "#8b6914",
    };
    return {
        spriteUrl: null, // TODO: map base -> real sprite URL
        fallbackColor: colorMap[base] ?? "#555",
        label: base,
    };
}

// ─── MC tag constants ─────────────────────────────────────────────────────────

const MC_COLORS: McColor[] = [
    {tag: "<black>", label: "Black", color: "#000000"},
    {tag: "<dark_blue>", label: "Dark Blue", color: "#0000AA"},
    {tag: "<dark_green>", label: "Dark Green", color: "#00AA00"},
    {tag: "<dark_aqua>", label: "Dark Aqua", color: "#00AAAA"},
    {tag: "<dark_red>", label: "Dark Red", color: "#AA0000"},
    {tag: "<dark_purple>", label: "Dark Purple", color: "#AA00AA"},
    {tag: "<gold>", label: "Gold", color: "#FFAA00"},
    {tag: "<gray>", label: "Gray", color: "#AAAAAA"},
    {tag: "<dark_gray>", label: "Dark Gray", color: "#555555"},
    {tag: "<blue>", label: "Blue", color: "#5555FF"},
    {tag: "<green>", label: "Green", color: "#55FF55"},
    {tag: "<aqua>", label: "Aqua", color: "#55FFFF"},
    {tag: "<red>", label: "Red", color: "#FF5555"},
    {tag: "<light_purple>", label: "Light Purple", color: "#FF55FF"},
    {tag: "<yellow>", label: "Yellow", color: "#FFFF55"},
    {tag: "<white>", label: "White", color: "#FFFFFF"},
];

const MC_FORMATS: McFormat[] = [
    {tag: "<bold>", label: "Bold"},
    {tag: "<!i>", label: "No Italic"},
    {tag: "<i>", label: "Italic"},
    {tag: "<u>", label: "Underline"},
    {tag: "<st>", label: "Strikethrough"},
    {tag: "<obf>", label: "Obfuscated"},
];

// ─── MC text parser ───────────────────────────────────────────────────────────

function parseMcText(text: string): TextSegment[] {
    if (!text) return [{text: "", color: "#AAAAAA", italic: true, bold: false}];

    const colorTagMap: Record<string, string> = {};
    MC_COLORS.forEach((c) => {
        const key = c.tag.replace(/[<>]/g, "");
        colorTagMap[key] = c.color;
    });

    const segments: TextSegment[] = [];
    let currentColor = "#AAAAAA";
    let italic = true;
    let bold = false;

    const tagRegex = /<([^>]+)>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({text: text.slice(lastIndex, match.index), color: currentColor, italic, bold});
        }
        const tag = match[1];
        if (colorTagMap[tag]) currentColor = colorTagMap[tag];
        else if (tag === "!i") italic = false;
        else if (tag === "i") italic = true;
        else if (tag === "bold") bold = true;
        else if (tag === "/bold") bold = false;
        lastIndex = tagRegex.lastIndex;
    }
    if (lastIndex < text.length) {
        segments.push({text: text.slice(lastIndex), color: currentColor, italic, bold});
    }
    return segments.length ? segments : [{text, color: currentColor, italic, bold}];
}

// ─── McTextLine ───────────────────────────────────────────────────────────────

interface McTextLineProps {
    text: string;
}

function McTextLine({text}: McTextLineProps): JSX.Element {
    const segments = parseMcText(text);
    return (
        <span>
            {segments.map((s, i) => (
                <span
                    key={i}
                    style={{
                        color: s.color,
                        fontStyle: s.italic ? "italic" : "normal",
                        fontWeight: s.bold ? "bold" : "normal",
                        fontFamily: "'Minecraft', monospace",
                    }}
                >
                    {s.text}
                </span>
            ))}
        </span>
    );
}

// ─── McTextEditor ─────────────────────────────────────────────────────────────

interface McTextEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    multiline?: boolean;
}

function McTextEditor({label, value, onChange, multiline = false}: McTextEditorProps): JSX.Element {
    const insertTag = (tag: string): void => {
        const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            `[data-mctextarea="${label}"]`
        );
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const newVal = value.slice(0, start) + tag + value.slice(end);
        onChange(newVal);
        setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + tag.length;
            el.focus();
        }, 0);
    };

    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                {label}
            </Label>

            <div className="flex flex-wrap gap-1 p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                {MC_COLORS.map((c) => (
                    <TooltipProvider key={c.tag} delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => insertTag(c.tag)}
                                    className="w-4 h-4 rounded-sm border border-zinc-700 hover:scale-125 transition-transform"
                                    style={{backgroundColor: c.color === "#000000" ? "#111" : c.color}}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">{c.tag}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
                <div className="w-px h-4 bg-zinc-700 self-center mx-0.5"/>
                {MC_FORMATS.map((f) => (
                    <TooltipProvider key={f.tag} delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => insertTag(f.tag)}
                                    className="px-1.5 h-4 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                                >
                                    {f.label}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">{f.tag}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>

            {multiline ? (
                <Textarea
                    data-mctextarea={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    rows={4}
                    className="font-mono text-xs bg-zinc-900 border-zinc-700 text-zinc-200 resize-none"
                />
            ) : (
                <Input
                    data-mctextarea={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    className="font-mono text-xs bg-zinc-900 border-zinc-700 text-zinc-200"
                />
            )}
        </div>
    );
}

// ─── Field definitions ────────────────────────────────────────────────────────

const ATTRIBUTE_KEYS: Array<keyof Attributes> = [
    "attack_knockback", "attack_speed_base", "block_reach", "burning_time",
    "critical_damage_flat", "defense_flat", "entity_reach", "fall_damage",
    "gravity", "jump_strength", "knockback_resistance", "luck", "max_health_flat",
    "max_health_percent", "melee_damage_base", "movement_efficiency", "oxygen_bonus",
    "projectile_damage_base", "projectile_damage_percent", "projectile_speed_base",
    "projectile_speed_percent", "safe_fall_distance", "scale", "sneaking_speed",
    "speed_flat", "speed_percent", "step_height", "submerged_mining_speed",
    "sweeping_damage_ratio", "water_movement_efficiency",
];

const CONSUMABLE_FIELDS: FieldDef[] = [
    {key: "hunger", type: "number"},
    {key: "saturation", type: "number"},
    {key: "canAlwaysEat", type: "boolean"},
    {key: "animation", type: "string"},
    {key: "sound", type: "string"},
    {key: "hasParticles", type: "boolean"},
];

const EFFECT_FIELDS: FieldDef[] = [
    {key: "duration", type: "number"},
    {key: "deathBehavior", type: "string"},
    {key: "value", type: "number"},
    {key: "modifierId", type: "string"},
    {key: "display", type: "boolean"},
    {key: "id", type: "string"},
];

// ─── FieldRow ─────────────────────────────────────────────────────────────────

interface FieldRowProps {
    label: string;
    type: "number" | "string" | "boolean";
    value: string | number | boolean | undefined;
    onChange: (val: string | number | boolean) => void;
}

function FieldRow({label, type, value, onChange}: FieldRowProps): JSX.Element {
    if (type === "boolean") {
        return (
            <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-zinc-800/60 group">
                <Label className="text-xs text-zinc-400 group-hover:text-zinc-300 cursor-pointer">
                    {label}
                </Label>
                <Switch
                    checked={!!value}
                    onCheckedChange={(checked: boolean) => onChange(checked)}
                    className="scale-75"
                />
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-zinc-800/60 group">
            <Label className="text-xs text-zinc-400 w-44 shrink-0 group-hover:text-zinc-300">
                {label}
            </Label>
            <Input
                type={type === "number" ? "number" : "text"}
                value={value as string | number ?? ""}
                onChange={(e) =>
                    onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                className="h-6 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2"
                placeholder={type === "number" ? "0" : "..."}
            />
        </div>
    );
}

// ─── LorePreview ──────────────────────────────────────────────────────────────

interface LorePreviewProps {
    name: string;
    description: string;
}

function LorePreview({name, description}: LorePreviewProps): JSX.Element {
    const descLines: string[] = description
        ? description.split("\n").filter((l) => l.trim())
        : [];

    return (
        <div
            className="rounded-lg border border-[#5a3e8a] p-3 min-h-30"
            style={{
                background: "linear-gradient(135deg, #0d0d1a 0%, #12103a 100%)",
                boxShadow: "0 0 12px 2px rgba(90,62,138,0.4)",
                fontFamily: "'Minecraft', 'Courier New', monospace",
            }}
        >
            {name ? (
                <div className="text-sm mb-1">
                    <McTextLine text={name}/>
                </div>
            ) : (
                <div className="text-xs text-zinc-600 italic">Tên item...</div>
            )}
            {descLines.length > 0 && (
                <>
                    <div className="border-t border-[#5a3e8a]/40 my-1"/>
                    <div className="space-y-0.5">
                        {descLines.map((line, i) => (
                            <div key={i} className="text-xs">
                                <McTextLine text={line}/>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

// ─── ItemSpritePreview ────────────────────────────────────────────────────────

interface ItemSpritePreviewProps {
    base: string;
}

function ItemSpritePreview({base}: ItemSpritePreviewProps): JSX.Element {
    const {spriteUrl, fallbackColor, label} = useMcItemSprite(base);

    return (
        <div
            className="aspect-square rounded-xl border-2 border-zinc-700 flex items-center justify-center relative overflow-hidden"
            style={{
                background: "linear-gradient(145deg, #1a1a2e, #16213e)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
            }}
        >
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 15px,#fff 15px,#fff 16px)," +
                        "repeating-linear-gradient(90deg,transparent,transparent 15px,#fff 15px,#fff 16px)",
                }}
            />
            {spriteUrl ? (
                <img
                    src={spriteUrl}
                    alt={label}
                    className="w-3/4 h-3/4 object-contain"
                    style={{imageRendering: "pixelated"}}
                />
            ) : base ? (
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-14 h-14 rounded-lg border-2 border-white/20 shadow-lg"
                        style={{backgroundColor: fallbackColor}}
                    />
                    <span className="text-[10px] text-zinc-500 font-mono text-center px-2 leading-tight">
                        {label}
                    </span>
                </div>
            ) : (
                <span className="text-zinc-600 text-xs font-mono">Chọn base...</span>
            )}
        </div>
    );
}

// ─── Default consumable state ─────────────────────────────────────────────────

const DEFAULT_CONSUMABLE: Consumable = {
    hunger: 0,
    saturation: 0,
    canAlwaysEat: false,
    animation: "",
    sound: "",
    hasParticles: false,
    effects: {
        duration: 0,
        deathBehavior: "",
        value: 0,
        modifierId: "",
        display: false,
        id: "",
    },
};

// ─── ItemPage ─────────────────────────────────────────────────────────────────

export const ItemPage = (): JSX.Element => {
    const [id, setId] = useState<string>("");
    const [base, setBase] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [hasAttribute, setHasAttribute] = useState<boolean>(false);
    const [hasConsumable, setHasConsumable] = useState<boolean>(false);
    const [hasEnchant, setHasEnchant] = useState<boolean>(false);

    const [attributeSlot, setAttributeSlot] = useState<Slot>("MAINHAND");
    const [attributes, setAttributes] = useState<Partial<Attributes>>({});
    const [consumable, setConsumable] = useState<Consumable>(DEFAULT_CONSUMABLE);

    const createItem = useCreateItem();

    const buildItem = useCallback((): Item => {
        const components: Item["components"] = {
            name: name || '',
            description: description
                ? description.split("\n").filter((l) => l.trim())
                : [],
        };

        if (hasAttribute) {
            const attribute: Attribute = {attributes: attributes as Attributes, slot: attributeSlot};
            components.attribute = attribute;
        }
        if (hasConsumable) components.consumable = consumable;
        if (hasEnchant) components.enchant = {};

        return {id, base, components};
    }, [id, base, name, description, hasAttribute, attributes, attributeSlot, hasConsumable, consumable, hasEnchant]);

    const handleSave = async (): Promise<void> => {
        const item = buildItem();
        if (!item.id || !item.base) {
            alert("ID và Base là bắt buộc!");
            return;
        }
        try {
            await createItem.mutateAsync(item);
            alert("Lưu thành công!");
        } catch (e) {
            alert("Lỗi: " + (e as Error).message);
        }
    };

    const handleGenerateJson = (): void => {
        const json = JSON.stringify(buildItem(), null, 2);
        navigator.clipboard.writeText(json);
        alert("Đã copy JSON vào clipboard!");
    };

    const handleRefresh = (): void => {
        setId("");
        setBase("");
        setName("");
        setDescription("");
        setHasAttribute(false);
        setHasConsumable(false);
        setHasEnchant(false);
        setAttributes({});
        setConsumable(DEFAULT_CONSUMABLE);
    };

    const setAttr = (key: keyof Attributes, val: number): void =>
        setAttributes((prev) => ({...prev, [key]: val}));

    const setConsumableField = <K extends keyof Omit<Consumable, "effects">>(
        key: K,
        val: Consumable[K]
    ): void => setConsumable((prev) => ({...prev, [key]: val}));

    const setEffectField = <K extends keyof Effect>(key: K, val: Effect[K]): void =>
        setConsumable((prev) => ({...prev, effects: {...prev.effects, [key]: val}}));

    return (
        <TooltipProvider>
            <div
                className="min-h-screen text-zinc-100"
                style={{
                    background: "linear-gradient(160deg, #0b0b14 0%, #0f0f1e 60%, #0a0e1a 100%)",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
            >
                {/* Header */}
                <div
                    className="border-b border-zinc-800/80 px-6 py-3 flex items-center gap-3"
                    style={{background: "rgba(10,10,20,0.9)", backdropFilter: "blur(8px)"}}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                    <span className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">
                        Item Creator
                    </span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.1 — dev
                    </Badge>
                </div>

                {/* 1/3 | 2/3 layout */}
                <div className="flex h-[calc(100vh-49px)]">

                    {/* ── LEFT PANEL ── */}
                    <div
                        className="w-1/3 border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-auto"
                        style={{background: "rgba(10,10,18,0.6)"}}
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                Sprite Preview
                            </p>
                            <ItemSpritePreview base={base}/>
                        </div>

                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                Tooltip / Lore
                            </p>
                            <LorePreview name={name} description={description}/>
                        </div>

                        <div className="mt-auto">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                JSON Live
                            </p>
                            <ScrollArea className="h-36 rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                                <pre
                                    className="text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                                    {JSON.stringify(buildItem(), null, 2)}
                                </pre>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="w-2/3 flex flex-col overflow-hidden">
                        {/* Action bar */}
                        <div
                            className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800"
                            style={{background: "rgba(12,12,22,0.9)"}}
                        >
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={createItem.isPending}
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5 px-3"
                            >
                                <Save size={13}/>
                                {createItem.isPending ? "Đang lưu..." : "Save"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleGenerateJson}
                                className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3"
                            >
                                <Code2 size={13}/>
                                Generate JSON
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleRefresh}
                                className="h-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3 ml-auto"
                            >
                                <RefreshCw size={13}/>
                                Refresh
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 px-5 py-4 overflow-auto">
                            <div className="space-y-5 max-w-3xl">

                                {/* ID + Base */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label
                                            className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Item ID
                                        </Label>
                                        <Input
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            placeholder="lapis_fragment"
                                            className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Base (MC Item)
                                        </Label>
                                        <Select value={base} onValueChange={setBase}>
                                            <SelectTrigger
                                                className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono">
                                                <SelectValue placeholder="Chọn base..."/>
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                {MOCK_BASES.map((b) => (
                                                    <SelectItem key={b} value={b} className="font-mono text-xs">
                                                        {b}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <McTextEditor label="Name" value={name} onChange={setName}/>
                                <McTextEditor label="Description" value={description} onChange={setDescription}
                                              multiline/>

                                <Separator className="bg-zinc-800"/>

                                {/* Components */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-semibold">
                                        Components
                                    </p>
                                    <Accordion type="multiple" className="space-y-2">

                                        {/* ATTRIBUTE */}
                                        <AccordionItem
                                            value="attribute"
                                            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0"
                                        >
                                            <AccordionTrigger
                                                className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <span
                                                        onClick={(e) => e.stopPropagation()}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            checked={hasAttribute}
                                                            onCheckedChange={(v) => setHasAttribute(Boolean(v))}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="border-zinc-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600"
                                                        />
                                                    </span>
                                                    <Sword size={14} className="text-sky-400"/>
                                                    <span
                                                        className="text-sm font-semibold text-zinc-200">Attribute</span>
                                                    {hasAttribute && (
                                                        <Badge
                                                            className="ml-auto mr-2 text-[10px] bg-sky-900/60 text-sky-300 border-sky-800">
                                                            {Object.keys(attributes).length} set
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent
                                                className="px-4 pb-4 pt-2 h-auto overflow-visible data-[state=open]:h-auto">
                                                {!hasAttribute ? (
                                                    <p className="text-xs text-zinc-600 italic">Bật checkbox để thêm
                                                        attribute.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Label
                                                                className="text-xs text-zinc-400 w-16 shrink-0">Slot</Label>
                                                            <Select value={attributeSlot}
                                                                    onValueChange={(v) => setAttributeSlot(v as Slot)}>
                                                                <SelectTrigger
                                                                    className="h-7 text-xs bg-zinc-900 border-zinc-700 w-40">
                                                                    <SelectValue/>
                                                                </SelectTrigger>
                                                                <SelectContent
                                                                    className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                    <SelectItem value="MAINHAND"
                                                                                className="text-xs">MAINHAND</SelectItem>
                                                                    <SelectItem value="OFFHAND"
                                                                                className="text-xs">OFFHAND</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <Separator className="bg-zinc-800"/>

                                                        <div
                                                            className="grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                                                            {ATTRIBUTE_KEYS.map((key) => (
                                                                <FieldRow
                                                                    key={key}
                                                                    label={key}
                                                                    type="number"
                                                                    value={attributes[key]}
                                                                    onChange={(v) => setAttr(key, v as number)}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* CONSUMABLE */}
                                        <AccordionItem
                                            value="consumable"
                                            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0"
                                        >
                                            <AccordionTrigger
                                                className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <span
                                                        onClick={(e) => e.stopPropagation()}
                                                        onPointerDown={(e) => e.stopPropagation()}
                                                    >
                                                        <Checkbox
                                                            checked={hasConsumable}
                                                            onCheckedChange={(v) => setHasConsumable(Boolean(v))}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="border-zinc-600 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                                                        />
                                                    </span>
                                                    <Zap size={14} className="text-amber-400"/>
                                                    <span
                                                        className="text-sm font-semibold text-zinc-200">Consumable</span>
                                                </div>
                                            </AccordionTrigger>

                                            <AccordionContent
                                                className="px-4 pb-4 pt-2 h-auto overflow-visible data-[state=open]:h-auto">
                                                {!hasConsumable ? (
                                                    <p className="text-xs text-zinc-600 italic">Bật checkbox để thêm
                                                        consumable.</p>
                                                ) : (
                                                    <div
                                                        className="space-y-3 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                                                        <div className="space-y-0.5">
                                                            {CONSUMABLE_FIELDS.map((f) => (
                                                                <FieldRow
                                                                    key={f.key}
                                                                    label={f.key}
                                                                    type={f.type}
                                                                    value={consumable[f.key as keyof Omit<Consumable, "effects">] as string | number | boolean}
                                                                    onChange={(v) =>
                                                                        setConsumableField(
                                                                            f.key as keyof Omit<Consumable, "effects">,
                                                                            v as never
                                                                        )
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                        <Separator className="bg-zinc-800"/>
                                                        <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                                                            Effect
                                                        </p>
                                                        <div className="space-y-0.5 pl-2 border-l-2 border-zinc-700">
                                                            {EFFECT_FIELDS.map((f) => (
                                                                <FieldRow
                                                                    key={f.key}
                                                                    label={f.key}
                                                                    type={f.type}
                                                                    value={consumable.effects[f.key as keyof Effect] as string | number | boolean}
                                                                    onChange={(v) =>
                                                                        setEffectField(f.key as keyof Effect, v as never)
                                                                    }
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* ENCHANT */}
                                        <AccordionItem
                                            value="enchant"
                                            className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0 overflow-hidden"
                                        >
                                            <AccordionTrigger
                                                className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <Checkbox
                                                        checked={hasEnchant}
                                                        onCheckedChange={(v) => setHasEnchant(Boolean(v))}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                                                    />
                                                    <Sparkles size={14} className="text-purple-400"/>
                                                    <span className="text-sm font-semibold text-zinc-200">Enchant</span>
                                                    <Badge
                                                        className="ml-auto mr-2 text-[10px] bg-zinc-800 text-zinc-500 border-zinc-700">
                                                        Coming soon
                                                    </Badge>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                <p className="text-xs text-zinc-500 italic">
                                                    Enchant interface sẽ được bổ sung sau.
                                                </p>
                                            </AccordionContent>
                                        </AccordionItem>

                                    </Accordion>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default ItemPage;