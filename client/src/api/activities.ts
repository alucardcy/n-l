import { useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"
import type { Activity } from "@nodes-links/types"

type Props = {
    from?: string | null;
    to?: string | null;
}
const getActivities = async ({ from, to }: Props): Promise<Activity[]> => {
    const { data } = await axiosInstance.get("/activities", { params: { from, to } })
    // const { data } = await axiosInstance.get("/activities?from=2023-01-01&to=2023-12-31")
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

