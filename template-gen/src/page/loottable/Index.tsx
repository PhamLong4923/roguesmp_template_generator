import {TooltipProvider} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";

export const LootTablePage = (): JSX.Element => {

    return (
        <TooltipProvider>
            <div
                className="min-h-screen text-zinc-100"
                style={{
                    background: "linear-gradient(160deg, #0b0b14 0%, #0f0f1e 60%, #0a0e1a 100%)",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                }}
            >
                <div
                    className="border-b border-zinc-800/80 px-6 py-3 flex items-center gap-3"
                    style={{background: "rgba(10,10,20,0.9)", backdropFilter: "blur(8px)"}}
                >
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
                    <span
                        className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">LootTable</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.1 — dev
                    </Badge>
                </div>

                <div className={"flex h-[calc(100vh-49px)]"}>

                </div>

            </div>
        </TooltipProvider>
    )
}