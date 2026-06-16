import {useState} from "react";
import {BookOpen, Package, RefreshCw, Trash2} from "lucide-react";
import {cn} from "@/lib/utils";
import {LootEntry} from "@/type/loottable";
import {ItemPickerPopup} from "@/components/loottable/ItemPickerPopup";
import {LootTablePickerPopup} from "@/components/loottable/LootTablePickerPopup";
import {useItemOptions} from "@/hooks/use-item-options";
import {ItemSpritePreview} from "@/components/item/ItemSpritePreview";

// ── Shared inline number input ────────────────────────────────
interface FieldInputProps {
    label: string;
    value: number | string;
    type?: "number" | "text";
    min?: number;
    onChange: (v: string) => void;
}

const FieldInput = ({label, value, type = "number", min, onChange}: FieldInputProps) => (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
        <span className="text-[9px] uppercase tracking-widest text-zinc-600 select-none font-medium pl-0.5">
            {label}
        </span>
        <input
            type={type}
            value={value}
            min={min}
            onChange={(e) => onChange(e.target.value)}
            className={cn(
                "w-full h-8 px-2.5",
                "bg-zinc-950 border border-zinc-800 rounded-lg",
                "text-xs text-zinc-200 font-mono text-center outline-none",
                "hover:border-zinc-700 focus:border-zinc-500 transition-colors"
            )}
        />
    </div>
);

// ── Type badge ────────────────────────────────────────────────
const TYPE_STYLES: Record<LootEntry["type"], string> = {
    item: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    loot_table: "text-violet-400  border-violet-500/30  bg-violet-500/10",
    empty: "text-zinc-500    border-zinc-700/60     bg-zinc-800/60",
};

const TypeBadge = ({type}: { type: LootEntry["type"] }) => (
    <span className={cn(
        "text-[9px] font-semibold tracking-wider px-2 py-0.5 rounded-md border shrink-0",
        TYPE_STYLES[type]
    )}>
        {type}
    </span>
);

// ── Item body ─────────────────────────────────────────────────
const ItemEntryBody = ({
                           entry,
                           onChange,
                       }: {
    entry: Extract<LootEntry, { type: "item" }>;
    onChange: (patch: Partial<typeof entry>) => void;
}) => {
    const [pickerOpen, setPickerOpen] = useState(false);
    const { byId } = useItemOptions();
    const meta = byId[entry.item_id];
    const displayName = meta?.name ?? entry.item_id ?? "(chưa chọn)";

    return (
        <>
            {/* Item sprite — large, clickable */}
            <button
                onClick={() => setPickerOpen(true)}
                title="Đổi item"
                className={cn(
                    "w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden p-1",
                    "bg-zinc-950 border border-zinc-800",
                    "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                    "transition-all cursor-pointer"
                )}
            >
                <ItemSpritePreview base={meta?.base ?? entry.item_id} />
            </button>

            {/* Right side: name row + inputs row */}
            <div className="flex-1 flex flex-col justify-between gap-2 min-w-0 py-0.5">
                {/* Item name + đổi button */}
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-zinc-100 font-mono truncate flex-1 leading-none">
                        {displayName}
                    </span>
                    <button
                        onClick={() => setPickerOpen(true)}
                        className={cn(
                            "flex items-center gap-1 h-6 px-2 rounded-md shrink-0",
                            "text-[10px] text-zinc-500",
                            "border border-transparent",
                            "hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20",
                            "transition-all"
                        )}
                    >
                        <RefreshCw size={9}/>
                        Đổi
                    </button>
                </div>

                {/* 3 inputs dàn ngang đều nhau */}
                <div className="flex gap-2">
                    <FieldInput label="Min" value={entry.min_amount} min={0}
                                onChange={(v) => onChange({min_amount: +v})}/>
                    <FieldInput label="Max" value={entry.max_amount} min={0}
                                onChange={(v) => onChange({max_amount: +v})}/>
                    <FieldInput label="Weight" value={entry.weight} min={1}
                                onChange={(v) => onChange({weight: +v})}/>
                </div>
            </div>

            {pickerOpen && (
                <ItemPickerPopup
                    onSelect={(id) => onChange({item_id: id})}
                    onClose={() => setPickerOpen(false)}
                />
            )}
        </>
    );
};

