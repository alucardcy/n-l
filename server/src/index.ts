import express from "express";
import { getActivities, getAdjacencyMatrix, parseLinks } from "./db";


const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
});


app.get("/activity", async (req, res) => {
    try {
        const activities = await getActivities();
        res.json(activities);
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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

