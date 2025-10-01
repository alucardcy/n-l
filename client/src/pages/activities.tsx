import { useGetActivities } from "../api/activities"

type Props = {}
const Activities = (props: Props) => {

    const { data, isLoading, error } = useGetActivities()
    console.log(data);


    return (
        <div>activities</div>
    )
}
export default Activities