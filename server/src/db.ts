import fs from "fs";
import csv from "csv-parser";
import camelCase from "lodash.camelcase";
import cache from "./cache";
import { Node, Activity, Nodes, Link } from "@nodes-links/types";

// just assuming this would have been db calls in a real app

const CACHE_ACTIVITIES_KEY = 'activities';
const CACHE_MATRIX_KEY = 'matrix';
const CACHE_LINKS_KEY = 'links';

export function getActivities(): Promise<Activity[]> {
    return new Promise((resolve, reject) => {

        const cached = cache.get<Activity[]>(CACHE_ACTIVITIES_KEY);
        if (cached) {
            console.log('Returning cached activities');
            resolve(cached);
            return;
        }
        const results: Activity[] = [];

        fs.createReadStream('./data/activity-properties.csv')
            .pipe(csv({
                mapHeaders: ({ header }) => camelCase(header)
            }))
            .on('data', (row) => {
                // console.log(row);
                results.push(row);
                cache.set(CACHE_ACTIVITIES_KEY, results);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


// assume it would be a sql query with date range filtering
export function getActivitiesByRange(from: string, to: string): Promise<Activity[]> {
    return new Promise(async (resolve, reject) => {
        try {
            const activities = await getActivities();
            // filter by date range
            const filtered = activities.filter(activity => {
                const activityStart = new Date(activity.startDate);
                const activityEnd = new Date(activity.endDate);
                return activityStart >= new Date(from) && activityEnd <= new Date(to);
            });
            resolve(filtered);
        } catch (error) {
            reject(error);
        }
    });
}

// TODO cache it
export function getActivityByIndex(index: number): Promise<Activity | null> {
    return new Promise(async (resolve, reject) => {
        try {
            const activities = await getActivities();
            if (index < 0 || index >= activities.length) {
                resolve(null);
                return;
            }
            resolve(activities[index]);
        } catch (error) {
            reject(error);
        }
    });
}


export function getAdjacencyMatrix(): Promise<Number[][]> {
    return new Promise((resolve, reject) => {
        const cached = cache.get<Number[][]>(CACHE_MATRIX_KEY);
        if (cached) {
            console.log('Returning cached matrix');
            resolve(cached);
            return;
        }
        const results: Number[][] = [];

        fs.createReadStream('./data/adjacency-matrix.csv')
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                results.push(Object.values(row).map(Number)); // convert strings to numbers
            })
            .on('end', () => {
                resolve(results);
                cache.set(CACHE_MATRIX_KEY, results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
export function parseLinks(activities: Activity[], matrix: Number[][]): { nodes: Nodes, links: Link[] } {

    const cached = cache.get<{ nodes: Nodes, links: Link[] }>(CACHE_LINKS_KEY);
    if (cached) {
        console.log('Returning cached links');
        return cached;
    }
    const nodes: Nodes = {}
    const links: Link[] = [];

    for (let i = 0; i < matrix.length; i++) {
        nodes[activities[i].nodeId] = {
            index: i,
            nodeId: activities[i].nodeId,
            startDate: activities[i].startDate,
            endDate: activities[i].endDate,
            links: []
        };
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                //welp I grouped them by nodeId but I guess it wasn't necessary
                nodes[activities[i].nodeId].links.push(activities[j]);
                links.push({
                    source: activities[i].nodeId,
                    target: activities[j].nodeId
                });
            }
        }
    }
    cache.set(CACHE_LINKS_KEY, { nodes, links });
    return { nodes, links };

}


// gets all links for a given activity index
export function getActivityLinks(activityIndex: number): Promise<Node> {
    return new Promise(async (resolve, reject) => {
        try {
            const activities = await getActivities();
            const activityByIndex = await getActivityByIndex(activityIndex);
            const matrix = await getAdjacencyMatrix();

            const node: Node = {
                index: activityIndex,
                startDate: activityByIndex?.startDate as Date,
                endDate: activityByIndex?.endDate as Date,
                nodeId: activityByIndex ? activityByIndex.nodeId : -1,
                links: []
            };

            if (activityIndex < 0 || activityIndex >= activities.length) {
                reject(new Error("Activity index out of bounds"));
                return;
            }

            for (let i = 0; i < matrix.length; i++) {

                if (activityIndex === i) {
                    for (let j = 0; j < matrix[i].length; j++) {
                        if (matrix[i][j] === 1) {
                            node.links.push(activities[j]);
                        }
                    }
                } else {
                    if (matrix[i][activityIndex] === 1) {
                        node.links.push(activities[i]);
                    }
                }


            }
            resolve(node)

        } catch (error) {
            reject(error);
        }
    });
}