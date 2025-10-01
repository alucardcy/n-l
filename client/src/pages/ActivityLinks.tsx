import { Center, Loader } from "@mantine/core";
import { useGetActivityLinks } from "../api/activityLinks";
import Graph from "../components/charts/Graph";

const ActivityLinks = () => {
    const { data, isLoading, isSuccess } = useGetActivityLinks();

    return (
        <div>
            <h1>Activity Links</h1>
            {isLoading && <Center><Loader /></Center>}
            {isSuccess && data && (
                <Graph data={data} />
            )}
        </div>
    )
}
export default ActivityLinks