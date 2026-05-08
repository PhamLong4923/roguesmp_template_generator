import { parseMcText } from "@/utils/mc-text";

interface McTextLineProps {
    text: string;
}

export function McTextLine({ text }: McTextLineProps): JSX.Element {
    const segments = parseMcText(text);
    return (
        <span>
            {segments.map((s, i) => (
                <span
                    key={i}
                    style={{
                        color: s.color,
                        fontStyle: s.italic ? "italic" : "normal",
                        fontWeight: s.bold ? "bold" : "normal",
                        fontFamily: "'Minecraft', monospace",
                    }}
                >
                    {s.text}
                </span>
            ))}
        </span>
    );
}