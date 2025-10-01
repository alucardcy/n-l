import { Center, Divider, Loader } from "@mantine/core";
import { useGetActivityLinks } from "../api/activityLinks";
import Graph from "../components/charts/Graph";

const ActivityLinks = () => {
    const { data, isLoading, isSuccess } = useGetActivityLinks();

    return (
        <div>
            <h1>Graph Chart showing Nodes(Activities) and their Links</h1>
            <Divider my="md" />
            {isLoading && <Center><Loader /></Center>}
            {isSuccess && data && (
                <Graph data={data} />
            )}
        </div>
    )
}
export default ActivityLinks