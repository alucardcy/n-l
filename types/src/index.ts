export type Activity = {
    nodeId: number;
    startDate: Date;
    endDate: Date;
};
export type Nodes = {
    [key: number]: Node;
};
export type Node = {
    index: number;
    nodeId: number;
    startDate: Date;
    endDate: Date;
    links: Activity[];
};

export type Link = {
    source: number;
    target: number;
}


export interface MappedNodes {
    id: string;
    name: string;
    nodeId: number;
    value: number;
    connections?: number;
    category?: number;
    symbolSize?: number;
}

export interface Category {
    id: number
    name: string
}