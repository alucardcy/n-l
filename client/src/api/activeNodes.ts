import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import dayjs from "dayjs";
import type { Activity } from "@nodes-links/types";

type Props = {
    from: string | null;
    to: string | null;
}
const getActiveNodes = async ({ from, to }: Props): Promise<{ dates: string[], activities: Activity[] }> => {
    if (!dayjs(from as string).isValid() && !dayjs(to as string).isValid()) {
        throw new Error("Invalid date format");
    }
    const { data } = await axiosInstance.get("/getActiveNodes", { params: { from, to } })
    return data
}

export const useGetActiveNodes = (dateRange: Props) => {
    return useQuery({
        queryKey: ['active-nodes', { dateRange }],
        queryFn: () => getActiveNodes(dateRange),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5, // 5 minutes,
        enabled: !!dateRange.from || !!dateRange.to
    })
}