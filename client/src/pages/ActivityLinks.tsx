import { Center, Divider, Loader, Stack, Text } from "@mantine/core";
import { useGetActivityLinks } from "../api/activityLinks";
import Graph from "../components/charts/Graph";

const ActivityLinks = () => {
    const { data, isLoading, isSuccess } = useGetActivityLinks();

    return (
        <div>
            <Stack>
                <Text size="lg" fw={600}>Graph Chart showing Nodes(Activities) and their Links</Text>

                <Text c="dimmed">Click on a node to view gantt chart</Text>

            </Stack>
            <Divider my="md" />
            {isLoading && <Center><Loader /></Center>}
            {isSuccess && data && (
                <Graph data={data} />
            )}
        </div>
    )
}
export default ActivityLinks