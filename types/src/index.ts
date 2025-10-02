export type Activity = {
    nodeId: number;
    startDate: string;
    endDate: string;
};
export type Nodes = {
    [key: number]: Node;
};
export type Node = {
    index: number;
    nodeId: number;
    startDate: string;
    endDate: string;
    links: Activity[];
};

export type Link = {
    source: number;
    target: number;
}


export interface MappedNodes {
    id: string | number;
    name: string;
    nodeId: number;
    value: number;
    startDate: string;
    endDate: string;
    connections?: number;
    category?: number;
    symbolSize?: number;
    itemStyle?: { color: string }; // optional style for highlighting
}

export interface Category {
    id: number
    name: string
}