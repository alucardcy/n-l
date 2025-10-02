import { Center } from "@mantine/core";
import { useParams } from "react-router"
import { useGetLinksByNode } from "../api/activityLinks";
import Gantt from "../components/charts/Gantt";

const ActivityGantt = () => {
    const params = useParams<{ nodeId: string }>();
    const { data, isSuccess } = useGetLinksByNode(params.nodeId!)

    return (
        <div>
            <Center>
                <h1>Gantt Chart for Node {params.nodeId}</h1>
            </Center>
            {isSuccess && <Gantt data={data.nodes} />}
        </div>
    )
}
export default ActivityGantt