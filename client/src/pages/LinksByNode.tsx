import { useParams } from "react-router"
import { useGetLinksByNode } from "../api/activityLinks"
import { Center, Divider, Loader } from "@mantine/core"
import Graph from "../components/charts/Graph"

const Links = () => {
    const params = useParams<{ nodeId: string }>()
    const { data, isLoading, isSuccess, isError, error } = useGetLinksByNode(params.nodeId!)


    return (
        <div>
            <h1>Links for Node ID: {params.nodeId}</h1>

            <Divider my="md" />
            {isLoading && <Center><Loader /></Center>}
            {isError && <Center>Error loading links: {error?.response?.data as string}</Center>}
            {isSuccess && data && (
                <Graph data={data} />
            )}
        </div>
    )
}
export default Links