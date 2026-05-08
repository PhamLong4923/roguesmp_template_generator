import {useCallback, useState} from "react";
import {TooltipProvider} from "@/components/ui/tooltip";
import {buildCleanLootTable, LootEntry, PoolInfo} from "@/type/loottable";
import {TopBar} from "@/components/layout/Topbar";
import {JsonPreviewPanel} from "@/components/loottable/JsonPreviewPanel";
import {LootTableIdInput} from "@/components/loottable/LootTableIdInput";
import {PoolConfigPanel} from "@/components/loottable/PoolConfigPanel";
import {PoolListPanel} from "@/components/loottable/PoolListPanel";
// import { useCreateLoot } from "@/hooks/use-loottable"; // uncomment when API ready

// ── Default pool factory ──────────────────────────────────────
const makePool = (): PoolInfo => ({rolls: 1, bonus_rolls: 0, entries: []});

export const CreateLootTablePage = (): JSX.Element => {
    const [ltId, setLtId] = useState<string>("");
    const [pools, setPools] = useState<PoolInfo[]>([makePool()]);
    const [activePool, setActivePool] = useState<number>(0);

    // const createLoot = useCreateLoot();

    // ── Derived ─────────────────────────────────────────────────
    const lootData = useCallback(
        () => buildCleanLootTable(ltId, pools),
        [ltId, pools]
    );

    // ── Pool handlers ────────────────────────────────────────────
    const handleAddPool = () => {
        setPools((prev) => [...prev, makePool()]);
        setActivePool(pools.length); // new pool becomes active
    };

    const handleRemovePool = (index: number) => {
        setPools((prev) => prev.filter((_, i) => i !== index));
        setActivePool((prev) => (prev >= index && prev > 0 ? prev - 1 : prev));
    };

    const handleSelectPool = (index: number) => setActivePool(index);

    const handleRollsChange = (rolls: number) =>
        setPools((prev) => prev.map((p, i) => (i === activePool ? {...p, rolls} : p)));

    const handleBonusRollsChange = (bonus_rolls: number) =>
        setPools((prev) => prev.map((p, i) => (i === activePool ? {...p, bonus_rolls} : p)));

    // ── Entry handlers ───────────────────────────────────────────
    const handleEntryAdd = (type: LootEntry["type"]) => {
        const newEntry: LootEntry =
            type === "item"
                ? {type: "item", item_id: "diamond", min_amount: 1, max_amount: 1, weight: 1}
                : type === "loot_table"
                    ? {type: "loot_table", name: "", weight: 1}
                    : {type: "empty", weight: 1};

        setPools((prev) =>
            prev.map((p, i) =>
                i === activePool ? {...p, entries: [...p.entries, newEntry]} : p
            )
        );
    };

    const handleEntryChange = (entryIndex: number, patch: Partial<LootEntry>) => {
        setPools((prev) =>
            prev.map((p, i) =>
                i === activePool
                    ? {
                        ...p,
                        entries: p.entries.map((e, j) =>
                            j === entryIndex ? ({...e, ...patch} as LootEntry) : e
                        ),
                    }
                    : p
            )
        );
    };

    const handleEntryRemove = (entryIndex: number) => {
        setPools((prev) =>
            prev.map((p, i) =>
                i === activePool
                    ? {...p, entries: p.entries.filter((_, j) => j !== entryIndex)}
                    : p
            )
        );
    };

    // ── Action handlers ──────────────────────────────────────────
    const handleCopyJson = () => {
        navigator.clipboard?.writeText(JSON.stringify(lootData(), null, 2));
        // TODO: replace alert with toast
        alert("Đã copy JSON vào clipboard!");
    };

    const handleSave = async () => {
        const data = lootData();
        if (!data.id || data.pools.length === 0) {
            alert("Hãy điền ID và thêm ít nhất 1 pool trước khi lưu!");
            return;
        }
        try {
            // await createLoot.mutateAsync(data);
            alert("✓ Lưu thành công!\nID: " + data.id);
        } catch (e) {
            alert("Lỗi: " + (e as Error).message);
        }
    };

    const handleReset = () => {
        if (!confirm("Reset toàn bộ loot table?")) return;
        setLtId("");
        setPools([makePool()]);
        setActivePool(0);
    };

    // ── Render ───────────────────────────────────────────────────
    const currentPool = pools[activePool];

    return (
        <TooltipProvider>
            <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-mono">
                <TopBar
                    text={"LOOTABLE CREATOR"}
                    onCopyJson={handleCopyJson}
                    onSave={handleSave}
                    onReset={handleReset}
                />

                <div className="flex flex-1 overflow-hidden min-h-0">
                    {/* Column 1: JSON preview */}
                    <JsonPreviewPanel data={lootData()}/>

                    {/* Column 2: Config panel */}
                    <div className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-zinc-800/60">
                        {/* LootTable ID */}
                        <LootTableIdInput value={ltId} onChange={setLtId}/>

                        {/* Pool config — only when a pool exists */}
                        {currentPool ? (
                            <PoolConfigPanel
                                poolIndex={activePool}
                                pool={currentPool}
                                onRollsChange={handleRollsChange}
                                onBonusRollsChange={handleBonusRollsChange}
                                onEntryChange={handleEntryChange}
                                onEntryRemove={handleEntryRemove}
                                onEntryAdd={handleEntryAdd}
                            />
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">
                                <p className="text-center leading-relaxed">
                                    Chưa có pool nào.
                                    <br/>
                                    <span className="text-xs text-zinc-700">Bấm + ở danh sách pool để tạo mới.</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Column 3: Pool list */}
                    <PoolListPanel
                        pools={pools}
                        activeIndex={activePool}
                        onSelect={handleSelectPool}
                        onAdd={handleAddPool}
                        onRemove={handleRemovePool}
                    />
                </div>
            </div>
        </TooltipProvider>
    );
};