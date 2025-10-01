// Example shared types
export type Activity = {
    nodeId: number;
    startDate: Date
    endDate: Date
}


export type Nodes = {
    [key: number]: Node;
}

export type Node = {
    index: number;
    nodeId: number;
    links: Activity[];
}