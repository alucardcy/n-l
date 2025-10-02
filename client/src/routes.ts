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
                Component: Activities
            },
            {
                path: "activity/:nodeId",
                Component: ActivityGantt
            },
            {
                path: "links",
                Component: ActivityLinks
            },
            {
                path: "links/:nodeId",
                Component: LinksByNode
            },
            {
                path: "timeline",
                Component: ActiveNodes
            }
        ]
    }
]