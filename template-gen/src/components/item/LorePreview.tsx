// LorePreview.tsx — registry-driven. Iterates every component that defines a lore
// contributor, in location order, instead of knowing component types up front.
import { McTextLine } from "./McTextLine";
import { LORE_CONTRIBUTORS } from "@/registry/components";

interface LorePreviewProps {
    name: string;
    /** enabled component data keyed by component id (editor shape, e.g. { attribute: {...} }). */
    components: Record<string, unknown>;
}

export function LorePreview({ name, components }: LorePreviewProps): JSX.Element {
    const lines = LORE_CONTRIBUTORS.flatMap(({ key, lore }) => {
        const data = components[key];
        return data !== undefined && data !== null ? lore.buildLines(data as never) : [];
    });

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

            {lines.length > 0 && (
                <>
                    <div className="border-t border-[#5a3e8a]/40 my-1" />
                    <div className="space-y-0.5">
                        {lines.map((line, i) => (
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
