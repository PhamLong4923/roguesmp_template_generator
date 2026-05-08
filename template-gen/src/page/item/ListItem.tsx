import {TooltipProvider} from "@/components/ui/tooltip";
import {TopBar} from "@/components/layout/Topbar";
import {ItemFilter} from "@/components/item/ItemFilter";
import {useMemo, useState} from "react";
import {Item} from "@/data/item";

export interface FilterState {
    search: string;
}

export const ListItem = (): JSX.Element => {

    const [items] = useState<Item[]>();
    const [filters, setFilters] = useState<FilterState>({
        search: "",
    });

    const filterItems = useMemo(() =>
        items?.filter((item: Item) => {
            //other filers then &&
            return item.components.name.toLowerCase().includes(filters.search.toLowerCase());
        }), [items, filters]
    )

    return (
        <TooltipProvider>
            <TopBar
                text={'ITEM LIST'}
            />

            <ItemFilter filter={filters} onChange={setFilters}/>

            --bot: list
        </TooltipProvider>
    )
}