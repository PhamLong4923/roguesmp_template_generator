/**
 * A custom item. `components` is an open map keyed by component id (matching the plugin's
 * `Map<String, ItemComponent>`). Each value is produced by a component descriptor's `toJson`
 * (see registry/components). Strong per-component types live in their descriptor files.
 */
export type Item = {
    id: string;
    base: string;
    components: Record<string, unknown>;
};
