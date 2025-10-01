import Layout from "./components/layouts/Layout";
import Index from "./pages";
import Activities from "./pages/Activities";
import ActivityLinks from "./pages/ActivityLinks";

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
            }
        ]
    }
]