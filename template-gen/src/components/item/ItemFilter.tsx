import {Search} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {FilterState} from "@/page/item/ListItem";

interface ItemFilterProps {
    filter: FilterState;
    onChange: (filters: FilterState) => void;
}

export const ItemFilter = ({filter, onChange}: ItemFilterProps): JSX.Element => {

    //search name -
    //filter by base item
    //filter by weapon
    //filter by consumable
    //filter by potion
    //filter by armor
    //filter by tool
    //filter by material
    //filter by ore

    return (
        <div className="pt-4 flex space-between">
            <div className="w-1/6">
                <InputGroup>
                    <InputGroupInput
                        placeholder="Tìm kiếm..."
                        value={filter.search}
                        onChange={(e) => onChange({...filter, search: e.target.value})}
                    />
                    <InputGroupAddon>
                        <Search/>
                    </InputGroupAddon>
                </InputGroup>
            </div>
        </div>
    )
}