// ── LootTable body ────────────────────────────────────────────
const LootTableEntryBody = ({
                                entry,
                                onChange,
                            }: {
    entry: Extract<LootEntry, { type: "loot_table" }>;
    onChange: (patch: Partial<typeof entry>) => void;
}) => {
    const [pickerOpen, setPickerOpen] = useState(false);

    return (
        <>
            <div className={cn(
                "w-14 h-14 rounded-xl flex-shrink-0",
                "bg-violet-500/8 border border-violet-500/20",
                "flex items-center justify-center"
            )}>
                <BookOpen size={22} className="text-violet-400"/>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2 min-w-0 py-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold font-mono truncate flex-1 leading-none text-violet-300">
                        {entry.name
                            ? entry.name
                            : <span className="text-zinc-600 italic font-normal text-xs">(chưa chọn)</span>
                        }
                    </span>
                    <button
                        onClick={() => setPickerOpen(true)}
                        className={cn(
                            "flex items-center gap-1 h-6 px-2 rounded-md shrink-0",
                            "text-[10px] text-zinc-500 border border-transparent",
                            "hover:text-violet-400 hover:bg-violet-500/10 hover:border-violet-500/20",
                            "transition-all"
                        )}
                    >
                        <RefreshCw size={9}/>
                        Đổi
                    </button>
                </div>

                <div className="flex gap-2">
                    <FieldInput label="Weight" value={entry.weight} min={1}
                                onChange={(v) => onChange({weight: +v})}/>
                    <div className="flex-1"/>
                    <div className="flex-1"/>
                </div>
            </div>

            {pickerOpen && (
                <LootTablePickerPopup
                    onSelect={(id) => onChange({name: id})}
                    onClose={() => setPickerOpen(false)}
                />
            )}
        </>
    );
};

// ── Empty body ────────────────────────────────────────────────
const EmptyEntryBody = ({
                            entry,
                            onChange,
                        }: {
    entry: Extract<LootEntry, { type: "empty" }>;
    onChange: (patch: Partial<typeof entry>) => void;
}) => (
    <>
        <div className={cn(
            "w-14 h-14 rounded-xl flex-shrink-0",
            "bg-zinc-900 border border-zinc-800",
            "flex items-center justify-center"
        )}>
            <Package size={22} className="text-zinc-700"/>
        </div>

        <div className="flex-1 flex flex-col justify-between gap-2 min-w-0 py-0.5">
            <span className="text-sm text-zinc-600 italic leading-none">Không có vật phẩm</span>
            <div className="flex gap-2">
                <FieldInput label="Weight" value={entry.weight} min={1}
                            onChange={(v) => onChange({weight: +v})}/>
                <div className="flex-1"/>
                <div className="flex-1"/>
            </div>
        </div>
    </>
);

// ── Main EntryCard ────────────────────────────────────────────
interface EntryCardProps {
    entry: LootEntry;
    index: number;
    onChange: (index: number, patch: Partial<LootEntry>) => void;
    onRemove: (index: number) => void;
}

const CARD_ACCENT: Record<LootEntry["type"], string> = {
    item: "border-l-emerald-500/50",
    loot_table: "border-l-violet-500/50",
    empty: "border-l-zinc-700",
};

export const EntryCard = ({entry, index, onChange, onRemove}: EntryCardProps) => {
    const patch = (p: Partial<LootEntry>) => onChange(index, p);

    return (
        <div className={cn(
            "rounded-xl border border-zinc-800 bg-zinc-900/70 overflow-hidden",
            "border-l-2", CARD_ACCENT[entry.type]
        )}>
            {/* ── Header ── */}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/30 border-b border-zinc-800">
                <TypeBadge type={entry.type}/>
                <span className="text-[10px] text-zinc-600 flex-1">#{index + 1}</span>
                <button
                    onClick={() => onRemove(index)}
                    title="Xóa entry"
                    className={cn(
                        "w-6 h-6 flex items-center justify-center rounded-md",
                        "text-red-500/70 border border-red-500/20 bg-red-500/5",
                        "hover:text-red-400 hover:bg-red-500/15 hover:border-red-500/40",
                        "transition-all"
                    )}
                >
                    <Trash2 size={11}/>
                </button>
            </div>

            {/* ── Body: icon + fields side by side ── */}
            <div className="flex items-center gap-3 px-3 py-3">
                {entry.type === "item" && (
                    <ItemEntryBody
                        entry={entry}
                        onChange={patch as (p: Partial<Extract<LootEntry, { type: "item" }>>) => void}
                    />
                )}
                {entry.type === "loot_table" && (
                    <LootTableEntryBody
                        entry={entry}
                        onChange={patch as (p: Partial<Extract<LootEntry, { type: "loot_table" }>>) => void}
                    />
                )}
                {entry.type === "empty" && (
                    <EmptyEntryBody
                        entry={entry}
                        onChange={patch as (p: Partial<Extract<LootEntry, { type: "empty" }>>) => void}
                    />
                )}
            </div>
        </div>
    );
};