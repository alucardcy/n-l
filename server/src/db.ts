import fs from "fs";
import csv from "csv-parser";
import camelCase from "lodash.camelcase";

type Activity = {
    nodeId: number;
    StartDate: Date
    EndDate: Date
}

export function getActivities(): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
        const results: Activity[] = [];

        fs.createReadStream('./data/activity-properties.csv')
            .pipe(csv({
                mapHeaders: ({ header }) => camelCase(header)
            }))
            .on('data', (row) => {
                // console.log(row);
                results.push(row);
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}


export function getAdjacencyMatrix(): Promise<Number[][]> {
    return new Promise((resolve, reject) => {
        const results: Number[][] = [];

        fs.createReadStream('./data/adjacency-matrix.csv')
            .pipe(csv({ headers: false }))
            .on('data', (row) => {
                results.push(Object.values(row).map(Number)); // convert strings to numbers
            })
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

type Nodes = {
    [key: number]: Activity[];
}

export function parseLinks(activities: Activity[], matrix: Number[][]): Nodes {

    const nodes: Nodes = {}

    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) {
                nodes[activities[i].nodeId] = [...nodes[activities[i].nodeId] || [], activities[j]];
            }
        }
    }
    return nodes;

}


// export function getActivityLinks(activityIndex: number): Promise<Nodes> {
//     return new Promise(async (resolve, reject) => {
//         const node : Activity[] = [];
//         try {
//             const activities = await getActivities();
//             const matrix = await getAdjacencyMatrix();
//             const links = parseLinks(activities, matrix);
//             resolve(links);
//         } catch (error) {
//             reject(error);
//         }
//     });
// }