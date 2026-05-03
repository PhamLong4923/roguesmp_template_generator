export interface Attribute {
    attributes: Attributes;
    slot: slot;
}

export interface Attributes {
    attack_knockback?: number;
    attack_speed_base?: number;
    block_reach?: number;
    burning_time?: number;
    critical_damage_flat?: number;
    defense_flat?: number;
    entity_reach?: number;
    fall_damage?: number;
    gravity?: number;
    jump_strength?: number;
    knockback_resistance?: number;
    luck?: number;
    max_health_flat?: number;
    max_health_percent?: number;
    melee_damage_base?: number;
    movement_efficiency?: number;
    oxygen_bonus?: number;
    projectile_damage_base?: number;
    projectile_damage_percent?: number;
    projectile_speed_base?: number;
    projectile_speed_percent?: number;
    safe_fall_distance?: number;
    scale?: number;
    sneaking_speed?: number;
    speed_flat?: number;
    speed_percent?: number;
    step_height?: number;
    submerged_mining_speed?: number;
    sweeping_damage_ratio?: number;
    water_movement_efficiency?: number;
}

type slot = "MAINHAND" | "OFFHAND"