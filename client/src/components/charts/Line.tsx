import { useMemo, useRef } from "react";
import Chart from "./Chart"
import { Box } from "@mantine/core";
import type { Activity } from "@nodes-links/types";

type Props = {
    data: {
        dates: string[],
        activities: Activity[]
    }
}
const Line = ({ data: { dates, activities } }: Props) => {
    const chartRef = useRef(null);



    // ECharts option configuration
    const option = useMemo<echarts.EChartsOption | {}>(() => {
        return {
            title: {
                text: 'Node Activity Over Time (Mock Data)',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params: any) => {
                    const date = params[0].axisValue;
                    const count = params[0].data;
                    return `${date}<br/>Active Nodes: ${count}`;
                }
            },
            xAxis: {
                type: 'category',
                data: dates,
                boundaryGap: false,
            },
            yAxis: {
                type: 'value',
                name: 'Active Nodes',
                minInterval: 1,
                min: 0
            },
            series: [{
                name: 'Active Nodes',
                type: 'line',
                data: activities,
                smooth: true,
                areaStyle: {
                    opacity: 0.3
                },
                lineStyle: {
                    width: 3
                }
            }]
        }
    }, [dates, activities]);
    return (

        <Box h={{ base: "100dvh", sm: "100dvh", md: 600 }}>
            <Chart ref={chartRef} option={option} style={{ height: "100%" }} />
        </Box>
    )
}
export default Line