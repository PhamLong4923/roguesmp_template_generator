// LorePreview.tsx
import { McTextLine } from "./McTextLine";
import { LORE_CONTRIBUTORS } from "@/utils/lore";
import { Consumable } from "@/data/cpn/consumable";
import {Attribute} from "@/data/cpn/attribute";
import {Enchant} from "@/data/cpn/enchant";

interface ComponentsData {
    consumable?: Consumable;
    attribute?: Attribute;
    enchant?:    Enchant;
}

interface LorePreviewProps {
    name: string;
    description: string;
    components?: ComponentsData;
}

export function LorePreview({ name, description, components }: LorePreviewProps): JSX.Element {
    const descLines = description
        ? description.split("\n").filter((l) => l.trim())
        : [];

    // Map từ contributor → đúng data của nó
    // LoreContributor<Consumable> cần Consumable, contributor khác cần data khác
    // Dùng "componentKey" trên contributor để lookup
    const contributorLines = components
        ? LORE_CONTRIBUTORS.flatMap((c) => {
            const data = components[c.componentKey as keyof ComponentsData];
            return data ? c.buildLines(data as never) : [];
        })
        : [];

    return (
        <div
            className="rounded-lg border border-[#5a3e8a] p-3 min-h-30"
            style={{
                background: "linear-gradient(135deg, #0d0d1a 0%, #12103a 100%)",
                boxShadow: "0 0 12px 2px rgba(90,62,138,0.4)",
                fontFamily: "'Minecraft', 'Courier New', monospace",
            }}
        >
            {name ? (
                <div className="text-sm mb-1">
                    <McTextLine text={name} />
                </div>
            ) : (
                <div className="text-xs text-zinc-600 italic">Tên item...</div>
            )}

            {descLines.length > 0 && (
                <>
                    <div className="border-t border-[#5a3e8a]/40 my-1" />
                    <div className="space-y-0.5">
                        {descLines.map((line, i) => (
                            <div key={i} className="text-xs">
                                <McTextLine text={line} />
                            </div>
                        ))}
                    </div>
                </>
            )}

            {contributorLines.length > 0 && (
                <>
                    <div className="border-t border-[#5a3e8a]/40 my-1" />
                    <div className="space-y-0.5">
                        {contributorLines.map((line, i) => (
                            <div key={i} className={`text-xs ${line.indent ? "pl-2" : ""}`}>
                                <McTextLine text={line.text} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}