// ListItem.tsx
import {TooltipProvider} from "@/components/ui/tooltip";
import {TopBar} from "@/components/layout/Topbar";
import {ItemFilter} from "@/components/item/ItemFilter";
import {ItemCard} from "@/components/item/ItemCard";
import {useMemo, useState} from "react";
import {Item} from "@/data/item";
import {ChevronLeft, ChevronRight, PackageOpen} from "lucide-react";
import {cn} from "@/lib/utils";
import {useItems} from "@/hooks/use-item";

export interface FilterState {
    search: string;
}

const PAGE_SIZE = 15; // 5 columns × 3 rows

export const ListItem = (): JSX.Element => {
    const {data: items = [], isLoading} = useItems();
    const [filters, setFilters] = useState<FilterState>({search: ""});
    const [page, setPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const filteredItems = useMemo(
        () =>
            items.filter((item: Item) => {
                const name = (item.components?.name as string) ?? "";
                const haystack = `${name} ${item.id}`.toLowerCase();
                return haystack.includes(filters.search.toLowerCase());
            }),
        [items, filters],
    );

    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const pageItems = filteredItems.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE,
    );

    const handleFilterChange = (f: FilterState) => {
        setFilters(f);
        setPage(1);
    };

    return (
        <TooltipProvider>
            <TopBar text="ITEM LIST"/>

            <div className="flex flex-col h-[calc(100vh-56px)] bg-[#070710]">
                {/* Filter bar */}
                <div className="px-4 border-b border-[#2a1f4d] bg-[#0a0820]/80 backdrop-blur-sm">
                    <ItemFilter filter={filters} onChange={handleFilterChange}/>
                </div>

                {/* Main content: 2/3 list + 1/3 detail */}
                <div className="flex flex-1 overflow-hidden">

                    {/* ── LEFT: 2/3 list panel ─────────────── */}
                    <div className="flex flex-col border-r border-[#2a1f4d]" style={{flex: "0 0 66.666%"}}>

                        {/* Grid */}
                        <div
                            className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3d2d6e]">
                            {isLoading ? (
                                <LoadingGrid/>
                            ) : pageItems.length === 0 ? (
                                <EmptyState/>
                            ) : (
                                <div className="grid grid-cols-5 gap-2.5">
                                    {pageItems.map((item: Item) => (
                                        <ItemCard
                                            key={item.id}
                                            item={item}
                                            variant="compact"
                                            selected={selectedItem?.id === item.id}
                                            onClick={() =>
                                                setSelectedItem(
                                                    selectedItem?.id === item.id ? null : item,
                                                )
                                            }
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        <div
                            className="flex items-center justify-between px-4 py-2.5 border-t border-[#2a1f4d] bg-[#0a0820]/60">
                            <span
                                className="text-xs text-[#5a3e8a]"
                                style={{fontFamily: "'Minecraft','Courier New',monospace"}}
                            >
                                {filteredItems.length} items — page {safePage}/{totalPages}
                            </span>

                            <div className="flex items-center gap-1">
                                <PaginationBtn
                                    disabled={safePage <= 1}
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                >
                                    <ChevronLeft className="w-3.5 h-3.5"/>
                                </PaginationBtn>

                                {/* Page numbers — show up to 5 */}
                                {buildPageNumbers(safePage, totalPages).map((n, i) =>
                                    n === "…" ? (
                                        <span key={`ellipsis-${i}`} className="px-1 text-[#5a3e8a] text-xs">
                                            …
                                        </span>
                                    ) : (
                                        <PaginationBtn
                                            key={n}
                                            active={n === safePage}
                                            onClick={() => setPage(n as number)}
                                        >
                                            {n}
                                        </PaginationBtn>
                                    ),
                                )}

                                <PaginationBtn
                                    disabled={safePage >= totalPages}
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                >
                                    <ChevronRight className="w-3.5 h-3.5"/>
                                </PaginationBtn>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: 1/3 detail panel ──────────── */}
                    <div
                        className="flex flex-col overflow-hidden"
                        style={{flex: "0 0 33.333%"}}
                    >
                        {selectedItem ? (
                            <div
                                className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#3d2d6e]">
                                {/* Panel header */}
                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="text-[10px] text-[#7c5cbf] tracking-widest uppercase"
                                        style={{fontFamily: "'Minecraft','Courier New',monospace"}}
                                    >
                                        ✦ Item Detail
                                    </span>
                                    <button
                                        onClick={() => setSelectedItem(null)}
                                        className="text-[#5a3e8a] hover:text-[#a07df5] text-xs transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <ItemCard item={selectedItem} variant="full"/>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-30">
                                <PackageOpen className="w-10 h-10 text-[#5a3e8a]"/>
                                <p
                                    className="text-xs text-[#5a3e8a] text-center"
                                    style={{fontFamily: "'Minecraft','Courier New',monospace"}}
                                >
                                    Chọn một item để xem chi tiết
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </TooltipProvider>
    );
};

/* ── Helpers ─────────────────────────────────────── */

function PaginationBtn({
                           children,
                           onClick,
                           disabled,
                           active,
                       }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    active?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "min-w-[26px] h-[26px] px-1.5 rounded text-xs font-mono transition-all duration-150",
                "border border-[#3d2d6e] bg-[#0d0d1a]",
                active
                    ? "border-[#a07df5] text-[#a07df5] bg-[#1e1040] shadow-[0_0_8px_rgba(160,125,245,0.3)]"
                    : "text-[#7c5cbf] hover:border-[#7c5cbf] hover:text-[#c4a8ff]",
                disabled && "opacity-30 cursor-not-allowed",
            )}
            style={{fontFamily: "'Minecraft','Courier New',monospace"}}
        >
            {children}
        </button>
    );
}

function buildPageNumbers(
    current: number,
    total: number,
): (number | "…")[] {
    if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
    }
    if (current < total - 2) pages.push("…");
    pages.push(total);
    return pages;
}

function LoadingGrid() {
    return (
        <div className="grid grid-cols-5 gap-2.5">
            {Array.from({length: 15}).map((_, i) => (
                <div
                    key={i}
                    className="aspect-square rounded-lg border border-[#2a1f4d] bg-[#0d0d1a] animate-pulse"
                    style={{animationDelay: `${i * 40}ms`}}
                />
            ))}
        </div>
    );
}

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center h-48 gap-3 opacity-40">
            <PackageOpen className="w-10 h-10 text-[#5a3e8a]"/>
            <p
                className="text-xs text-[#5a3e8a]"
                style={{fontFamily: "'Minecraft','Courier New',monospace"}}
            >
                Không tìm thấy item nào.
            </p>
        </div>
    );
}