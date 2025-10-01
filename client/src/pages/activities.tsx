import { Button, Flex, NumberInput, TextInput } from "@mantine/core";
import { useGetActivities } from "../api/activities";
import { DatePickerInput } from "@mantine/dates";
import React, { useEffect, useMemo, useRef, useState } from "react";
import * as echarts from "echarts";
import dayjs from "dayjs";


const Activities = () => {
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
    const [duration, setDuration] = useState<number>(0);

    const { data, isLoading, error } = useGetActivities({ from: dateRange[0], to: dateRange[1] });

    const chartElRef = useRef<HTMLDivElement | null>(null);
    const chartRef = useRef<any>(null);



    const pieData = useMemo(() => {
        if (!data) return [];


        if (duration > 0) {
            return data.filter(activity => {

                const startDate = dayjs(activity.startDate);
                const endDate = dayjs(activity.endDate);
                const durationDays = endDate.diff(startDate, 'day');
                if (durationDays >= duration)
                    return {
                        name: `Node ${activity.nodeId}`,
                        value: durationDays,
                        nodeId: activity.nodeId,
                        duration: durationDays
                    };
            })
        }

        return data.map(activity => {
            const startDate = dayjs(activity.startDate);
            const endDate = dayjs(activity.endDate);
            const durationDays = endDate.diff(startDate, 'day');

            return {
                name: `Node ${activity.nodeId}`,
                value: durationDays,
                nodeId: activity.nodeId,
                duration: durationDays
            };
        });
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
                orient: 'vertical',
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
    }, [pieData]);



    useEffect(() => {
        if (!chartElRef.current) return;
        if (!chartRef.current) {
            chartRef.current = echarts.init(chartElRef.current, undefined, { renderer: "canvas" });
            const onResize = () => chartRef.current?.resize();
            window.addEventListener("resize", onResize);

            // Cleanup on unmount
            return () => {
                window.removeEventListener("resize", onResize);
                chartRef.current?.dispose();
                chartRef.current = null;
            };
        }
    }, []);

    useEffect(() => {


        if (chartRef.current && option) {
            chartRef.current.setOption(option);
        }
    }, [option]);

    return (
        <div>
            <Flex direction="column" gap="md" align="center">
                <h1>Activities</h1>
                <h3>Choose a date range to display pie </h3>
                <DatePickerInput
                    style={{ minWidth: 300 }}
                    clearable
                    label="Choose a date range"
                    type="range"
                    value={dateRange}
                    onChange={setDateRange}
                />

                <NumberInput label="Enter duration in days" value={duration} onChange={(value) => setDuration(value as number)} />
            </Flex>


            <div style={{ marginTop: 24 }}>
                <div ref={chartElRef} style={{ width: "100%", height: 500 }} />
            </div>
        </div>
    );
};

export default Activities;