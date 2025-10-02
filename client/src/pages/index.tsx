import { Card, Text, Stack } from "@mantine/core"
import { Link } from "react-router"

const Index = () => {
    return (
        <Stack justify="center" align="center" >
            <h1>Just the landing page</h1>
            <Stack align="center" justify="center" >
                <Card component={Link} to="/activities" shadow="sm" padding="md" withBorder radius={"md"} style={{ width: "100%", cursor: "pointer" }}>
                    <Text>Activities</Text>
                    <Text c={"dimmed"}>Shows a Pie chart with all Nodes(activities) based on how many days it took for the activity to end. Can be filtered by date range and days</Text>
                </Card>

                <Card component={Link} to="/links" shadow="sm" padding="md" withBorder radius={"md"} style={{ width: "100%", cursor: "pointer" }}>
                    <Text>Links</Text>
                    <Text c={"dimmed"}>Shows a Graph(Network) of linked nodes</Text>
                </Card>

                <Card component={Link} to="/timeline" shadow="sm" padding="md" withBorder radius={"md"} style={{ width: "100%", cursor: "pointer" }}>
                    <Text>Timeline</Text>
                    <Text c={"dimmed"}>Line Chart showing activities happening over time</Text>
                </Card>

            </Stack>
        </Stack>
    )
}
export default Index