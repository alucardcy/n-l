
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"
import type { Link, Nodes, Node, MappedNodes, Category } from "@nodes-links/types"
import { mapObject } from "../hooks/general"
import type { AxiosError } from "axios"




/**
 * 
 * JUST FOR REFERENCE - GRAPH TRAVERSAL ALGORITHMS
 * THIS WAS ALL DONE IN THE CLIENT, BUT  SHOULD BE IN THE SERVER
 * ALSO AI HELPED A LOT BUT I AM KEEPING FOR CONVERSATION
 * PROMPT USE WAS SOMETHING ALONG THE LINES OF:
 * I want to create a pool to keep track of connected nodes in order to create categories
 * 
 * BFS (Breadth‑First Search)
Visits nodes level by level (all neighbors at distance 1, then distance 2, …).
Uses a queue.
Good for: shortest path in unweighted graphs, finding all nodes reachable within X hops, connected components (level expansion).
Complexity: O(V + E) time, O(V) extra space (queue + visited).
Short pseudocode (using your adjacency: Map<number, Set<number>>):

DFS (Depth‑First Search)
Explores as far as possible down one branch before backtracking.
Uses recursion or an explicit stack.
Good for: detecting cycles, topological sort, connected components, exploring full paths.
Complexity: O(V + E) time, O(V) recursion/stack space.
Short pseudocode (recursive):

 */

// data transformation here, applied caching through react-query
const getActivityLinks = async (): Promise<{ nodes: MappedNodes[], links: Link[], categories: Category[] }> => {
    const { data } = await axiosInstance.get<{ nodes: Nodes, links: Link[] }>("/links")
    const { nodes, links } = data;

    // convert nodes to something that can be used in the graph
    const mappedNodes = mapObject<Node, MappedNodes>(nodes, (key, value) => {

        return {
            id: key,
            name: `Node ${value.nodeId}`,
            nodeId: value.nodeId,
            value: value.nodeId,
            startDate: value.startDate,
            endDate: value.endDate,
        }
    })



    // build quick lookup by nodeId
    const nodeById = new Map<number, MappedNodes>();
    mappedNodes.forEach(n => nodeById.set(n.nodeId, n));

    // build adjacency list (undirected)
    const adjacency = new Map<number, Set<number>>();
    mappedNodes.forEach(n => adjacency.set(n.nodeId, new Set<number>()));
    links.forEach(l => {
        // ensure entries exist for safety
        if (!adjacency.has(l.source)) adjacency.set(l.source, new Set());
        if (!adjacency.has(l.target)) adjacency.set(l.target, new Set());
        adjacency.get(l.source)!.add(l.target);
        adjacency.get(l.target)!.add(l.source);
    });

    // find connected components (pools) using BFS/DFS
    const visited = new Set<number>();
    const categories: Category[] = [];
    let poolId = 0;

    for (const n of mappedNodes) {
        const startId = n.nodeId;
        if (visited.has(startId)) continue;

        // new pool
        const queue: number[] = [startId];
        visited.add(startId);

        while (queue.length) {
            const current = queue.shift()!;
            const neighbors = adjacency.get(current);
            // assign category to node
            const mapped = nodeById.get(current);
            if (mapped) mapped.category = poolId;

            if (neighbors) {
                for (const neigh of neighbors) {
                    if (!visited.has(neigh)) {
                        visited.add(neigh);
                        queue.push(neigh);
                    }
                }
            }
        }

        categories.push({ id: poolId, name: `Pool ${poolId + 1}` });
        poolId++;
    }

    // calculate connections and symbol size
    mappedNodes.forEach(node => {
        const conns = adjacency.get(node.nodeId)?.size ?? 0;
        node.connections = conns;
        node.symbolSize = 10 + conns * 2;
    });

    return { nodes: mappedNodes, links, categories };
}

export const useGetActivityLinks = () => {
    return useQuery({
        queryKey: ['links'],
        queryFn: () => getActivityLinks(),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5 // 5 minutes,
    })
}


const getLinksByNode = async (nodeId: string): Promise<{ nodes: MappedNodes[], links: Link[] }> => {
    const { data } = await axiosInstance.get<{ nodes: MappedNodes[], links: Link[] }>(`/activity/${nodeId}/links`)
    return data
}

export const useGetLinksByNode = (nodeId: string) => {
    return useQuery<{ nodes: MappedNodes[], links: Link[] }, AxiosError>({
        queryKey: ['links', nodeId],
        queryFn: () => getLinksByNode(nodeId),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes,
        retry: false,
        // enabled: !!nodeId, // only run if nodeId is valid
    })
}
