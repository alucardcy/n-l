import { useEffect, useMemo, useRef } from "react";
import Chart from "./Chart";
import type { Category, Link, MappedNodes } from "@nodes-links/types";
import type { EChartsOption } from "echarts";
import { Box } from "@mantine/core";
import { useNavigate } from "react-router";
import dayjs from "dayjs";

type Props = {
    data: {
        nodes: MappedNodes[],
        links: Link[]
        categories?: Category[]
    }
}
const Graph = ({ data }: Props) => {
    const chartRef = useRef<echarts.ECharts | null>(null);
    const navigate = useNavigate()

    const option = useMemo<EChartsOption | {}>(() => {
        if (!data) return {};
        return {
            // Turn off global animation to avoid nodes animating on each update
            animation: false,
            // Make sure update durations are zero so layout jumps to final state
            animationDuration: 0,
            animationDurationUpdate: 0,
            tooltip: {
                formatter: (params: any) => {
                    if (params.dataType === 'node') {
                        const startDate = dayjs(params.data.startDate);
                        const endDate = dayjs(params.data.endDate);

                        return `
                            <strong>${params.data.name}</strong><br/>
                            Connections: ${params.data.connections || "N/A"}<br/>
                            Node ID: ${params.data.nodeId}<br/>
                            Started at: ${startDate.isValid() ? startDate.format('MMM D, YYYY') : 'N/A'}<br/>
                            Ended at: ${endDate.isValid() ? endDate.format('MMM D, YYYY') : 'N/A'}
                        `;
                    }
                    return ``;
                }
            },
            series: [{
                type: 'graph',
                layout: 'force',
                // Start with a circular initial layout so nodes don't fly in from random positions
                initLayout: 'circular',
                data: data.nodes,
                links: data.links,
                categories: data.categories,
                roam: true,
                label: { show: true },
                emphasis: { focus: 'adjacency' },
                // Disable per-series animation as well
                animation: false,
                animationDuration: 0,
                animationDurationUpdate: 0,
                force: {
                    repulsion: 100,
                    // Prevent the force layout from animating after the initial layout pass
                    layoutAnimation: false,
                    // edgeLength: [50, 200],
                },

            }]

        }
    }, [data]);


    useEffect(() => {
        if (!chartRef?.current) return undefined;
        const handleClick = (params: echarts.ECElementEvent) => {

            if (params.componentType === "series" && params.seriesType === "graph" && params.data) {
                navigate(`/activity/${(params.data as MappedNodes).nodeId}`)
            }
        }
        chartRef.current.on("click", handleClick);

        return () => {
            chartRef.current?.off("click", handleClick);
        };
    }, [chartRef.current]);


    return (
        <Box h={{ base: "100dvh", sm: "100dvh", md: 600 }} style={{ border: "1px solid lightgray", borderRadius: 8, padding: 8 }}>
            <Chart ref={chartRef} option={option} style={{ height: "100%" }} />
        </Box>
    )
}


export default Graph