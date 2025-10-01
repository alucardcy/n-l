import { Center, Divider, em, Flex, Group, Loader, NumberInput } from "@mantine/core";
import { useGetActivities } from "../api/activities";
import { DatePickerInput } from "@mantine/dates";
import React, { useState } from "react";
import Pie from "../components/charts/Pie";
import { useDebounce } from "../hooks/general";



const Activities = () => {
    const [dateRange, setDateRange] = useState<[string | null, string | null]>([null, null]);
    const [duration, setDuration] = useState<number>(0);

    const { data, isLoading, isSuccess } = useGetActivities({ from: dateRange[0], to: dateRange[1] });
    const debouncedDuration = useDebounce(duration, 500);



    if (isLoading) return <Center><Loader /></Center>

    return (
        <div>
            <Flex direction="column" gap="md" align="center">
                <h1>Activities</h1>
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

                    <NumberInput label="Enter duration in days" value={duration} onChange={(value) => setDuration(value as number)} />
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