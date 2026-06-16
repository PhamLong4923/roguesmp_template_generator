import { ComponentDescriptor } from "./types";
import { nameComponent } from "./name";
import { descriptionComponent } from "./description";
import { attributeComponent } from "./attribute";
import { enchantComponent } from "./enchant";
import { consumableComponent } from "./consumable";
import { durabilityComponent } from "./durability";
import { stackSizeComponent } from "./stack-size";
import { socketComponent } from "./socket";
import { gemDataComponent } from "./gem-data";
import { potionContentComponent } from "./potion-content";
import { headSkinComponent } from "./head-skin";
import { walletComponent } from "./wallet";
import { itemModelComponent } from "./item-model";

/**
 * The single source of truth for every item component the web supports.
 * Mirrors the plugin's `ComponentKeys` registry — adding a component is one entry here
 * plus its descriptor file. Order = display order in the editor (grouped by `group`).
 */
export const ITEM_COMPONENTS: ComponentDescriptor[] = [
    nameComponent,
    descriptionComponent,
    attributeComponent,
    enchantComponent,
    consumableComponent,
    durabilityComponent,
    stackSizeComponent,
    socketComponent,
    gemDataComponent,
    potionContentComponent,
    headSkinComponent,
    walletComponent,
    itemModelComponent,
];

export const COMPONENT_MAP: Record<string, ComponentDescriptor> = Object.fromEntries(
    ITEM_COMPONENTS.map((c) => [c.key, c])
);

/** Lore contributors from every component that defines one, ordered by location index. */
export const LORE_CONTRIBUTORS = ITEM_COMPONENTS
    .filter((c) => c.lore)
    .map((c) => ({ key: c.key, lore: c.lore! }))
    .sort((a, b) => a.lore.locationIndex - b.lore.locationIndex);

export * from "./types";
