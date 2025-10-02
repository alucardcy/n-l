import { em } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import type { Activity } from "@nodes-links/types";
import dayjs from "dayjs";
import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import Chart from "./Chart";
import { useNavigate } from "react-router";

type Props = {
    data: Activity[]
    duration: number
}

interface PieData {
    name: string;
    value: number;
    nodeId: number;
    duration: number;
    startDate: Date;
    endDate: Date;
}
const Pie = ({ data, duration }: Props) => {

    const chartRef = useRef<any>(null);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const navigate = useNavigate()


    const pieData = useMemo<PieData[]>(() => {
        if (!data) return [];


        // map data for pie
        const result = data.map(activity => {
            const startDate = dayjs(activity.startDate);
            const endDate = dayjs(activity.endDate);
            const durationDays = endDate.diff(startDate, 'day');

            return {
                name: `Node ${activity.nodeId}`,
                value: durationDays,
                nodeId: activity.nodeId,
                duration: durationDays,
                startDate: activity.startDate,
                endDate: activity.endDate
            };
        });

        // filter by duration if set
        if (duration > 0) {
            return result.filter(item => item.duration >= duration);
        }
        return result;
    }, [data, duration]);


    const option = useMemo(() => {

        if (!pieData.length) return {};

        return {
            // title: {
            //     text: 'Node Completion Time (Days)',
            //     left: 'center'
            // },
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    return `${params.name}: ${params.value} days<br/>${params.percent}% of total time`;
                }
            },
            legend: {
                orient: !isMobile ? 'vertical' : 'horizontal',
                left: 'left',
                type: 'scroll',
                maxHeight: 250,
            },
            series: [
                {
                    name: 'Completion Time',
                    type: 'pie',
                    radius: '50%',
                    center: ['50%', '60%'],
                    data: pieData,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        formatter: '{b}: {c} days ({d}%)'
                    }
                }
            ]
        };
    }, [pieData, isMobile]);



    useEffect(() => {


        chartRef?.current.on("click", (params: echarts.ECElementEvent) => {
            if (params.componentType === "series" && params.seriesType === "pie" && params.data) {
                // console.log(params.data);
                navigate(`/links/${(params?.data as PieData).nodeId}`)

            }
        })


    }, []);

    // useEffect(() => {



    return (
        <Chart option={option as echarts.EChartsOption} ref={chartRef} />
    )
}
export default Pie