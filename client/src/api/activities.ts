import { useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"
import type { Activity } from "@nodes-links/types"
import dayjs from "dayjs";

type Props = {
    from?: string | null;
    to?: string | null;
}
const getActivities = async ({ from, to }: Props): Promise<Activity[]> => {
    let params = {}
    if (dayjs(from as string).isValid() && dayjs(to as string).isValid()) {
        params = { from, to }
    }
    const { data } = await axiosInstance.get("/activities", { params: params })
    return data
}



export const useGetActivities = ({ to, from }: Props) => {
    return useQuery({
        queryKey: ['activities', { from, to }],
        queryFn: () => getActivities({ from, to }),
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 5 // 5 minutes,
    })
}

