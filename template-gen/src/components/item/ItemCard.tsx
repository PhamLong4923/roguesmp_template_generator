// ItemCard.tsx — registry-driven preview of a saved item.
import {Card} from "@/components/ui/card";
import {Item} from "@/data/item";
import {ItemSpritePreview} from "@/components/item/ItemSpritePreview";
import {McTextLine} from "@/components/item/McTextLine";
import {LORE_CONTRIBUTORS, COMPONENT_MAP} from "@/registry/components";
import {cn} from "@/lib/utils";

interface ItemCardProps {
    item: Item;
    selected?: boolean;
    onClick?: () => void;
    variant?: "compact" | "full";
}

const MC_FONT: React.CSSProperties = {
    fontFamily: "'Minecraft','Courier New',monospace",
};

// component keys that are rendered elsewhere (name as title, description inline)
const NON_BADGE_KEYS = new Set(["name", "description"]);

export function ItemCard({
                             item,
                             selected = false,
                             onClick,
                             variant = "compact",
                         }: ItemCardProps): JSX.Element {
    const components = item.components ?? {};
    const name = (components.name as string) ?? "";
    const descLines = (components.description as string[]) ?? [];

    const contributorLines = LORE_CONTRIBUTORS.flatMap(({key, lore}) => {
        const data = components[key];
        return data !== undefined && data !== null ? lore.buildLines(data as never) : [];
    });

    const badgeKeys = Object.keys(components).filter((k) => !NON_BADGE_KEYS.has(k));

    if (variant === "compact") {
        return (
            <Card
                onClick={onClick}
                className={cn(
                    "group relative overflow-hidden cursor-pointer transition-all duration-200 select-none",
                    "border bg-linear-to-b from-[#0e0e1f] to-[#09091a]",
                    "hover:border-[#7c5cbf] hover:shadow-[0_0_14px_2px_rgba(124,92,191,0.3)]",
                    selected
                        ? "border-[#a07df5] shadow-[0_0_18px_3px_rgba(160,125,245,0.4)] ring-1 ring-[#a07df5]/30"
                        : "border-[#2e2060]",
                    "p-2 flex flex-col gap-1.5",
                )}
            >
                <div
                    className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#6d3fc5]/15 blur-xl group-hover:bg-[#9660f0]/25 transition-colors duration-500"/>

                <div className="w-full" style={{aspectRatio: "1/1"}}>
                    <ItemSpritePreview base={item.base}/>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-[#5a3e8a]/50 to-transparent"/>

                <div className="text-[10px] leading-tight line-clamp-2" style={MC_FONT}>
                    <McTextLine text={name}/>
                </div>

                {descLines[0] && (
                    <div className="text-[8px] leading-tight opacity-60 truncate" style={MC_FONT}>
                        <McTextLine text={descLines[0]}/>
                    </div>
                )}
            </Card>
        );
    }

    /* ── FULL DETAIL LAYOUT ─────────────────────────── */
    return (
        <Card
            className={cn(
                "relative overflow-hidden border border-[#3d2d6e]",
                "bg-gradient-to-b from-[#0e0e1f] to-[#09091a]",
                "p-4 flex flex-col gap-3",
            )}
        >
            <div
                className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#6d3fc5]/10 blur-3xl"/>

            <div className="flex items-start gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                    <ItemSpritePreview base={item.base}/>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <div className="text-base leading-snug mb-1" style={MC_FONT}>
                        <McTextLine text={name}/>
                    </div>
                    <div className="text-[10px] text-[#7c5cbf] font-mono opacity-70 truncate">{item.base}</div>
                    <div className="text-[10px] text-zinc-600 font-mono mt-0.5">ID: {item.id}</div>
                </div>
            </div>

            {/* ── Lore (description + stats) from contributors ── */}
            {contributorLines.length > 0 && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#5a3e8a]/50 to-transparent"/>
                    <div className="space-y-0.5">
                        {contributorLines.map((line, i) => (
                            <div
                                key={i}
                                className={cn("text-xs", line.indent && "pl-3 border-l border-[#5a3e8a]/40")}
                                style={MC_FONT}
                            >
                                <McTextLine text={line.text}/>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Component badges ── */}
            {badgeKeys.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {badgeKeys.map((k) => (
                        <Badge key={k} label={COMPONENT_MAP[k]?.label ?? k} color="#6d3fc5"/>
                    ))}
                </div>
            )}
        </Card>
    );
}

function Badge({label, color}: { label: string; color: string }) {
    return (
        <span
            className="inline-block px-2 py-0.5 rounded text-[9px] font-mono border"
            style={{
                color,
                borderColor: `${color}55`,
                backgroundColor: `${color}18`,
                fontFamily: "'Minecraft','Courier New',monospace",
            }}
        >
            {label}
        </span>
    );
}
