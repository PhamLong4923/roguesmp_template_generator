import {useCallback, useState} from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Checkbox} from "@/components/ui/checkbox";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Separator} from "@/components/ui/separator";
import {ScrollArea} from "@/components/ui/scroll-area";
import {TooltipProvider} from "@/components/ui/tooltip";
import {Code2, RefreshCw, Save, Sparkles, Sword, Zap} from "lucide-react";

import {useCreateItem} from "@/hooks/use-item";
import {Item} from "@/data/item";
import {Attribute, Attributes} from "@/data/cpn/attribute";
import {Consumable, Effect} from "@/data/cpn/consumable";
import {Enchant} from "@/data/cpn/enchant";

import {Slot} from "@/type/item-creator";
import {ATTRIBUTE_KEYS, CONSUMABLE_FIELDS, DEFAULT_CONSUMABLE,} from "@/constants/item-creator";

import {ItemSpritePreview} from "@/components/item-creator/ItemSpritePreview";
import {LorePreview} from "@/components/item-creator/LorePreview";
import {McTextEditor} from "@/components/item-creator/McTextEditor";
import {FieldRow} from "@/components/item-creator/FieldRow";
import {EffectList} from "@/components/item-creator/EffectList";
import {EnchantList} from "@/components/item-creator/EnchantList";
import MinecraftItemPicker from "@/components/item_selector/MinecraftItemPicker";

// ─── Default states (dùng để reset per-component) ─────────────────────────────

const DEFAULT_ATTRIBUTES: Partial<Attributes> = {};
const DEFAULT_ATTRIBUTE_SLOT: Slot = "MAINHAND";
const DEFAULT_ENCHANT: Enchant = {enchants: {}};

// ─── ComponentTabHeader ────────────────────────────────────────────────────────

interface ComponentTabHeaderProps {
    label: string;
    enabled: boolean;
    onToggle: (v: boolean) => void;
    onReset: () => void;
    color: "sky" | "amber" | "purple";
}

function ComponentTabHeader({label, enabled, onToggle, onReset, color}: ComponentTabHeaderProps) {
    const checkboxColor = {
        sky: "data-[state=checked]:bg-sky-600    data-[state=checked]:border-sky-600",
        amber: "data-[state=checked]:bg-amber-600  data-[state=checked]:border-amber-600",
        purple: "data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600",
    }[color];

    return (
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800">
            <label className="flex items-center gap-2 cursor-pointer select-none">
                <Checkbox
                    checked={enabled}
                    onCheckedChange={(v) => onToggle(Boolean(v))}
                    className={`border-zinc-600 ${checkboxColor}`}
                />
                <span className="text-xs text-zinc-400">
                    {enabled
                        ? <span className="text-emerald-400">Enabled</span>
                        : <span className="text-zinc-600">Disabled</span>
                    }
                </span>
            </label>
            <Button
                size="sm"
                variant="ghost"
                onClick={onReset}
                className="h-6 px-2 text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 gap-1"
            >
                <RefreshCw size={10}/>
                Reset {label}
            </Button>
        </div>
    );
}

// ─── ItemPage ──────────────────────────────────────────────────────────────────

