import { ItemUseAnimation } from "@/type/item-creator";

export interface Consumable {
    hunger: number;
    saturation: number;
    canAlwaysEat: boolean;
    consumeSeconds: number;
    animation: ItemUseAnimation;
    sound: string;
    hasParticles: boolean;
    effects: Effect[]
}

export interface Effect{
    duration: number;
    deathBehavior: string;
    value: number;
    modifierId: string;
    display: boolean;
    id: string;
}