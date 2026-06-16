import { Slot } from "@/type/item-creator";

// Attribute id → value map. Ids mirror the plugin `Attributes` enum @SerializedName
// (see registry/attribute-registry.ts). Kept as an open record so adding/removing
// attributes only touches the registry, never this type.
export type Attributes = Record<string, number>;

export interface Attribute {
    attributes: Attributes;
    slot: Slot;
}
