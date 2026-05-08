import {useState} from "react";
import {BookOpen, Search, X} from "lucide-react";
import {LOOT_TABLE_METAS} from "@/type/loottable";

interface LootTablePickerPopupProps {
    onSelect: (id: string) => void;
    onClose: () => void;
}

export const LootTablePickerPopup = ({onSelect, onClose}: LootTablePickerPopupProps) => {
    const [query, setQuery] = useState("");

    const filtered = LOOT_TABLE_METAS.filter((l) =>
        l.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-zinc-900 border border-zinc-700/60 rounded-xl w-[460px] max-h-[460px] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/60 flex-shrink-0">
                    <span className="text-sm font-semibold text-zinc-100">Chọn Loot Table</span>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/60 transition-colors"
                    >
                        <X size={14}/>
                    </button>
                </div>

                {/* Search */}
                <div className="px-3 pt-3 pb-2 flex-shrink-0">
                    <div
                        className="flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-lg px-3 h-8">
                        <Search size={12} className="text-zinc-500 flex-shrink-0"/>
                        <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Tìm loot table..."
                            className="flex-1 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-3 pb-3 flex flex-col gap-1.5">
                    {filtered.length === 0 ? (
                        <p className="text-center text-xs text-zinc-600 py-10">
                            Không tìm thấy loot table nào.
                        </p>
                    ) : (
                        filtered.map((lt) => (
                            <button
                                key={lt.id}
                                onClick={() => {
                                    onSelect(lt.id);
                                    onClose();
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 hover:border-violet-500/40 hover:bg-violet-500/8 transition-all text-left group cursor-pointer"
                            >
                                <div
                                    className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                                    <BookOpen size={14} className="text-violet-400"/>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate transition-colors font-mono">
                                        {lt.id}
                                    </p>
                                    <p className="text-[10px] text-zinc-600 mt-0.5">
                                        {lt.pools} pools · {lt.entries} entries
                                    </p>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};