// ─── Types ────────────────────────────────────────────────────────────────────

export type Slot = "MAINHAND" | "OFFHAND";

export interface McColor {
    tag: string;
    label: string;
    color: string;
}

export interface McFormat {
    tag: string;
    label: string;
}

export interface TextSegment {
    text: string;
    color: string;
    italic: boolean;
    bold: boolean;
}

export interface FieldDef {
    key: string;
    type: "number" | "string" | "boolean";
}

export interface SpriteInfo {
    spriteUrl: string | null;
    fallbackColor: string;
    label: string;
}