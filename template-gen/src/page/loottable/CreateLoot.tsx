import {TooltipProvider} from "@/components/ui/tooltip";
import {Badge} from "@/components/ui/badge";
import {useCallback, useState} from "react";
import {LootTable, PoolInfo} from "@/type/loottable";
import {useCreateLoot} from "@/hooks/use-loottable";
import {ScrollArea} from "@/components/ui/scroll-area";

export const CreateLootTablePage = (): JSX.Element => {

    const [path, setPath] = useState<string>("");
    const [id, setId] = useState<string>("");

    const createLoot = useCreateLoot();

    //component data
    const [loot, setLoot] = useState<LootTable>();
    const [pool, setPool] = useState<PoolInfo[]>([]);

    const buildLootTable = useCallback((): LootTable => {
        const loot: LootTable = {
            id: id,
            pools: pool,
        }
        return loot;
    }, [id, pool])

    //handler
    const handleSave = async () => {
        const loot = buildLootTable();
        if (!loot.id || loot.pools.length === 0) {
            alert("Hãy điền đầy đủ thông tin trước khi tạo!");
            return;
        }
        try {
            await createLoot.mutateAsync(loot);
            alert("Lưu thành công!");
        } catch (e) {
            alert("Lỗi: " + (e as Error).message);
        }
    }

    const handleGenerateJson = () => {
        navigator.clipboard.writeText(JSON.stringify(buildLootTable(), null, 2));
        alert("Đã copy JSON vào clipboard!");
    }

    const handleRefresh = () => {
        setId("");
        setPool([]);
    }

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
                        className="text-sm font-semibold text-zinc-300 tracking-wider uppercase">LootTable Creator</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-500 ml-auto">
                        v0.1 — dev
                    </Badge>
                </div>

                <div className={"flex h-[calc(100vh-49px)]"}>
                    {/*Preview data*/}
                    <div
                        className="w-1/3 border-r border-zinc-800 flex flex-col p-4 gap-4 overflow-hidden"
                        style={{background: "rgba(10,10,18,0.6)"}}
                    >
                        <ScrollArea className="flex-1 h-full rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                                    type="auto">
                            <pre
                                className="text-[10px] text-emerald-400 leading-relaxed whitespace-pre-wrap break-all">
                                {JSON.stringify(buildLootTable(), null, 2)}
                            </pre>
                        </ScrollArea>
                    </div>

                    {/*Config panel*/}
                    <div className="w-1/2 border-r border-zinc-800 flex flex-col overflow-hidden"
                         style={{alignItems: "center", background: "rgba(10,10,18,0.6)"}}>
                        <div>

                        </div>
                    </div>

                    <div className="flex-1 border-r border-zinc-800 flex flex-col overflow-hidden"
                         style={{alignItems: "center", background: "rgba(10,10,18,0.6)"}}>

                    </div>
                </div>

            </div>
        </TooltipProvider>
    )
}