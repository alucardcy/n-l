import Layout from "./components/layouts/Layout";
import Index from "./pages";
import Activities from "./pages/activities";

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
            }
        ]
    }
]