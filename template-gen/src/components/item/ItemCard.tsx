// ItemCard.tsx
import {Card} from "@/components/ui/card";
import {Item} from "@/data/item";
import {ItemSpritePreview} from "@/components/item/ItemSpritePreview";
import {McTextLine} from "@/components/item/McTextLine";
import {LORE_CONTRIBUTORS} from "@/utils/lore";
import {Consumable} from "@/data/cpn/consumable";
import {Attribute} from "@/data/cpn/attribute";
import {Enchant} from "@/data/cpn/enchant";
import {cn} from "@/lib/utils";

interface ComponentsData {
    consumable?: Consumable;
    attribute?: Attribute;
    enchant?: Enchant;
}

interface ItemCardProps {
    item: Item;
    selected?: boolean;
    onClick?: () => void;
    variant?: "compact" | "full";
}

const MC_FONT: React.CSSProperties = {
    fontFamily: "'Minecraft','Courier New',monospace",
};

export function ItemCard({
                             item,
                             selected = false,
                             onClick,
                             variant = "compact",
                         }: ItemCardProps): JSX.Element {
    const {name, description, consumable, attribute, enchant} = item.components;
    const components: ComponentsData = {consumable, attribute, enchant};

    const descLines = description ?? [];

    const contributorLines = LORE_CONTRIBUTORS.flatMap((c) => {
        const data = components[c.componentKey as keyof ComponentsData];
        return data ? c.buildLines(data as never) : [];
    });

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
                {/* Glow */}
                <div
                    className="pointer-events-none absolute -top-4 -right-4 w-16 h-16 rounded-full bg-[#6d3fc5]/15 blur-xl group-hover:bg-[#9660f0]/25 transition-colors duration-500"/>

                {/* Sprite — fixed square container */}
                <div className="w-full" style={{aspectRatio: "1/1"}}>
                    <ItemSpritePreview base={item.base}/>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#5a3e8a]/50 to-transparent"/>

                {/* Name */}
                <div className="text-[10px] leading-tight line-clamp-2" style={MC_FONT}>
                    <McTextLine text={name}/>
                </div>

                {/* First desc line only */}
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
            {/* Glow */}
            <div
                className="pointer-events-none absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#6d3fc5]/10 blur-3xl"/>

            {/* ── Sprite + Name side by side ── */}
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

            {/* ── Description ── */}
            {descLines.length > 0 && (
                <>
                    <div className="h-px bg-gradient-to-r from-transparent via-[#5a3e8a]/50 to-transparent"/>
                    <div className="space-y-0.5">
                        {descLines.map((line, i) => (
                            <div key={i} className="text-xs leading-relaxed" style={MC_FONT}>
                                <McTextLine text={line}/>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* ── Stats from contributors ── */}
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

            {/* ── Badges ── */}
            <div className="flex flex-wrap gap-1.5 pt-1">
                {consumable && <Badge label="Consumable" color="#3e7c5e"/>}
                {attribute && <Badge label="Attribute" color="#1a6eb5"/>}
                {enchant && <Badge label="Enchant" color="#7c3aed"/>}
            </div>
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