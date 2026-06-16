import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ScalarFieldProps {
    label?: string;
    hint?: string;
    type: "number" | "string" | "boolean";
    value: string | number | boolean | undefined;
    onChange: (val: string | number | boolean) => void;
    placeholder?: string;
}

/**
 * A single labelled value editor. Used by single-value components
 * (name, durability, stack_size, socket, head_skin, wallet, item_model).
 */
export function ScalarField({ label, hint, type, value, onChange, placeholder }: ScalarFieldProps): JSX.Element {
    if (type === "boolean") {
        return (
            <div className="flex items-center justify-between py-2">
                <div className="flex flex-col">
                    {label && <Label className="text-xs text-zinc-300">{label}</Label>}
                    {hint && <span className="text-[10px] text-zinc-600">{hint}</span>}
                </div>
                <Switch
                    checked={!!value}
                    onCheckedChange={(checked: boolean) => onChange(checked)}
                    className="data-[state=unchecked]:bg-zinc-700 data-[state=checked]:bg-emerald-500 [&>span]:bg-white"
                />
            </div>
        );
    }

    return (
        <div className="space-y-1.5 py-1">
            {label && <Label className="text-xs font-semibold text-zinc-400">{label}</Label>}
            <Input
                type={type === "number" ? "number" : "text"}
                value={(value as string | number) ?? ""}
                onChange={(e) =>
                    onChange(type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)
                }
                className="h-8 text-sm bg-zinc-900 border-zinc-700 text-zinc-100 font-mono"
                placeholder={placeholder ?? (type === "number" ? "0" : "...")}
            />
            {hint && <span className="text-[10px] text-zinc-600">{hint}</span>}
        </div>
    );
}
