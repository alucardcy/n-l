import { useQuery } from "@tanstack/react-query"
import axiosInstance from "./axiosInstance"
import type { Activity } from "@nodes-links/types"

const getActivities = async (): Promise<Activity[]> => {
    const { data } = await axiosInstance.get("/activities")
    return data
}

export const useGetActivities = () => {
    return useQuery({
        queryKey: ['activities'],
        queryFn: getActivities,
        staleTime: 1000 * 60 * 5 // 5 minutes
    })
}