import {useState} from "react";
import {Search, X} from "lucide-react";
import {MC_ITEMS, MCItem} from "@/type/loottable";

interface ItemPickerPopupProps {
    onSelect: (item: MCItem) => void;
    onClose: () => void;
}

export const ItemPickerPopup = ({onSelect, onClose}: ItemPickerPopupProps) => {
    const [query, setQuery] = useState("");

    const filtered = MC_ITEMS.filter(
        (i) =>
            i.name.toLowerCase().includes(query.toLowerCase()) ||
            i.id.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div
                className="bg-zinc-900 border border-zinc-700/60 rounded-xl w-[480px] max-h-[500px] flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/60 flex-shrink-0">
                    <span className="text-sm font-semibold text-zinc-100">Chọn Item</span>
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
                            placeholder="Tìm item..."
                            className="flex-1 bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto px-3 pb-3">
                    {filtered.length === 0 ? (
                        <p className="text-center text-xs text-zinc-600 py-10">
                            Không tìm thấy item nào.
                        </p>
                    ) : (
                        <div className="grid grid-cols-5 gap-1.5">
                            {filtered.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        onSelect(item);
                                        onClose();
                                    }}
                                    className="flex flex-col items-center gap-1.5 p-2 pt-2.5 rounded-lg border border-zinc-700/50 bg-zinc-800/50 hover:border-emerald-500/40 hover:bg-emerald-500/8 transition-all group cursor-pointer"
                                >
                                    <span className="text-2xl leading-none">{item.icon}</span>
                                    <span
                                        className="text-[9px] text-zinc-500 group-hover:text-zinc-300 truncate w-full text-center transition-colors leading-tight">
                    {item.name}
                  </span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};