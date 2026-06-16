import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useItemOptions, ItemOption } from "@/hooks/use-item-options";
import { ItemSpritePreview } from "@/components/item/ItemSpritePreview";

interface ItemPickerPopupProps {
    onSelect: (id: string) => void;
    onClose: () => void;
}

const VANILLA_LIMIT = 60; // avoid rendering ~1300 vanilla items at once

function match(o: ItemOption, q: string): boolean {
    return o.id.toLowerCase().includes(q) || o.name.toLowerCase().includes(q);
}

export const ItemPickerPopup = ({ onSelect, onClose }: ItemPickerPopupProps) => {
    const [query, setQuery] = useState("");
    const { custom, vanilla } = useItemOptions();

    const q = query.toLowerCase();
    const customMatches = useMemo(() => custom.filter((o) => match(o, q)), [custom, q]);
    const vanillaMatches = useMemo(
        () => vanilla.filter((o) => match(o, q)).slice(0, VANILLA_LIMIT),
        [vanilla, q]
    );

    const pick = (id: string) => {
        onSelect(id);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-zinc-900 border border-zinc-700/60 rounded-xl w-[520px] max-h-[560px] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/60 flex-shrink-0">
                    <span className="text-sm font-semibold text-zinc-100">Chọn Item</span>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors"
                    >
                        <X size={14} />
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 pt-3 pb-2 flex-shrink-0">
                    <div className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 h-8">
                        <Search size={12} className="text-zinc-500 flex-shrink-0" />
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm custom hoặc vanilla item..."
                            className="flex-1 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Lists */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
                    <Section title={`Custom (${customMatches.length})`} items={customMatches} onPick={pick} accent="emerald" />
                    <Section title={`Vanilla (${vanillaMatches.length}${vanilla.length > VANILLA_LIMIT ? "+" : ""})`} items={vanillaMatches} onPick={pick} accent="sky" />
                    {customMatches.length === 0 && vanillaMatches.length === 0 && (
                        <p className="text-center text-xs text-zinc-600 py-10">Không tìm thấy item nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

function Section({
    title, items, onPick, accent,
}: {
    title: string;
    items: ItemOption[];
    onPick: (id: string) => void;
    accent: "emerald" | "sky";
}) {
    if (items.length === 0) return null;
    const hover = accent === "emerald"
        ? "hover:border-emerald-500/40 hover:bg-emerald-500/8"
        : "hover:border-sky-500/40 hover:bg-sky-500/8";
    return (
        <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold mb-1.5">{title}</p>
            <div className="grid grid-cols-5 gap-1.5">
                {items.map((item) => (
                    <button
                        key={`${item.kind}:${item.id}`}
                        onClick={() => onPick(item.id)}
                        title={item.id}
                        className={`flex flex-col items-center gap-1 p-1.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 transition-all group cursor-pointer ${hover}`}
                    >
                        <div className="w-10 h-10">
                            <ItemSpritePreview base={item.base} />
                        </div>
                        <span className="text-[9px] text-zinc-500 group-hover:text-zinc-300 truncate w-full text-center transition-colors leading-tight">
                            {item.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
