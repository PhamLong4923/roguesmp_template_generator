import {Consumable} from "@/data/cpn/consumable";
import {Enchant} from "@/data/cpn/enchant";
import {Attribute} from "@/data/cpn/attribute";

export type Item = {
    id: string;
    base: string;
    components: {
        name: string;
        description?: string[];
        attribute?: Attribute;
        consumable?: Consumable;
        enchant?: Enchant;
    }
}