import fs from "fs";
import csv from "csv-parser";
import camelCase from "lodash.camelcase";
import cache from "./cache";
import { Node, Activity, Nodes, Link, MappedNodes } from "@nodes-links/types";
import dayjs from "dayjs";
import CustomParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(CustomParseFormat);

//  assuming this would have been db calls in a real app

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

                // change date format to something JS Date can parse
                const { startDate, endDate, ...rest } = row
                const formattedStartDate = dayjs(startDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
                const formattedEndDate = dayjs(endDate, 'DD/MM/YYYY', true).format('YYYY-MM-DD');
                results.push({
                    ...rest,
                    startDate: formattedStartDate,
                    endDate: formattedEndDate
                });
            })
            .on('end', () => {
                cache.set(CACHE_ACTIVITIES_KEY, results);
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

export function getActivityByIndex(nodeId: number): Promise<{ activity: Activity, index: number }> {
    return new Promise(async (resolve, reject) => {
        try {
            const activities = await getActivities();

            const index = activities.findIndex(act => {
                return +act.nodeId === nodeId;
            });

            if (index === -1) {
                reject(new Error("Activity not found"));
                return;
            }

            resolve({ activity: activities[index], index });
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
                cache.set(CACHE_MATRIX_KEY, results);
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}
// creates parent nodes and their links, and an array of all links with source and target
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
            if (+matrix[i][j] > 0) {
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


// gets all nodes(activities) and links for a given activity id
export function getActivityLinks(nodeId: number): Promise<{ nodes: MappedNodes[], links: Link[] }> {
    return new Promise(async (resolve, reject) => {
        try {
            const activities = await getActivities();
            const { activity: selectedActivity, index: activityIndex } = await getActivityByIndex(nodeId);
            const matrix = await getAdjacencyMatrix();

            const links: Link[] = [];
            const nodes: MappedNodes[] = []
            nodes.push({
                id: selectedActivity.nodeId,
                name: `Node ${selectedActivity.nodeId}`,
                nodeId: selectedActivity.nodeId,
                value: selectedActivity.nodeId,
                startDate: selectedActivity.startDate,
                endDate: selectedActivity.endDate,
                itemStyle: { color: '#0cff7eff' } // highlight selected node
            });


            if (activityIndex < 0 || activityIndex >= activities.length) {
                reject(new Error("Activity index out of bounds"));
                return;
            }

            for (let i = 0; i < matrix.length; i++) {
                for (let j = 0; j < matrix[i].length; j++) {
                    // here we only get nodes that our selected node connects to as source
                    if (activityIndex === j && +matrix[i][j] > 0) {
                        nodes.push({
                            id: activities[i].nodeId,
                            name: `Node ${activities[i].nodeId}`,
                            nodeId: activities[i].nodeId,
                            value: activities[i].nodeId,
                            startDate: activities[i].startDate,
                            endDate: activities[i].endDate,
                            itemStyle: { color: '#ffa500ff' } // highlight connected nodes
                        });
                        links.push({ source: activities[i].nodeId, target: activities[j].nodeId });
                    }

                }
            }

            resolve({ nodes, links });



        } catch (error) {
            reject(error);
        }
    });
}