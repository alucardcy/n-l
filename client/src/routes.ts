import Layout from "./components/layouts/Layout";
import Index from "./pages";
import Activities from "./pages/Activities";
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
                path: "links",
                Component: ActivityLinks
            },
            {
                "path": "links/:nodeId",
                Component: LinksByNode
            }
        ]
    }
]