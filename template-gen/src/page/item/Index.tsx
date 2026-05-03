import { useState, useCallback } from "react";
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge }     from "@/components/ui/badge";
import { Button }    from "@/components/ui/button";
import { Checkbox }  from "@/components/ui/checkbox";
import { Input }     from "@/components/ui/input";
import { Label }     from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Separator }  from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Save, RefreshCw, Code2, Sword, Zap, Sparkles } from "lucide-react";

import { useCreateItem }    from "@/hooks/use-item";
import { Item }             from "@/data/item";
import { Attributes, Attribute } from "@/data/cpn/attribute";
import { Consumable, Effect }    from "@/data/cpn/consumable";

import { Slot } from "@/type/item-creator";
import {
    MOCK_BASES, ATTRIBUTE_KEYS, CONSUMABLE_FIELDS, DEFAULT_CONSUMABLE,
} from "@/constants/item-creator";
import {ItemSpritePreview} from "@/components/item-creator/ItemSpritePreview";
import {LorePreview} from "@/components/item-creator/LorePreview";
import {McTextEditor} from "@/components/item-creator/McTextEditor";
import {FieldRow} from "@/components/item-creator/FieldRow";
import {EffectList} from "@/components/item-creator/EffectList";


export const ItemPage = (): JSX.Element => {
    const [id, setId]                   = useState<string>("");
    const [base, setBase]               = useState<string>("");
    const [name, setName]               = useState<string>("");
    const [description, setDescription] = useState<string>("");

    const [hasAttribute, setHasAttribute]   = useState<boolean>(false);
    const [hasConsumable, setHasConsumable] = useState<boolean>(false);
    const [hasEnchant, setHasEnchant]       = useState<boolean>(false);

    const [attributeSlot, setAttributeSlot] = useState<Slot>("MAINHAND");
    const [attributes, setAttributes]       = useState<Partial<Attributes>>({});
    const [consumable, setConsumable]       = useState<Consumable>(DEFAULT_CONSUMABLE);

    const createItem = useCreateItem();

    // ─── builders ─────────────────────────────────────────────────────────────

    const buildItem = useCallback((): Item => {
        const components: Item["components"] = {
            name: name || "",
            description: description
                ? description.split("\n").filter((l) => l.trim())
                : [],
        };
        if (hasAttribute) {
            components.attribute = { attributes: attributes as Attributes, slot: attributeSlot } as Attribute;
        }
        if (hasConsumable) components.consumable = consumable;
        if (hasEnchant)    components.enchant = {};
        return { id, base, components };
    }, [id, base, name, description, hasAttribute, attributes, attributeSlot, hasConsumable, consumable, hasEnchant]);

    // ─── handlers ─────────────────────────────────────────────────────────────

    const handleSave = async (): Promise<void> => {
        const item = buildItem();
        if (!item.id || !item.base) { alert("ID và Base là bắt buộc!"); return; }
        try {
            await createItem.mutateAsync(item);
            alert("Lưu thành công!");
        } catch (e) { alert("Lỗi: " + (e as Error).message); }
    };

    const handleGenerateJson = (): void => {
        navigator.clipboard.writeText(JSON.stringify(buildItem(), null, 2));
        alert("Đã copy JSON vào clipboard!");
    };

    const handleRefresh = (): void => {
        setId(""); setBase(""); setName(""); setDescription("");
        setHasAttribute(false); setHasConsumable(false); setHasEnchant(false);
        setAttributes({}); setConsumable(DEFAULT_CONSUMABLE);
    };

    // ─── setters ──────────────────────────────────────────────────────────────

    const setAttr = (key: keyof Attributes, val: number) =>
        setAttributes((prev) => ({ ...prev, [key]: val }));

    const setConsumableField = <K extends keyof Omit<Consumable, "effects">>(
        key: K, val: Consumable[K]
    ) => setConsumable((prev) => ({ ...prev, [key]: val }));

    /** Thay toàn bộ mảng effects — được truyền xuống EffectList */
    const setEffects = (effects: Effect[]) =>
        setConsumable((prev) => ({ ...prev, effects }));

    // ─── render ───────────────────────────────────────────────────────────────

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
                    style={{ background: "rgba(10,10,20,0.9)", backdropFilter: "blur(8px)" }}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">
                        Item Creator
                    </span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.1 — dev
                    </Badge>
                </div>

                <div className="flex h-[calc(100vh-49px)]">

                    {/* ── LEFT PANEL ── */}
                    <div
                        className="w-1/3 border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-auto"
                        style={{ background: "rgba(10,10,18,0.6)" }}
                    >
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                Sprite Preview
                            </p>
                            <ItemSpritePreview base={base} />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                Tooltip / Lore
                            </p>
                            <LorePreview name={name} description={description} />
                        </div>
                        <div className="mt-auto">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold">
                                JSON Live
                            </p>
                            <ScrollArea className="h-36 rounded-lg border border-zinc-800 bg-zinc-950 p-2">
                                <pre className="text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
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
                            style={{ background: "rgba(12,12,22,0.9)" }}
                        >
                            <Button size="sm" onClick={handleSave} disabled={createItem.isPending}
                                    className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5 px-3">
                                <Save size={13} />
                                {createItem.isPending ? "Đang lưu..." : "Save"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleGenerateJson}
                                    className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3">
                                <Code2 size={13} /> Generate JSON
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleRefresh}
                                    className="h-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3 ml-auto">
                                <RefreshCw size={13} /> Refresh
                            </Button>
                        </div>

                        <ScrollArea className="flex-1 px-5 py-4 overflow-auto">
                            <div className="space-y-5 max-w-3xl">

                                {/* ID + Base */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Item ID
                                        </Label>
                                        <Input value={id} onChange={(e) => setId(e.target.value)}
                                               placeholder="lapis_fragment"
                                               className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Base (MC Item)
                                        </Label>
                                        <Select value={base} onValueChange={setBase}>
                                            <SelectTrigger className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono">
                                                <SelectValue placeholder="Chọn base..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                {MOCK_BASES.map((b) => (
                                                    <SelectItem key={b} value={b} className="font-mono text-xs">{b}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <McTextEditor label="Name" value={name} onChange={setName} />
                                <McTextEditor label="Description" value={description} onChange={setDescription} multiline />

                                <Separator className="bg-zinc-800" />

                                {/* Components */}
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-semibold">
                                        Components
                                    </p>
                                    <Accordion type="multiple" className="space-y-2">

                                        {/* ATTRIBUTE */}
                                        <AccordionItem value="attribute"
                                                       className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <span onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                                                        <Checkbox checked={hasAttribute}
                                                                  onCheckedChange={(v) => setHasAttribute(Boolean(v))}
                                                                  onClick={(e) => e.stopPropagation()}
                                                                  className="border-zinc-600 data-[state=checked]:bg-sky-600 data-[state=checked]:border-sky-600" />
                                                    </span>
                                                    <Sword size={14} className="text-sky-400" />
                                                    <span className="text-sm font-semibold text-zinc-200">Attribute</span>
                                                    {hasAttribute && (
                                                        <Badge className="ml-auto mr-2 text-[10px] bg-sky-900/60 text-sky-300 border-sky-800">
                                                            {Object.keys(attributes).length} set
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2">
                                                {!hasAttribute ? (
                                                    <p className="text-xs text-zinc-600 italic">Bật checkbox để thêm attribute.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <Label className="text-xs text-zinc-400 w-16 shrink-0">Slot</Label>
                                                            <Select value={attributeSlot} onValueChange={(v) => setAttributeSlot(v as Slot)}>
                                                                <SelectTrigger className="h-7 text-xs bg-zinc-900 border-zinc-700 w-40">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                                                                    <SelectItem value="MAINHAND" className="text-xs">MAINHAND</SelectItem>
                                                                    <SelectItem value="OFFHAND"  className="text-xs">OFFHAND</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <Separator className="bg-zinc-800" />
                                                        <div className="grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto pr-1 scrollbar-thin">
                                                            {ATTRIBUTE_KEYS.map((key) => (
                                                                <FieldRow key={key} label={key} type="number"
                                                                          value={attributes[key]}
                                                                          onChange={(v) => setAttr(key, v as number)} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* CONSUMABLE */}
                                        <AccordionItem value="consumable"
                                                       className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <span onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                                                        <Checkbox checked={hasConsumable}
                                                                  onCheckedChange={(v) => setHasConsumable(Boolean(v))}
                                                                  onClick={(e) => e.stopPropagation()}
                                                                  className="border-zinc-600 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600" />
                                                    </span>
                                                    <Zap size={14} className="text-amber-400" />
                                                    <span className="text-sm font-semibold text-zinc-200">Consumable</span>
                                                    {hasConsumable && consumable.effects.length > 0 && (
                                                        <Badge className="ml-auto mr-2 text-[10px] bg-amber-900/40 text-amber-300 border-amber-800">
                                                            {consumable.effects.length} effect
                                                        </Badge>
                                                    )}
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="px-4 pb-4 pt-2 !h-auto !overflow-visible">
                                                {!hasConsumable ? (
                                                    <p className="text-xs text-zinc-600 italic">Bật checkbox để thêm consumable.</p>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {/* Base consumable fields */}
                                                        <div className="space-y-0.5">
                                                            {CONSUMABLE_FIELDS.map((f) => (
                                                                <FieldRow
                                                                    key={f.key}
                                                                    label={f.key}
                                                                    type={f.type}
                                                                    value={consumable[f.key as keyof Omit<Consumable, "effects">] as string | number | boolean}
                                                                    onChange={(v) =>
                                                                        setConsumableField(f.key as keyof Omit<Consumable, "effects">, v as never)
                                                                    }
                                                                />
                                                            ))}
                                                        </div>

                                                        <Separator className="bg-zinc-800" />
                                                        <div className="max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                                                            <EffectList
                                                                effects={consumable.effects}
                                                                onChange={setEffects}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>

                                        {/* ENCHANT */}
                                        <AccordionItem value="enchant"
                                                       className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-0 overflow-hidden">
                                            <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-zinc-800/40 data-[state=open]:bg-zinc-800/40">
                                                <div className="flex items-center gap-3 w-full">
                                                    <Checkbox checked={hasEnchant}
                                                              onCheckedChange={(v) => setHasEnchant(Boolean(v))}
                                                              onClick={(e) => e.stopPropagation()}
                                                              className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600" />
                                                    <Sparkles size={14} className="text-purple-400" />
                                                    <span className="text-sm font-semibold text-zinc-200">Enchant</span>
                                                    <Badge className="ml-auto mr-2 text-[10px] bg-zinc-800 text-zinc-500 border-zinc-700">
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