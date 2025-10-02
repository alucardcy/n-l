import { useState } from "react";
import Line from "../components/charts/Line"
import { Center, Divider, Loader, Stack } from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useGetActiveNodes } from "../api/activeNodes";

const ActiveNodes = () => {
    const [dateRange, setDateRange] = useState<[string | null, string | null]>(["2012-01-01", "2013-01-01"]);
    const { data, isLoading, isSuccess } = useGetActiveNodes({ from: dateRange[0], to: dateRange[1] });

    return (
        <div>
            <Stack justify="center" align="center" gap="md">
                <h1>Activities running in parallel per day</h1>
                <DatePickerInput
                    style={{ minWidth: 300 }}
                    clearable
                    label="Choose a date range"
                    type="range"
                    value={dateRange}
                    onChange={setDateRange}
                />
            </Stack>

            <Divider my={"md"} />
            {isLoading && <Center><Loader /></Center>}

            {isSuccess && data && <Line data={data} />}
        </div>

    )
}
export default ActiveNodes