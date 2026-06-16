import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Code2, RefreshCw, Save } from "lucide-react";

import { useCreateItem } from "@/hooks/use-item";
import { Item } from "@/data/item";
import {
    ITEM_COMPONENTS,
    COMPONENT_MAP,
    ACCENT_CLASS,
    GROUP_LABEL,
    type ComponentDescriptor,
    type ComponentGroup,
} from "@/registry/components";

import { ItemSpritePreview } from "@/components/item/ItemSpritePreview";
import { LorePreview } from "@/components/item/LorePreview";
// @ts-ignore — JS component
import MinecraftItemPicker from "@/components/item_selector/MinecraftItemPicker";

const GROUP_ORDER: ComponentGroup[] = ["core", "stats", "consume", "gem", "cosmetic"];

// ─── ComponentCard ──────────────────────────────────────────────────────────────

interface ComponentCardProps {
    desc: ComponentDescriptor;
    enabled: boolean;
    value: unknown;
    onToggle: (v: boolean) => void;
    onReset: () => void;
    onChange: (v: unknown) => void;
}

function ComponentCard({ desc, enabled, value, onToggle, onReset, onChange }: ComponentCardProps) {
    const accent = ACCENT_CLASS[desc.accent] ?? ACCENT_CLASS.zinc;
    const Icon = desc.icon;
    const Editor = desc.Editor;

    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800/60">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    {!desc.alwaysOn && (
                        <Checkbox
                            checked={enabled}
                            onCheckedChange={(v) => onToggle(Boolean(v))}
                            className={`border-zinc-600 ${accent.check}`}
                        />
                    )}
                    <Icon size={14} className={accent.text} />
                    <span className="text-sm font-semibold text-zinc-200">{desc.label}</span>
                    <code className="text-[10px] text-zinc-600">{desc.key}</code>
                    {enabled && <span className={`w-1.5 h-1.5 rounded-full ${accent.dot}`} />}
                </label>
                <Button
                    size="sm"
                    variant="ghost"
                    onClick={onReset}
                    className="h-6 px-2 text-[11px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 gap-1"
                >
                    <RefreshCw size={10} /> Reset
                </Button>
            </div>
            <div className={`p-4 ${enabled ? "" : "opacity-40 pointer-events-none"}`}>
                <Editor value={value} onChange={onChange} />
            </div>
        </div>
    );
}

// ─── ItemPage ──────────────────────────────────────────────────────────────────

