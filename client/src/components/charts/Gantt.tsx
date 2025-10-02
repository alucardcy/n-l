import { Box } from "@mantine/core"
import Chart from "./Chart"
import { useMemo, useRef } from "react";
import type { MappedNodes } from "@nodes-links/types";

type Props = {
    data: MappedNodes[]
}
const Gantt = ({ data }: Props) => {
    const chartRef = useRef(null);

    const option = useMemo<echarts.EChartsOption | {}>(() => {
        if (!data) return {};

        const minMaxDate = data.reduce((acc, node) => {
            const start = new Date(node.startDate).getTime();
            const end = new Date(node.endDate).getTime();

            if (start < acc.min) acc.min = start;
            if (end > acc.max) acc.max = end;
            return acc;
        }, { min: Infinity, max: -Infinity });



        return {
            tooltip: {
                formatter: (params: any) => {
                    const node = data[params.value[0]];
                    const start = new Date(params.value[1]);
                    const end = new Date(params.value[2]);
                    return `Node Id: ${node.id}<br>${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
                }
            },
            grid: { left: 100 },
            xAxis: {
                type: 'time',
                name: "Date",
                min: new Date(minMaxDate.min),
                max: new Date(minMaxDate.max),
                axisLabel: { formatter: (val: Date) => new Date(val).toLocaleDateString() }
            },
            yAxis: {
                type: 'category',
                name: "Node ID",
                data: data.map(n => n.id),
                inverse: true,
                axisLabel: { inside: false }
            },
            series: [{
                type: 'custom',
                renderItem: (params: any, api: any) => {
                    const categoryIndex = api.value(0);
                    const start = api.coord([api.value(1), categoryIndex]);
                    const end = api.coord([api.value(2), categoryIndex]);
                    const height = api.size([0, 1])[1] * 0.6;

                    return {
                        type: 'rect',
                        shape: {
                            x: start[0],
                            y: start[1] - height / 2,
                            width: end[0] - start[0] || 1,// at least 1px width when its a single day
                            height: height,
                        },

                        style: {
                            fill: {
                                type: 'linear',
                                colorStops: [
                                    { offset: 0, color: '#003ef8ff' },
                                    { offset: 1, color: '#00f4b4ff' }
                                ]
                            },
                            stroke: '#003ef8',
                            lineWidth: 1,
                            shadowBlur: 4,
                            shadowColor: 'rgba(0,0,0,0.2)',
                            borderRadius: 4
                        },
                    };
                },
                itemStyle: { color: '#003ef8ff' },
                encode: { x: [1, 2], y: 0 },
                data: data.map((node, i) => [i, node.startDate, node.endDate]),
            }],
        }
    }, [data])



    return (

        <Box h={{ base: "100dvh", sm: "100dvh", md: 600 }} style={{ border: "1px solid lightgray", borderRadius: 8, padding: 8 }}>
            <Chart ref={chartRef} option={option as echarts.EChartsOption} style={{ height: "100%" }} />
        </Box>
    )
}
export default Gantt