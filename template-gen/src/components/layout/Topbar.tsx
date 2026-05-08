import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Copy, RotateCcw, Save} from "lucide-react";

interface TopBarProps {
    text: string | "";
    onCopyJson?: () => void;
    onSave?: () => void;
    onReset?: () => void;
}

export const TopBar = ({text, onCopyJson, onSave, onReset}: TopBarProps) => (
    <div
        className="h-11 border-b border-border/60 px-4 flex items-center gap-3 flex-shrink-0 bg-background/90 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0"/>
        <span className="text-xs font-semibold tracking-widest uppercase text-muted-foreground">
      {text}
    </span>
        <Badge variant="outline" className="text-[10px] ml-2 text-muted-foreground/60">
            v0.1 — dev
        </Badge>

        <div className="ml-auto flex items-center gap-2">
            {
                onCopyJson && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onCopyJson}
                        className="h-7 px-2.5 text-xs gap-1.5 text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/10 hover:text-emerald-400 hover:border-emerald-400/40"
                    >
                        <Copy size={12}/>
                        Copy JSON
                    </Button>
                )
            }
            {
                onSave && (
                    <Button
                        size="sm"
                        onClick={onSave}
                        className="h-7 px-2.5 text-xs gap-1.5 bg-emerald-500/90 hover:bg-emerald-500 text-zinc-950 border-0"
                    >
                        <Save size={12}/>
                        Save
                    </Button>
                )
            }

            {
                onReset && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onReset}
                        className="h-7 w-7 p-0 text-muted-foreground/60 hover:text-destructive hover:border-destructive/40 hover:bg-destructive/10"
                    >
                        <RotateCcw size={12}/>
                    </Button>
                )
            }

        </div>
    </div>
);