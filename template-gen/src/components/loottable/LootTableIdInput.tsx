interface LootTableIdInputProps {
    value: string;
    onChange: (v: string) => void;
}

export const LootTableIdInput = ({value, onChange}: LootTableIdInputProps) => (
    <div className="px-4 py-3 border-b border-zinc-800/60 flex-shrink-0">
        <label className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium block mb-1.5">
            Loot Table ID
        </label>
        <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="vd: dungeon/chest_rare"
            className="h-8 w-full px-3 bg-zinc-900/80 border border-zinc-700/50 rounded-lg text-sm text-zinc-200 font-mono outline-none focus:border-zinc-500 placeholder:text-zinc-700 transition-colors"
        />
    </div>
);