export const ItemPage = (): JSX.Element => {
    const [id, setId] = useState<string>("");
    const [base, setBase] = useState<string>("");

    const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(ITEM_COMPONENTS.map((c) => [c.key, !!c.alwaysOn]))
    );
    const [data, setData] = useState<Record<string, unknown>>(() =>
        Object.fromEntries(ITEM_COMPONENTS.map((c) => [c.key, c.createDefault()]))
    );

    const [leftPanelView, setLeftPanelView] = useState<"lore" | "json">("lore");

    const createItem = useCreateItem();

    // ─── derived ─────────────────────────────────────────────────────────────────

    const buildItem = useCallback((): Item => {
        const components: Record<string, unknown> = {};
        for (const c of ITEM_COMPONENTS) {
            if (!enabled[c.key]) continue;
            const v = data[c.key];
            if (c.isEmpty && c.isEmpty(v as never)) continue;
            components[c.key] = c.toJson(v as never);
        }
        // plugin expects the UPPERCASE Material name as `base`
        return { id, base: base ? base.replace(/^minecraft:/, "").toUpperCase() : "", components };
    }, [id, base, enabled, data]);

    // data passed to the lore preview — editor shape of enabled components only
    const loreComponents = useMemo(() => {
        const out: Record<string, unknown> = {};
        for (const c of ITEM_COMPONENTS) if (enabled[c.key]) out[c.key] = data[c.key];
        return out;
    }, [enabled, data]);

    const nameValue = (enabled["name"] ? (data["name"] as string) : "") || "";

    // ─── handlers ──────────────────────────────────────────────────────────────

    const setComponentData = (key: string, v: unknown) =>
        setData((prev) => ({ ...prev, [key]: v }));
    const toggle = (key: string, on: boolean) =>
        setEnabled((prev) => ({ ...prev, [key]: on }));
    const resetComponent = (key: string) =>
        setData((prev) => ({ ...prev, [key]: COMPONENT_MAP[key].createDefault() }));

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

    const handleRefresh = () => {
        setId("");
        setBase("");
        setEnabled(Object.fromEntries(ITEM_COMPONENTS.map((c) => [c.key, !!c.alwaysOn])));
        setData(Object.fromEntries(ITEM_COMPONENTS.map((c) => [c.key, c.createDefault()])));
    };

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
                    style={{ background: "rgba(10,10,20,0.9)", backdropFilter: "blur(8px)" }}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">Item Creator</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.2 — registry
                    </Badge>
                </div>

                <div className="flex h-[calc(100vh-49px)]">
                    {/* LEFT PANEL */}
                    <div
                        className="w-1/3 border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-hidden"
                        style={{ background: "rgba(10,10,18,0.6)" }}
                    >
                        <div className="flex flex-col items-center shrink-0">
                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-semibold w-full text-left">
                                Sprite Preview
                            </p>
                            <div className="w-32 h-32">
                                <ItemSpritePreview base={base} />
                            </div>
                        </div>

                        <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-zinc-800 shrink-0">
                            {(["lore", "json"] as const).map((v) => (
                                <button
                                    key={v}
                                    onClick={() => setLeftPanelView(v)}
                                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                                        leftPanelView === v
                                            ? "bg-zinc-800 text-zinc-200 shadow-sm"
                                            : "text-zinc-500 hover:text-zinc-300"
                                    }`}
                                >
                                    {v === "lore" ? "Tooltip / Lore" : "JSON Live"}
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 flex flex-col min-h-0">
                            {leftPanelView === "lore" ? (
                                <ScrollArea className="flex-1 h-full pr-3" type="auto">
                                    <LorePreview name={nameValue} components={loreComponents} />
                                </ScrollArea>
                            ) : (
                                <ScrollArea
                                    className="flex-1 h-full rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                                    type="auto"
                                >
                                    <pre className="text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                                        {JSON.stringify(buildItem(), null, 2)}
                                    </pre>
                                </ScrollArea>
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-2/3 flex flex-col overflow-hidden">
                        {/* Action bar */}
                        <div
                            className="flex items-center gap-2 px-5 py-2.5 border-b border-zinc-800 shrink-0"
                            style={{ background: "rgba(12,12,22,0.9)" }}
                        >
                            <Button
                                size="sm"
                                onClick={handleSave}
                                disabled={createItem.isPending}
                                className="h-8 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold gap-1.5 px-3"
                            >
                                <Save size={13} />
                                {createItem.isPending ? "Đang lưu..." : "Save"}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleGenerateJson}
                                className="h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3"
                            >
                                <Code2 size={13} /> Generate JSON
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleRefresh}
                                className="h-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 text-xs gap-1.5 px-3 ml-auto"
                            >
                                <RefreshCw size={13} /> Reset All
                            </Button>
                        </div>

                        {/* Scrollable content */}
                        <div className="flex-1 overflow-y-auto px-5 py-4">
                            <div className="space-y-5 max-w-3xl">
                                {/* ID + Base */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Item ID
                                        </Label>
                                        <Input
                                            value={id}
                                            onChange={(e) => setId(e.target.value)}
                                            placeholder="lapis_fragment"
                                            className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono"
                                        />
                                    </div>
                                    <div className="space-y-1.5 flex flex-col">
                                        <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                                            Base (MC Item)
                                        </Label>
                                        <MinecraftItemPicker value={base} onChange={setBase} />
                                    </div>
                                </div>

                                <Separator className="bg-zinc-800" />

                                {/* Components grouped by group */}
                                {GROUP_ORDER.map((group) => {
                                    const comps = ITEM_COMPONENTS.filter((c) => c.group === group);
                                    if (comps.length === 0) return null;
                                    return (
                                        <div key={group} className="space-y-2">
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
                                                {GROUP_LABEL[group]}
                                            </p>
                                            <div className="space-y-3">
                                                {comps.map((desc) => (
                                                    <ComponentCard
                                                        key={desc.key}
                                                        desc={desc}
                                                        enabled={enabled[desc.key]}
                                                        value={data[desc.key]}
                                                        onToggle={(v) => toggle(desc.key, v)}
                                                        onReset={() => resetComponent(desc.key)}
                                                        onChange={(v) => setComponentData(desc.key, v)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

export default ItemPage;
