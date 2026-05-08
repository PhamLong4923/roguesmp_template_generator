import {Layers, Plus, Trash2} from "lucide-react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {cn} from "@/lib/utils";
import {PoolInfo} from "@/type/loottable";

interface PoolListPanelProps {
    pools: PoolInfo[];
    activeIndex: number;
    onSelect: (index: number) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
}

export const PoolListPanel = ({
                                  pools,
                                  activeIndex,
                                  onSelect,
                                  onAdd,
                                  onRemove,
                              }: PoolListPanelProps) => (
    <div className="w-[456px] flex-shrink-0 flex flex-col overflow-hidden bg-zinc-950/40">
        {/* Header */}
        <div className="px-3 py-2.5 border-b border-zinc-800/60 flex items-center justify-between flex-shrink-0">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
        Pools
        <span className="ml-1.5 text-zinc-700">({pools.length})</span>
      </span>
            <button
                onClick={onAdd}
                title="Thêm pool"
                className="w-6 h-6 flex items-center justify-center rounded-md border border-zinc-700/50 text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30 transition-all"
            >
                <Plus size={12}/>
            </button>
        </div>

        {/* Pool items */}
        <ScrollArea className="flex-1">
            <div className="p-2 flex flex-col gap-1.5">
                {pools.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-xs text-zinc-600">Chưa có pool.</p>
                        <p className="text-[10px] text-zinc-700 mt-1">Bấm + để thêm.</p>
                    </div>
                ) : (
                    pools.map((pool, i) => (
                        <PoolItem
                            key={i}
                            pool={pool}
                            index={i}
                            isActive={i === activeIndex}
                            onSelect={() => onSelect(i)}
                            onRemove={() => onRemove(i)}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
    </div>
);

// ── Individual pool item ──────────────────────────────────────
interface PoolItemProps {
    pool: PoolInfo;
    index: number;
    isActive: boolean;
    onSelect: () => void;
    onRemove: () => void;
}

const PoolItem = ({pool, index, isActive, onSelect, onRemove}: PoolItemProps) => (
    <div
        className={cn(
            "rounded-lg border transition-all group",
            isActive
                ? "border-emerald-500/30 bg-emerald-500/8"
                : "border-zinc-800/60 bg-zinc-900/50 hover:border-zinc-700/70 hover:bg-zinc-800/50"
        )}
    >
        <button
            onClick={onSelect}
            className="w-full text-left px-3 py-2.5 cursor-pointer"
        >
            <div className="flex items-center gap-2 mb-1.5">
                <div
                    className={cn("w-5 h-5 rounded flex items-center justify-center flex-shrink-0", isActive ? "bg-emerald-500/15" : "bg-zinc-800")}>
                    <Layers size={11} className={isActive ? "text-emerald-400" : "text-zinc-600"}/>
                </div>
                <span
                    className={cn("text-xs font-semibold font-mono", isActive ? "text-emerald-300" : "text-zinc-300")}>
          Pool {index + 1}
        </span>
            </div>
            <div className="flex flex-wrap gap-1 ml-7">
        <span className="text-[9px] bg-zinc-800/80 border border-zinc-700/40 text-zinc-500 px-1.5 py-0.5 rounded-full">
          ×{pool.rolls} rolls
        </span>
                <span
                    className="text-[9px] bg-zinc-800/80 border border-zinc-700/40 text-zinc-500 px-1.5 py-0.5 rounded-full">
          {pool.entries.length} entries
        </span>
            </div>
        </button>

        {/* Delete button — visible on hover */}
        <div className="flex justify-end px-2 pb-1.5 -mt-1">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove();
                }}
                title="Xóa pool"
                className="w-5 h-5 flex items-center justify-center rounded text-zinc-700 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
            >
                <Trash2 size={10}/>
            </button>
        </div>
    </div>
);