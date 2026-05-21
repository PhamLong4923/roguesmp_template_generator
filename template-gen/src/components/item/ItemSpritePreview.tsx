import {useMcItemSprite} from "@/hooks/use-mc-item-sprite";

interface ItemSpritePreviewProps {
    base: string;
}

const itemImages: Record<string, string> = import.meta.glob('../../public/data/item_texture/*.png', {
    eager: true,
    import: 'default'
});

export function ItemSpritePreview({base}: ItemSpritePreviewProps): JSX.Element {
    const {spriteUrl, fallbackColor, label} = useMcItemSprite(base);

    return (
        <div
            className="aspect-square rounded-xl border-2 border-zinc-700 flex items-center justify-center relative overflow-hidden"
            style={{
                background: "linear-gradient(145deg, #1a1a2e, #16213e)",
                boxShadow: "inset 0 2px 8px rgba(0,0,0,0.5)",
            }}
        >
            <div
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage:
                        "repeating-linear-gradient(0deg,transparent,transparent 15px,#fff 15px,#fff 16px)," +
                        "repeating-linear-gradient(90deg,transparent,transparent 15px,#fff 15px,#fff 16px)",
                }}
            />
            {spriteUrl ? (
                <img
                    src={itemImages[spriteUrl]}
                    alt={label}
                    className="w-3/4 h-3/4 object-contain"
                    style={{imageRendering: "pixelated"}}
                />
            ) : base ? (
                <div className="flex flex-col items-center gap-2">
                    <div
                        className="w-14 h-14 rounded-lg border-2 border-white/20 shadow-lg"
                        style={{backgroundColor: fallbackColor}}
                    />
                    <span className="text-[10px] text-zinc-500 font-mono text-center px-2 leading-tight">
                        {label}
                    </span>
                </div>
            ) : (
                <span className="text-zinc-600 text-xs font-mono">Chọn base...</span>
            )}
        </div>
    );
}