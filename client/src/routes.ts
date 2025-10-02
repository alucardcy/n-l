import Layout from "./components/layouts/Layout";
import Index from "./pages";
import ActiveNodes from "./pages/ActiveNodes";
import Activities from "./pages/Activities";
import ActivityGantt from "./pages/ActivityGantt";
import ActivityLinks from "./pages/ActivityLinks";
import LinksByNode from "./pages/LinksByNode";

export default [
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: Index
            },
            {
                path: "activities",
                Component: Activities // Nodes Pie chart
            },
            {
                path: "activity/:nodeId",
                Component: ActivityGantt // Gantt chart for a specific node
            },
            {
                path: "links",
                Component: ActivityLinks // Graph chart showing nodes and their links
            },
            {
                path: "links/:nodeId",
                Component: LinksByNode // Links for a specific node
            },
            {
                path: "timeline",
                Component: ActiveNodes // Timeline Line chart
            }
        ]
    }
]