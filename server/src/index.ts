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
        const from = typeof req.query.from === 'string' ? req.query.from : undefined;
        const to = typeof req.query.to === 'string' ? req.query.to : undefined;

        if (from && to) {
            if (dayjs(from).isValid() && dayjs(to).isValid()) {
                console.log('Fetching activities with date range');
                const activities = await getActivitiesByRange(from, to);
                res.status(200).json(activities);
                return;
            } else {
                res.status(400).send({ error: "Invalid date format" });
                return;
            }
        }

        console.log('Fetching activities');
        const activities = await getActivities();
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).send({ error: "Error reading activities" });
    }

})


app.get("/matrix", async (req, res) => {
    try {
        const matrix = await getAdjacencyMatrix();
        res.json(matrix);
    } catch (error) {
        res.status(500).send({ error: "Error reading adjacency matrix" });
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

        res.status(500).send({ error: "Error processing links" });
    }
});


app.get("/activity/:id/links", async (req, res) => {
    const nodeId = parseInt(req.params.id);

    if (isNaN(nodeId)) {
        res.status(400).send({ error: "Invalid activity index" });
        return;
    }

    try {
        const result = await getActivityLinks(nodeId);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send({ error: "Error processing activity links" });
    }

});


// returns dates range and array of active nodes count for each date
app.get("/getActiveNodes", async (req, res) => {
    try {
        const from = typeof req.query.from === 'string' ? req.query.from : undefined;
        const to = typeof req.query.to === 'string' ? req.query.to : undefined;

        if (!from || !to || !dayjs(from).isValid() || !dayjs(to).isValid()) {
            res.status(400).send({ error: "Invalid date format" });
            return
        }

        const dates = getDatesBetween(from as string, to as string);
        const activities = await getActivitiesByRange(from as string, to as string);

        const activityCounts = dates.map(date =>
            activities.filter(activity =>
                new Date(date) >= new Date(activity.startDate) && new Date(date) <= new Date(activity.endDate)).length);

        res.status(200).json({ dates, activities: activityCounts });

    } catch (error) {
        res.status(500).send({ error: "Error processing active nodes" });
    }
})


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

