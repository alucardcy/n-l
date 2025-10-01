import { useMemo, useRef } from "react";
import Chart from "./Chart";
import type { Category, Link, MappedNodes } from "@nodes-links/types";
import type { EChartsOption } from "echarts";
import { Box } from "@mantine/core";

type Props = {
    data: {
        nodes: MappedNodes[],
        links: Link[]
        categories: Category[]
    }
}
const Graph = ({ data }: Props) => {
    const chartRef = useRef<any>(null);

    const option = useMemo<EChartsOption | {}>(() => {
        if (!data) return {};
        return {
            tooltip: {
                formatter: (params: any) => {
                    if (params.dataType === 'node') {
                        return `
                            <strong>${params.data.name}</strong><br/>
                            Connections: ${params.data.connections || 0}<br/>
                            Node ID: ${params.data.nodeId}
                        `;
                    }
                    return ``;
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                data: data.nodes,
                links: data.links,
                categories: data.categories,
                roam: true,
                label: { show: true },
                emphasis: { focus: 'adjacency' },
                force: {
                    repulsion: 100,
                    // edgeLength: [50, 200],
                },

            }]

        }
    }, [data]);
    return (
        <Box h={{ base: "100dvh", sm: "100dvh", md: 600 }}>
            <Chart ref={chartRef} option={option} style={{ height: "100%" }} />
        </Box>
    )
}


export default Graph