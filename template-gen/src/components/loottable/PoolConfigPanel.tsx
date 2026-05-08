import {ScrollArea} from "@/components/ui/scroll-area";
import {Plus} from "lucide-react";
import {EntryCard} from "./EntryCard";
import {LootEntry, PoolInfo} from "@/type/loottable";

interface PoolConfigPanelProps {
    poolIndex: number;
    pool: PoolInfo;
    onRollsChange: (rolls: number) => void;
    onBonusRollsChange: (bonus: number) => void;
    onEntryChange: (entryIndex: number, patch: Partial<LootEntry>) => void;
    onEntryRemove: (entryIndex: number) => void;
    onEntryAdd: (type: LootEntry["type"]) => void;
}

// ── Small number input ────────────────────────────────────────
const RollInput = ({
                       label,
                       value,
                       onChange,
                   }: {
    label: string;
    value: number;
    onChange: (v: number) => void;
}) => (
    <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
            {label}
        </label>
        <input
            type="number"
            min={0}
            value={value}
            onChange={(e) => onChange(+e.target.value)}
            className="h-8 px-3 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-sm text-zinc-200 font-mono outline-none focus:border-zinc-500 transition-colors w-full"
        />
    </div>
);

// ── Add-entry button group ────────────────────────────────────
const ADD_ENTRY_BTNS: { type: LootEntry["type"]; label: string; cls: string }[] = [
    {
        type: "item",
        label: "Item",
        cls: "text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40"
    },
    {
        type: "loot_table",
        label: "Table",
        cls: "text-violet-400  border-violet-500/20  hover:bg-violet-500/10  hover:border-violet-500/40"
    },
    {
        type: "empty",
        label: "Empty",
        cls: "text-zinc-500    border-zinc-700/50     hover:bg-zinc-700/30   hover:border-zinc-600"
    },
];

export const PoolConfigPanel = ({
                                    poolIndex,
                                    pool,
                                    onRollsChange,
                                    onBonusRollsChange,
                                    onEntryChange,
                                    onEntryRemove,
                                    onEntryAdd,
                                }: PoolConfigPanelProps) => (
    <div className="flex-1 border-r border-zinc-800/60 flex flex-col overflow-hidden min-w-0">
        {/* Pool ID header */}
        <div className="px-4 py-2.5 border-b border-zinc-800/60 flex-shrink-0 bg-zinc-900/30">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
        Pool {poolIndex + 1} — config
      </span>
        </div>

        {/* Rolls */}
        <div className="px-4 py-3 border-b border-zinc-800/60 flex-shrink-0">
            <div className="flex gap-3">
                <RollInput label="Rolls" value={pool.rolls} onChange={onRollsChange}/>
                <RollInput label="Bonus Rolls" value={pool.bonus_rolls} onChange={onBonusRollsChange}/>
            </div>
        </div>

        {/* Entries header */}
        <div
            className="px-4 py-2 border-b border-zinc-800/60 flex items-center justify-between flex-shrink-0 bg-zinc-900/20">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
        Entries
        <span className="ml-1.5 text-zinc-700">({pool.entries.length})</span>
      </span>
            <div className="flex gap-1.5">
                {ADD_ENTRY_BTNS.map(({type, label, cls}) => (
                    <button
                        key={type}
                        onClick={() => onEntryAdd(type)}
                        className={`flex items-center gap-1 h-6 px-2 rounded-md border text-[10px] font-medium transition-all ${cls}`}
                    >
                        <Plus size={10}/>
                        {label}
                    </button>
                ))}
            </div>
        </div>

        {/* Entries list */}
        <ScrollArea className="flex-1">
            <div className="px-3 py-3 flex flex-col gap-2.5">
                {pool.entries.length === 0 ? (
                    <div className="py-10 text-center">
                        <p className="text-xs text-zinc-600">Chưa có entry nào.</p>
                        <p className="text-[10px] text-zinc-700 mt-1">Bấm + Item / Table / Empty để thêm.</p>
                    </div>
                ) : (
                    pool.entries.map((entry, i) => (
                        <EntryCard
                            key={i}
                            entry={entry}
                            index={i}
                            onChange={onEntryChange}
                            onRemove={onEntryRemove}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
    </div>
);