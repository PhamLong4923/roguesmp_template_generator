export interface Consumable {
    hunger: number;
    saturation: number;
    canAlwaysEat: boolean;
    animation: string;
    sound: string;
    hasParticles: boolean;
    effects: Effect
}

export interface Effect{
    duration: number;
    deathBehavior: string;
    value: number;
    modifierId: string;
    display: boolean;
    id: string;
}