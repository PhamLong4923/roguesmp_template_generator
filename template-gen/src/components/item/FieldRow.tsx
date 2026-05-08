import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FieldRowProps {
    label: string;
    type: "number" | "string" | "boolean";
    value: string | number | boolean | undefined;
    onChange: (val: string | number | boolean) => void;
}

export function FieldRow({ label, type, value, onChange }: FieldRowProps): JSX.Element {
    if (type === "boolean") {
        return (
            <div className="flex items-center justify-between py-1.5 px-2 rounded-md hover:bg-zinc-800/60 group">
                <Label className="text-xs text-zinc-400 group-hover:text-zinc-300 cursor-pointer">
                    {label}
                </Label>
                <Switch
                    checked={!!value}
                    onCheckedChange={(checked: boolean) => onChange(checked)}
                    className="scale-75 origin-right data-[state=unchecked]:bg-zinc-600 data-[state=checked]:bg-amber-500 [&>span]:bg-white"
                />
            </div>
        );
    }
    return (
        <div className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-zinc-800/60 group">
            <Label className="text-xs text-zinc-400 w-44 shrink-0 group-hover:text-zinc-300">
                {label}
            </Label>
            <Input
                type={type === "number" ? "number" : "text"}
                value={value as string | number ?? ""}
                onChange={(e) =>
                    onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                className="h-6 text-xs bg-zinc-900 border-zinc-700 text-zinc-100 px-2"
                placeholder={type === "number" ? "0" : "..."}
            />
        </div>
    );
}