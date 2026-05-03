import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { MC_COLORS, MC_FORMATS } from "@/constants/item-creator";

interface McTextEditorProps {
    label: string;
    value: string;
    onChange: (val: string) => void;
    multiline?: boolean;
}

export function McTextEditor({ label, value, onChange, multiline = false }: McTextEditorProps): JSX.Element {
    const insertTag = (tag: string): void => {
        const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(
            `[data-mctextarea="${label}"]`
        );
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const newVal = value.slice(0, start) + tag + value.slice(end);
        onChange(newVal);
        setTimeout(() => {
            el.selectionStart = el.selectionEnd = start + tag.length;
            el.focus();
        }, 0);
    };

    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                {label}
            </Label>

            <div className="flex flex-wrap gap-1 p-2 bg-zinc-900/60 rounded-lg border border-zinc-800">
                {MC_COLORS.map((c) => (
                    <TooltipProvider key={c.tag} delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => insertTag(c.tag)}
                                    className="w-4 h-4 rounded-sm border border-zinc-700 hover:scale-125 transition-transform"
                                    style={{ backgroundColor: c.color === "#000000" ? "#111" : c.color }}
                                />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">{c.tag}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
                <div className="w-px h-4 bg-zinc-700 self-center mx-0.5" />
                {MC_FORMATS.map((f) => (
                    <TooltipProvider key={f.tag} delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    type="button"
                                    onClick={() => insertTag(f.tag)}
                                    className="px-1.5 h-4 text-[10px] rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                                >
                                    {f.label}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs">{f.tag}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>

            {multiline ? (
                <Textarea
                    data-mctextarea={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    rows={4}
                    className="font-mono text-xs bg-zinc-900 border-zinc-700 text-zinc-200 resize-none"
                />
            ) : (
                <Input
                    data-mctextarea={label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={`Nhập ${label.toLowerCase()}...`}
                    className="font-mono text-xs bg-zinc-900 border-zinc-700 text-zinc-200"
                />
            )}
        </div>
    );
}