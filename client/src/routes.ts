import Layout from "./components/layouts/Layout";
import Index from "./pages";

export default [
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: Index
            }
        ]
    }
]