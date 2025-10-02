import express from "express";
import cors from "cors";
import { getActivities, getActivitiesByRange, getActivityLinks, getAdjacencyMatrix, parseLinks } from "./db";
import dayjs from "dayjs";
import { getDatesBetween } from "./utils";


const app = express();
const port = 3000;


app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/activities", async (req, res) => {
    try {
        const { from, to } = req.query;
        if (from && to) {
            if (dayjs(from as string).isValid() && dayjs(to as string).isValid()) {
                console.log('Fetching activities with date range');
                const activities = await getActivitiesByRange(from as string, to as string);
                res.status(200).json(activities);
                return;
            } else {
                res.status(400).send("Invalid date format.");
            }
        }

        console.log('Fetching activities');
        const activities = await getActivities();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).send("Error reading activities");
    }

})


app.get("/matrix", async (req, res) => {
    try {
        const matrix = await getAdjacencyMatrix();
        res.json(matrix);
    } catch (error) {
        res.status(500).send("Error reading adjacency matrix");
    }
})


app.get("/links", async (req, res) => {
    try {
        const activities = await getActivities();
        const matrix = await getAdjacencyMatrix();
        const { nodes, links } = parseLinks(activities, matrix);
        // badum tssss
        res.status(200).json({ nodes, links });
    } catch (error) {
        console.log(error);

        res.status(500).send("Error processing links");
    }
});


app.get("/activity/:id/links", async (req, res) => {
    const nodeId = parseInt(req.params.id);

    if (isNaN(nodeId)) {
        res.status(400).send("Invalid activity index");
        return;
    }

    try {
        const result = await getActivityLinks(nodeId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error processing activity links");
    }

});


app.get("/getActiveNodes", async (req, res) => {
    try {
        const { from, to } = req.query;
        if (!dayjs(from as string).isValid() && !dayjs(to as string).isValid()) {
            res.status(400).send("Invalid date format");
            return
        }

        const dates = getDatesBetween(from as string, to as string);
        const activities = await getActivitiesByRange(from as string, to as string);

        const activityCounts = dates.map(date =>
            activities.filter(activity =>
                new Date(date) >= new Date(activity.startDate) && new Date(date) <= new Date(activity.endDate)).length);

        res.status(200).json({ dates, activities: activityCounts });

    } catch (error) {
        res.status(500).send("Error processing active nodes");
    }
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

