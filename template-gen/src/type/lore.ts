export interface LoreContributor<T> {
    locationIndex: number;
    componentKey: string;
    buildLines: (data: T) => LoreLine[];
}

export interface LoreLine {
    text: string;
    indent?: boolean;
}