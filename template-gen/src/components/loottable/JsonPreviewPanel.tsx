import {ScrollArea} from "@/components/ui/scroll-area";
import {LootTable} from "@/type/loottable";

interface JsonPreviewPanelProps {
    data: LootTable;
}

export const JsonPreviewPanel = ({data}: JsonPreviewPanelProps) => (
    <div className="w-[456px] flex-shrink-0 border-r border-border/60 flex flex-col overflow-hidden bg-zinc-950/40">
        <div className="px-3 py-2 border-b border-border/60 flex-shrink-0">
      <span className="text-[10px] tracking-widest uppercase text-muted-foreground/50 font-medium">
        Preview
      </span>
        </div>
        <ScrollArea className="flex-1">
      <pre className="p-3 text-[10px] text-emerald-400/90 leading-relaxed whitespace-pre-wrap break-all font-mono">
        {JSON.stringify(data, null, 2)}
      </pre>
        </ScrollArea>
    </div>
);