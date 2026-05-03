import { TextSegment } from "@/type/item-creator";
import { MC_COLORS } from "@/constants/item-creator";

export function parseMcText(text: string): TextSegment[] {
    if (!text) return [{ text: "", color: "#AAAAAA", italic: true, bold: false }];

    const colorTagMap: Record<string, string> = {};
    MC_COLORS.forEach((c) => {
        const key = c.tag.replace(/[<>]/g, "");
        colorTagMap[key] = c.color;
    });

    const segments: TextSegment[] = [];
    let currentColor = "#AAAAAA";
    let italic = true;
    let bold = false;

    const tagRegex = /<([^>]+)>/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tagRegex.exec(text)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ text: text.slice(lastIndex, match.index), color: currentColor, italic, bold });
        }
        const tag = match[1];
        if (colorTagMap[tag])   currentColor = colorTagMap[tag];
        else if (tag === "!i")   italic = false;
        else if (tag === "i")    italic = true;
        else if (tag === "bold") bold = true;
        else if (tag === "/bold") bold = false;
        lastIndex = tagRegex.lastIndex;
    }

    if (lastIndex < text.length) {
        segments.push({ text: text.slice(lastIndex), color: currentColor, italic, bold });
    }

    return segments.length
        ? segments
        : [{ text, color: currentColor, italic, bold }];
}