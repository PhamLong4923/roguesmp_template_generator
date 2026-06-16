import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
    value: string;
    label?: string;
    hint?: string;
}

interface SelectFieldProps {
    label?: string;
    value: string;
    onChange: (val: string) => void;
    options: Array<string | SelectOption>;
    placeholder?: string;
    inline?: boolean;
}

function normalize(o: string | SelectOption): SelectOption {
    return typeof o === "string" ? { value: o } : o;
}

/** Labelled enum dropdown. Used for slot, consumable animation, and id pickers. */
export function SelectField({ label, value, onChange, options, placeholder, inline }: SelectFieldProps): JSX.Element {
    const opts = options.map(normalize);

    const select = (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="h-7 text-xs bg-zinc-900 border-zinc-700 text-zinc-100">
                <SelectValue placeholder={placeholder ?? "Chọn..."} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700 text-zinc-100">
                {opts.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs font-mono">
                        <span className="font-mono">{o.label ?? o.value}</span>
                        {o.hint && <span className="text-zinc-500 ml-2">{o.hint}</span>}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );

    if (inline) {
        return (
            <div className="flex items-center gap-3">
                {label && <Label className="text-xs text-zinc-400 w-16 shrink-0">{label}</Label>}
                <div className="w-48">{select}</div>
            </div>
        );
    }

    return (
        <div className="space-y-1.5">
            {label && <Label className="text-xs font-semibold text-zinc-400">{label}</Label>}
            {select}
        </div>
    );
}