export const ItemPage = (): JSX.Element => {
    const [id, setId] = useState<string>("");
    const [base, setBase] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // enable flags
    const [hasAttribute, setHasAttribute] = useState<boolean>(false);
    const [hasConsumable, setHasConsumable] = useState<boolean>(false);
    const [hasEnchant, setHasEnchant] = useState<boolean>(false);

    // component data
    const [attributeSlot, setAttributeSlot] = useState<Slot>(DEFAULT_ATTRIBUTE_SLOT);
    const [attributes, setAttributes] = useState<Partial<Attributes>>(DEFAULT_ATTRIBUTES);
    const [consumable, setConsumable] = useState<Consumable>(DEFAULT_CONSUMABLE);
    const [enchant, setEnchant] = useState<Enchant>(DEFAULT_ENCHANT);

    const [leftPanelView, setLeftPanelView] = useState<"lore" | "json">("lore");

    const createItem = useCreateItem();

    // ─── builders ──────────────────────────────────────────────────────────────

    const buildItem = useCallback((): Item => {
        const components: Item["components"] = {
            name: name || "",
            description: description ? description.split("\n").filter((l) => l.trim()) : [],
        };
        if (hasAttribute) components.attribute = {
            attributes: attributes as Attributes,
            slot: attributeSlot
        } as Attribute;
        if (hasConsumable) components.consumable = consumable;
        if (hasEnchant) components.enchant = enchant;
        return {id, base, components};
    }, [id, base, name, description, hasAttribute, attributes, attributeSlot, hasConsumable, consumable, hasEnchant, enchant]);

    // ─── handlers ──────────────────────────────────────────────────────────────

    const handleSave = async () => {
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

    const handleGenerateJson = () => {
        navigator.clipboard.writeText(JSON.stringify(buildItem(), null, 2));
        alert("Đã copy JSON vào clipboard!");
    };

    // Global reset
    const handleRefresh = () => {
        setId("");
        setBase("");
        setName("");
        setDescription("");
        setHasAttribute(false);
        setHasConsumable(false);
        setHasEnchant(false);
        setAttributes(DEFAULT_ATTRIBUTES);
        setConsumable(DEFAULT_CONSUMABLE);
        setEnchant(DEFAULT_ENCHANT);
        setAttributeSlot(DEFAULT_ATTRIBUTE_SLOT);
    };

    // Per-component reset
    const resetAttribute = () => {
        setAttributes(DEFAULT_ATTRIBUTES);
        setAttributeSlot(DEFAULT_ATTRIBUTE_SLOT);
    };
    const resetConsumable = () => setConsumable(DEFAULT_CONSUMABLE);
    const resetEnchant = () => setEnchant(DEFAULT_ENCHANT);

    // ─── setters ───────────────────────────────────────────────────────────────

    const setAttr = (key: keyof Attributes, val: number) =>
        setAttributes((prev) => ({...prev, [key]: val}));

    const setConsumableField = <K extends keyof Omit<Consumable, "effects">>(key: K, val: Consumable[K]) =>
        setConsumable((prev) => ({...prev, [key]: val}));

    const setEffects = (effects: Effect[]) =>
        setConsumable((prev) => ({...prev, effects}));

    // ─── render ────────────────────────────────────────────────────────────────

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
                    <span className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">Item Creator</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.1 — dev
                    </Badge>
                </div>

                <div className="flex h-[calc(100vh-49px)]">

                    {/*LEFT PANEL*/}
                    <div
                        className="w-1/3 border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-hidden"
                        style={{background: "rgba(10,10,18,0.6)"}}
                    >
                        {/* Sprite Preview */}
                        <div className="flex flex-col items-center shrink-0">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold w-full text-left">
                                Sprite Preview
                            </p>
                            <div className="w-32 h-32">
                                <ItemSpritePreview base={base}/>
                            </div>
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 shrink-0">
                            <button
                                onClick={() => setLeftPanelView("lore")}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                    leftPanelView === "lore"
                                        ? "bg-zinc-800 text-zinc-200 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                Tooltip / Lore
                            </button>
                            <button
                                onClick={() => setLeftPanelView("json")}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                    leftPanelView === "json"
                                        ? "bg-zinc-800 text-zinc-200 shadow-sm"
                                        : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                JSON Live
                            </button>
                        </div>

                        {/* View Content */}
                        <div className="flex-1 flex flex-col min-h-0">
                            {leftPanelView === "lore" ? (
                                <ScrollArea className="flex-1 h-full pr-3" type="auto">
                                    <LorePreview
                                        name={name}
                                        description={description}
                                        components={{
                                            consumable: hasConsumable ? consumable : undefined,
                                            attribute: hasAttribute ? {
                                                attributes: attributes as Attributes,
                                                slot: attributeSlot
                                            } : undefined,
                                            enchant: hasEnchant ? enchant : undefined,
                                        }}
                                    />
                                </ScrollArea>
                            ) : (
                                <ScrollArea className="flex-1 h-full rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                                            type="auto">
                                    <pre
                                        className="text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                                        {JSON.stringify(buildItem(), null, 2)}
                                    </pre>
                                </ScrollArea>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-2/3 flex flex-col overflow-hidden" style={{alignItems: "center"}}>
                        {/* Action bar */}
                        <div
                            className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800 shrink-0"
                            style={{background: "rgba(12,12,22,0.9)"}}
                        >
                            <Button size="sm" onClick={handleSave} disabled={createItem.isPending}
                                    className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5 px-3">
                                <Save size={13}/>
                                {createItem.isPending ? "Đang lưu..." : "Save"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleGenerateJson}
                                    className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3">
                                <Code2 size={13}/> Generate JSON
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleRefresh}
                                    className="h-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3 ml-auto">
                                <RefreshCw size={13}/> Reset All
                            </Button>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <div className="space-y-5 max-w-3xl">

                                {/* ID + Base */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label
                                            className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Item
                                            ID</Label>
                                        <Input value={id} onChange={(e) => setId(e.target.value)}
                                               placeholder="lapis_fragment"
                                               className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono"/>
                                    </div>
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label
                                            className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Base
                                            (MC Item)</Label>
                                        <MinecraftItemPicker value={base} onChange={setBase}/>
                                    </div>
                                </div>

                                <McTextEditor label="Name" value={name} onChange={setName}/>
                                <McTextEditor label="Description" value={description} onChange={setDescription}
                                              multiline/>

                                <Separator className="bg-zinc-800"/>

                                {/*Components Tabs*/}
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3 font-semibold">Components</p>

                                    <Tabs defaultValue="attribute">
                                        {/* Tab triggers */}
                                        <TabsList
                                            className="w-full bg-zinc-900 border border-zinc-800 p-1 h-auto gap-1">
                                            <TabsTrigger
                                                value="attribute"
                                                className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-500 text-xs py-2 gap-2"
                                            >
                                                <Sword size={12} className="text-sky-400 shrink-0"/>
                                                Attribute
                                                {hasAttribute &&
                                                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0"/>}
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="consumable"
                                                className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-500 text-xs py-2 gap-2"
                                            >
                                                <Zap size={12} className="text-amber-400 shrink-0"/>
                                                Consumable
                                                {hasConsumable &&
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"/>}
                                            </TabsTrigger>

                                            <TabsTrigger
                                                value="enchant"
                                                className="flex-1 data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-500 text-xs py-2 gap-2"
                                            >
                                                <Sparkles size={12} className="text-purple-400 shrink-0"/>
                                                Enchant
                                                {hasEnchant &&
                                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0"/>}
                                            </TabsTrigger>
                                        </TabsList>

                                        {/*ATTRIBUTE TAB*/}
                                        <TabsContent value="attribute"
                                                     className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <ComponentTabHeader
                                                label="Attribute"
                                                enabled={hasAttribute}
                                                onToggle={setHasAttribute}
                                                onReset={resetAttribute}
                                                color="sky"
                                            />
                                            <div className={!hasAttribute ? "opacity-40 pointer-events-none" : ""}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Label className="text-xs text-zinc-400 w-16 shrink-0">Slot</Label>
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
                                                    <Badge
                                                        className="ml-auto text-[10px] bg-sky-900/60 text-sky-300 border-sky-800">
                                                        {Object.values(attributes).filter(v => v !== 0 && v !== undefined).length} set
                                                    </Badge>
                                                </div>
                                                <Separator className="bg-zinc-800 mb-2"/>
                                                <div className="grid grid-cols-1 gap-0.5 max-h-80 overflow-y-auto pr-1">
                                                    {ATTRIBUTE_KEYS.map((key) => (
                                                        <FieldRow key={key} label={key} type="number"
                                                                  value={attributes[key]}
                                                                  onChange={(v) => setAttr(key, v as number)}/>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        {/*CONSUMABLE TAB*/}
                                        <TabsContent value="consumable"
                                                     className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <ComponentTabHeader
                                                label="Consumable"
                                                enabled={hasConsumable}
                                                onToggle={setHasConsumable}
                                                onReset={resetConsumable}
                                                color="amber"
                                            />
                                            <div className={!hasConsumable ? "opacity-40 pointer-events-none" : ""}>
                                                <div className="space-y-0.5 mb-3">
                                                    {CONSUMABLE_FIELDS.map((f) => (
                                                        <FieldRow
                                                            key={f.key}
                                                            label={f.key}
                                                            type={f.type}
                                                            value={consumable[f.key as keyof Omit<Consumable, "effects">] as string | number | boolean}
                                                            onChange={(v) => setConsumableField(f.key as keyof Omit<Consumable, "effects">, v as never)}
                                                        />
                                                    ))}
                                                </div>
                                                <Separator className="bg-zinc-800 mb-3"/>
                                                <EffectList effects={consumable.effects} onChange={setEffects}/>
                                            </div>
                                        </TabsContent>

                                        {/*ENCHANT TAB*/}
                                        <TabsContent value="enchant"
                                                     className="mt-3 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
                                            <ComponentTabHeader
                                                label="Enchant"
                                                enabled={hasEnchant}
                                                onToggle={setHasEnchant}
                                                onReset={resetEnchant}
                                                color="purple"
                                            />
                                            <div className={!hasEnchant ? "opacity-40 pointer-events-none" : ""}>
                                                <EnchantList
                                                    enchant={enchant.enchants}
                                                    onChange={(v) => setEnchant({enchants: v})}
                                                />
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default ItemPage;