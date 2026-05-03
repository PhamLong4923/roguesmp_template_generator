import { McTextLine } from "./McTextLine";

interface LorePreviewProps {
    name: string;
    description: string;
}

export function LorePreview({ name, description }: LorePreviewProps): JSX.Element {
    const descLines: string[] = description
        ? description.split("\n").filter((l) => l.trim())
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
        </div>
    );
}