import express from "express";
import cors from "cors";
import { getActivities, getActivityLinks, getAdjacencyMatrix, parseLinks } from "./db";


const app = express();
const port = 3000;


app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/activities", async (req, res) => {
    try {
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
        const links = parseLinks(activities, matrix);
        res.json(links);
    } catch (error) {
        console.log(error);

        res.status(500).send("Error processing links");
    }
});


app.get("/activity/:index/links", async (req, res) => {
    const index = parseInt(req.params.index);
    if (isNaN(index)) {
        res.status(400).send("Invalid activity index");
        return;
    }

    try {
        const links = await getActivityLinks(index);
        res.json(links);
    } catch (error) {
        console.log(error);
        res.status(500).send("Error processing activity links");
    }

});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

