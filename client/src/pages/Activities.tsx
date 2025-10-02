import { Center, Divider, Flex, Group, Loader, NumberInput, Text } from "@mantine/core";
import { useGetActivities } from "../api/activities";
import { DatePickerInput } from "@mantine/dates";
import { useMemo, useState } from "react";
import Pie from "../components/charts/Pie";
import { useDebounce } from "../hooks/general";
import dayjs from "dayjs";



const Activities = () => {
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
    const [duration, setDuration] = useState<number>(100);
    const dateRangeParams = useMemo(() => {
        if (dayjs(dateRange[0] as string).isValid() && dayjs(dateRange[1] as string).isValid()) {
            return { from: dateRange[0], to: dateRange[1] }
        }
        return {};
    }, [dateRange]);

    const { data, isLoading, isSuccess } = useGetActivities(dateRangeParams);
    const debouncedDuration = useDebounce(duration, 500);



    if (isLoading) return <Center><Loader /></Center>

    return (
        <div>
            <Flex direction="column" gap="md" align="center">
                <h1>Activities</h1>
                <div>
                    <Text>Pie chart displaying how many days each activity took to complete</Text>
                    <Text>Can be filtered by date range and days</Text>
                    <Text fw="bold" fs="italic" >Click on an activity to view any connections with other activities </Text>
                </div>
                <h3>Choose a date range to display pie </h3>
                <Group>

                    <DatePickerInput
                        style={{ minWidth: 300 }}
                        clearable
                        label="Choose a date range"
                        type="range"
                        value={dateRange}
                        onChange={setDateRange}
                    />

                    <NumberInput min={0} label="Enter duration in days" value={duration} onChange={(value) => setDuration(value as number)} />
                </Group>
            </Flex>

            <Divider my={4} />

            {isSuccess && <div style={{ marginTop: 24 }}>
                <Pie data={data} duration={debouncedDuration} />
            </div>}
        </div>
    );
};

export default Activities;